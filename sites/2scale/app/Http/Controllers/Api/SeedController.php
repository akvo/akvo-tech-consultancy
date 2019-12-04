<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Faker\Generator as Faker;
use App\Partnership;
use App\Form;
use App\Question;
use App\Option;
use App\Datapoint;
use App\Answer;


class SeedController extends Controller
{
    public function seedDataPoint($survey_group_id, $total, Form $forms, Partnership $partners, Faker $faker, Datapoint $datapoints) 
    {
        $partner_ids = $partners->select('id')->whereNotNull('parent_id')->get();
        $partner_ids = $partner_ids->pluck('id');
        $i = 0;
        $status = collect();
        do {
            $fake_id = '9999' . $survey_group_id;
            if ($i < 100) {
                $fake_id .= '0';
            }
            if ($i < 10) {
                $fake_id .= '0';
            }
            $datapoint_id = $fake_id . $i;
            $partner = $partners->where('id',$faker->randomElement($partner_ids))->with('parents')->first();

            $form = $forms->where('survey_group_id', $survey_group_id)->with('questions.options')->get();
            $questionnaire = $faker->randomElement($form);
            $form_id = $questionnaire->form_id;
            $partner_qid = $questionnaire->partner_qid;

            $answers = collect($questionnaire->questions)->map(function($question)
                use ($faker, $datapoint_id, $partner_qid, $partner) {
                $qid = $question->question_id;
                $answer = $this->fakeAnswer($faker, $question, $partner_qid, $partner);
                $answer['question_id'] = $qid;
                return new Answer($answer);
            });

            $datapoint =  array(
                'survey_group_id' => (int) $survey_group_id,
                'form_id' => $form_id,
                'partnership_id' => $partner->id,
                'country_id' => $partner->parents->id,
                'datapoint_id' => (int) $datapoint_id,
                'submission_date' => now(),
            );

            $id = $datapoints->insertGetId($datapoint);
            $inserted = $datapoints->find($id)->answers()->saveMany($answers);
            $status->push(['id' => $datapoint_id, 'inserted' => $inserted]);
            $i++;
        } while ($i < $total);
        return $status;
    }

    private function fakeAnswer($faker, $question, $partner_qid, $partner) {
        $text = null;
        $value = null;
        $options = [];
        $notPartnerCascade = true;
        if ($question->question_id === $partner_qid) {
            $text = $partner->parents->name . '|' . $partner->name;
            $notPartnerCascade = false;
        }
        if ($question->type === 'cascade' && $notPartnerCascade) {
            $text = collect();
            $result = $this->getFakeCascadeAnswer($question->resource, 0, $faker);
            $text->push($result);
            $next = true;
            do{
                $next = false;
                if ($result) {
                    $next = true;
                    $result = $this->getFakeCascadeAnswer($question->resource, $result['id'], $faker);
                    $text->push($result);
                }
            } while ($next);
            if ($text->count() > 1) {
                $text = $text->filter()->pluck('name')->join('|');
            }
        }
        if ($question->type === 'free') {
            $text = $faker->sentence($nbWords = 2, $variableNbWords = true);
            if(Str::contains($question->text, ['phone'])) {
                $text = $faker->phoneNumber;
            }
            if(Str::contains($question->text, ['email'])) {
                $text = $faker->companyEmail;
            }
        }
        if ($question->type === 'option') {
            $question->answer = $faker->randomElements($question->options);
            if ($question['options'][0]['type'] === "multiple"){
                $optionsCount = $faker->numberBetween($min=1, $max=count($question->options));
                $choose = $faker->randomElements($question->options, $count=$optionsCount);
                $options = collect($choose)->pluck('id');
                $text = collect($choose)->pluck('text')->join('|');
            }
            if ($question['options'][0]['type'] === "single"){
                $choose = $faker->randomElements($question->options);
                $options = collect($choose)->pluck('id');
                $text = collect($choose)->pluck('text')[0];
            }
        }
        if ($question->type === 'number') {
            $text = $faker->numberBetween($min = 10, $max = 20);
            $value = $text;
        }
        if ($question->type === 'date') {
            $text = now();
        }
        if ($question->type === 'photo') {
            $text = 'https://fakeimg.pl/250x100/';
        }
        return array(
            'text' => $text,
            'value' => $value,
            'options' => json_encode($options)
        );
    }

    private function getFakeCascadeAnswer($resource, $level, $faker) {
        $client = new \GuzzleHttp\Client();
        $url = config('akvo.endpoints.cascade') . $resource . '/' . $level; 
        try {
            $response = $client->get($url);
            if ($response->getStatusCode() === 200) {
                $value = json_decode($response->getBody(), true);
                $value = $faker->randomElement($value);
                return $value;
            }
        } catch(RequestException $e) {
            return false;
        }
        return false;
    }

}
