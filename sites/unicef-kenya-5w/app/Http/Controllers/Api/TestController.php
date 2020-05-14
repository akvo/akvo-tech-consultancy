<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Option;
use App\Question;

class TestController extends Controller
{
    public function getWashDomain(Request $requests, Option $options, Question $questions)
    {
        return [
            'wash_domain' => [
                'id' => config('query.wash_domain.id'),
                'childrens' => [
                    'coordination' => $this->transformWashDomain($options, 'coordination'),
                    'hygiene' => $this->transformWashDomain($options, 'hygiene'),
                    'sanitation' => $this->transformWashDomain($options, 'sanitation'),
                    'water' => $this->transformWashDomain($options, 'water'),
                    'health' => $this->transformWashDomain($options, 'health'),
                    'other' => $this->transformWashDomain($options, 'other'),
                ],
               // 'values' => [
               //     $questions->where('dependency', config('query.wash_domain'))->with('answers')->get()
               // ],
            ],
        ];
    }

    private function dependencyAnswers($options, $ids)
    {
        // question.dependencychilds otomatis return semua question dependency, bukan sesuai yang di option;
        return $options->whereIn('id', $ids)
                    ->has('answers')
                    ->with('answers.formInstance')
                    ->has('question.dependencyChilds.answers')
                    ->with('question.dependencyChilds.answers')
                    ->get();
    }

    private function transformWashDomain($options, $config)
    {
        $washDomainConfig = 'query.wash_domain.opt_id.';
        $results = $this->dependencyAnswers($options, config($washDomainConfig.$config)); 
        return $results;
        if($results->isEmpty()) {
            $results['activity'] = null;
            $results['answers'] = [
                'indicator' => null,
                'achived' => 0,
                'plannend' => 0
            ];
            return $results;
        }

        $transformData = $results->map(function ($item) use ($config) {
            $values = collect();
            $questions = collect($item['question']);
            $dependencies = collect($questions->get('dependency_childs'))->each(function ($dependency) use ($values) {
                if (collect($dependency['answers'])->isNotEmpty() && $dependency['type'] === 'numeric') {
                    $name = Str::contains($dependency['name'], 'Quantity Archived') ? 'achived' : 'planned';
                    $separator = ($name === 'achived') ? ' - Quantity Archived' : ' - Quantity Planned';
                    $values['indicator'] = Str::beforeLast($dependency['name'], $separator);
                    $values[$name] = collect($dependency['answers'])->reduce(function ($total, $value) {
                        return $total + $value['value']; 
                    });
                }

                if (collect($dependency['answers'])->isNotEmpty() && $dependency['type'] === 'free') {
                    $values['answers'] = collect($dependency['answers'])->pluck('name');
                }
            });
            
            //$item = $item->makeHidden('id', 'question_id', 'other', 'code', 'question');
            $data['activity'] = Str::afterLast($item['name'], $config.' - ');
            $data['answers'] = $values;
            return $item;
        });

        return $transformData;
    }

    public function getValueById(
        Request $request,
        AnswerOption $answerOption,
        Answer $answers,
        Cascade $cascades
    ) {
        $domains = collect(config('query.wash_domain.domains'))->map(function($data, $key){
            return [
                "id" => $data["id"],
                "name" => $key
            ];
        })->values()->where('id', $request->id)->first()["name"];
        $options = config('query.wash_domain.opt_id.'.$domains);
        $data = $answerOption->whereIn('option_id',$options)
                             ->with('answer')->get()->transform(function($data){
                                 return [
                                     "name" => Str::afterLast($data->answer->name, " - "),
                                     "form_instance_id" => $data->answer->form_instance_id,
                                     "id" => $data->option_id
                                 ];
                             });
        $data = $data->mapToGroups(function($item, $key){
            return [$item["name"] => [$item["form_instance_id"], $item["id"]]];
        });
        $data = $data->map(function($item, $key) use ($answers, $cascades) {
            $answers = $answers->whereIn("form_instance_id", $item["0"])
                               ->with('question')->get();
            $base = collect();
            $country = collect();
            $values = collect();
            $answers = $answers->transform(function($answer) use ($cascades, $base, $country, $values) {
                $value = $answer->value;
                if ($value === null) {
                    $value = false;
                }
                if ($answer->question->type === "cascade"){
                    $value = $answer->cascades->first();
                    $cascade = $cascades->where('id', $value->id)->with('parents')->first();
                    $parent_name = $cascade->parents->name;
                    if ($answer->question->name === "Location") {
                        $base["country"] = [
                            "id" => $cascade->parents->id,
                            "name" => $cascade->parents->name,
                        ];
                        return false;
                    }
                }
                if ($answer->question->type === "numeric") {
                    $country = $base->values()->first();
                    $values[$answer->question->name] = [
                        "id" => $answer->form_instance_id,
                        "name" => $answer->name,
                        "value" => $answer->value,
                        "country" => $country,
                    ];
                    return false;
                }
                return false;
            })->values();
            $values = $values->map(function($item, $key){
                return [
                    "name" => $key,
                    "value" => $item
                ];
            })->values()->map(function($data){
                if (isset($data["value"]["country"])){
                    $name = Str::lower($data["name"]);
                    if (Str::contains($name, ' - quantity')){
                        $name = Str::afterLast($name, ' - quantity ');
                    }
                    $name = Str::replaceFirst(' beneficiaries ', '_' , $name);
                    return [
                        "name" => $name,
                        "country_id" => $data["value"]["country"]["id"],
                        "country_name" => Str::title($data["value"]["country"]["name"]),
                        "value" => $data["value"]["value"]
                    ];
                }
                return false;
            })->filter()->groupBy("country_name");
            return [
                "id" => $item[1][1],
                "name" => $key,
                "country_values" => $values
            ];
        })->values();
        return $data;
    }
}
