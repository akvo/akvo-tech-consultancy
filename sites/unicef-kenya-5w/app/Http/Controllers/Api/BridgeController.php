<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BridgeController extends Controller
{
    public function startSeed()
    {
        echo("Getting data from database".PHP_EOL);
        $questions = new \App\Question ();
        $groups = $questions->whereIn('question_group_id', config('query.groups'))->pluck('id');
        $groups->push(config('query.cascade.locations')); // location questions

        $formInstances = new \App\FormInstance ();
        $results = $formInstances->with(['answers' => function ($query) use ($groups) {
           $query->whereIn('question_id', $groups); 
           $query->with(['question', 'options', 'cascades']);
        }],)->get();

        echo("Seeding data...".PHP_EOL);
        $domains = config('query.wash_domain.domains');
        $results->each(function ($item) use ($domains) {
            $postData = collect();
            $item->answers->each(function ($answer) use ($domains, $postData) {
                $qlocId = config('query.cascade.locations');
                $washId = config('query.wash_domain.id');
                $whom = config('query.for_whom');

                if ($answer->question->id === $qlocId) {
                    $cascades = $answer->cascades->first();
                    $postData['county'] = $cascades->parent_id;
                    $postData['sub_county'] = $cascades->id;
                }

                $domainName = Str::beforeLast($answer->name, ' - ');
                if ($answer->question->id === $washId) {
                    $options = $answer->options->first();
                    $postData['domain'] = $domains[$domainName]['id'];
                    $postData['sub_domain'] = $options->id; 
                }

                if ($answer->question->id === $washId && ($domainName === 'sanitation' || $domainName === 'health' || $domainName === 'other')) {
                    $postData['other_status'] = true;
                } 

                if ($answer->question->dependency === $washId && isset($postData['other_status']) == true) {
                    $postData['other'] = $answer->id;
                }

                if ($answer->question->dependency === $washId && Str::contains($answer->question->name, '- Quantity Planned')) {
                    $postData['value_planned'] = $answer->id;
                }

                if ($answer->question->dependency === $washId && Str::contains($answer->question->name, '- Quantity Archived')) {
                    $postData['value_achived'] = $answer->id;
                }

                if ($answer->question->id === $whom['total']['planned']) {
                    $postData['beneficiaries_planned'] = $answer->id; 
                }

                if ($answer->question->id === $whom['total']['achived']) {
                    $postData['beneficiaries_achived'] = $answer->id; 
                }

                if ($answer->question->id === $whom['girl']) {
                    $postData['girl_achived'] = $answer->id; 

                }

                if ($answer->question->id === $whom['boy']) {
                    $postData['boy_achived'] = $answer->id; 
                }

                if ($answer->question->id === $whom['woman']) {
                    $postData['woman_achived'] = $answer->id; 
                }

                if ($answer->question->id === $whom['man']) {
                    $postData['man_achived'] = $answer->id; 
                }
            });

            $valuePlanned = isset($postData['value_planned']) ? $postData['value_planned'] : NULL;
            $valueAchived = isset($postData['value_achived']) ? $postData['value_achived'] : NULL;
            $other = isset($postData['other']) ? $postData['other'] : NULL;

            $postBridges = new \App\Bridge ([
                'form_instance_id' => $item->id,
                'county' => $postData['county'],
                'sub_county' => $postData['sub_county'], 
                'domain' => $postData['domain'],
                'sub_domain' => $postData['sub_domain'], 
                'value_planned' => $valuePlanned,
                'value_achived' => $valueAchived,
                'other' => $other,
                'beneficiaries_planned' => $postData['beneficiaries_planned'],
                'beneficiaries_achived' => $postData['beneficiaries_achived'],
                'girl_achived' => $postData['girl_achived'],
                'boy_achived' => $postData['boy_achived'],
                'woman_achived' => $postData['woman_achived'],
                'man_achived' => $postData['man_achived'],
            ]);
            $postBridges->save();
        });

        return $results;
    }

    public function truncateTable()
    {
        return \App\Bridge::truncate();
    }
}
