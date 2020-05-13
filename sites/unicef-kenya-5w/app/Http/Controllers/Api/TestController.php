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
}
