<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Option;
use App\Question;
use App\FormInstance;
use App\AnswerOption;
use App\Answer;
use App\Cascade;

class QueryController extends Controller
{
    public function getWashDomain(Request $requests, FormInstance $forminstances)
    {
        $data = $forminstances->has('answers.options')->get();
        $data = collect($data)->map(function($item){
            $domain = collect();
            $values = collect();
            $resuts = collect();
            collect($item->answers)->each(function($answer) use ($domain , $values){
                if($answer->question_id === config('query.wash_domain.id')){
                    $domain["parent"] = Str::beforeLast($answer->name, ' - ');
                    $domain["children"] = Str::afterLast($answer->name, ' - ');
                }
                $name = Str::lower($answer->question->name);
                $numeric = $answer->question->type === "numeric";
                if (Str::contains($name, ' - quantity')){
                    $name = Str::afterLast($name, ' - ');
                }
                if($numeric){
                    $values[$name] = $answer->value;
                }
            });
            return [
                "domain"=> $domain,
                "values"=> $values,
            ];
        });
        return $data;
    }

    public function getValueById(
        Request $request,
        AnswerOption $answerOption,
        Answer $answers,
        Cascade $cascades,
        FormInstance $forminstances
    ) {
        $domains = collect(config('query.wash_domain.domains'))->map(function($data, $key){
            return [
                "id" => $data["id"],
                "name" => $key
            ];
        })->values()->where('id', $request->id)->first()["name"];
        $options = config('query.wash_domain.opt_id.'.$domains);
        $data = $answerOption->whereIn('option_id',$options)
                             ->with('answer')->get()->transform(function($data) use ($answers){
                                 $fid = $data->answer->form_instance_id;
                                 $country = $answers
                                     ->where('form_instance_id',$fid)
                                     ->where('question_id', config('query.cascade.locations'))
                                     ->first();
                                 $values = $answers
                                     ->select('id', 'value', 'question_id')
                                     ->where('form_instance_id',$fid)
                                     ->whereNotNull('value')
                                     ->with('question')->get()->transform(function($data) use ($country) {
                                         return [
                                             "value" => $data->value,
                                             "id" => $data->id,
                                             "name" => $data->question->name,
                                             "domains" => $data->question->domains,
                                             "country" => Str::title($country->name),
                                             "country_id" => $country->id,
                                             "code" => $country->code,
                                         ];
                                     });
                                 return [
                                     "id" => $data->option_id,
                                     "name" => Str::afterLast($data->answer->name, " - "),
                                     "form_instance_id" => $fid,
                                     "values" => $values,
                                 ];
                             });
        $data = $data->mapToGroups(function($item, $key){
            $value = collect($item["values"])[1];
            return [$item["name"] => [
                "parent_id" => $item["id"],
                "id" => $item["form_instance_id"],
                "name" => $value["name"],
                "description" => NULL,
                "value" => $value["value"],
                "country" => [
                    "id" => $value["country_id"],
                    "name" => $value["country"],
                    "code" => $value["code"],
                ]
            ]];
        })->map(function($data, $key) use ($request){
            return [
                "id" => $data[0]["parent_id"],
                "parent_id" => (int) $request->id,
                "name" => $key,
                "unit" => NULL,
                "color" => NULL,
                "country_values" => $data,
                "total" => [
                    "values" => $data->sum("value"),
                    "countries" => $data->count()
                ],
                "parents" => [
                    "id" => (int) $request->id,
                    "name" => (int) $request->id,
                ]
            ];
        })->values();
        return $data;
    }
}
