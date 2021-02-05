<?php

namespace App\Seeds;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Akvo\Models\DataPoint;
use Akvo\Models\FormInstance;
use Akvo\Models\Question;
use Akvo\Models\Answer;
use Akvo\Models\Option;
use Akvo\Models\Cascade;
use Akvo\Models\AnswerOption;
use Akvo\Models\AnswerCascade;

class DataPointSeeder
{
    public function __construct($api, $surveyId) {
        $this->api = $api;
        $this->surveyId = (int) $surveyId;
    }

    public function seed($data) {
        echo('Seeding Datapoints');
        $this->seedDataPoints($data['dataPointsUrl']);
        echo(PHP_EOL.'Done Seeding Datapoints'.PHP_EOL);
        echo('Seeding FormInstances');
        foreach($data['forms'] as $form) {
            $formId = (int) $form['id'];
            $this->seedFormInstances($form['formInstancesUrl'], $formId);
        }
        echo(PHP_EOL.'Done Seeding FormInstances'.PHP_EOL);
    }

    public function seedDataPoints($url) {
        $data = $this->api->fetch($url);
        foreach($data['dataPoints'] as $dataPoint) {
            $position = null;
            $position = $dataPoint['latitude'] !== null
                ? $dataPoint['latitude'].'|'.$dataPoint['longitude']
                : null;
            $dataPointId = (int) $dataPoint['id'];
            DataPoint::updateOrCreate([
                'id' => (int) $dataPoint['id'],
                'survey_id' => $this->surveyId,
                'display_name' => $dataPoint['displayName'],
                'position' => $position,
                'created_at' => Carbon::parse($dataPoint['createdAt'])
            ]);
        }
        if (isset($data['nextPageUrl'])) {
            echo('.');
            $this->seedDataPoints($data['nextPageUrl']);
        }
        return;
    }

    public function seedFormInstances($url, $formId) {
        $data = $this->api->fetch($url);
        foreach($data['formInstances'] as $formInstance){
            $formInstanceId = FormInstance::updateOrCreate([
                'fid' => (int) $formInstance['id'],
                'form_id' => $formId,
                'data_point_id' => $formInstance['dataPointId'],
                'identifier' => $formInstance['identifier'],
                'submitter' => $formInstance['submitter'],
                'device' => $formInstance['deviceIdentifier'],
                'submission_date' => date('Y-m-d', strtotime($formInstance['submissionDate'])),
                'survey_time' => $formInstance['surveyalTime']
            ])->id;
            $responses = $formInstance['responses'];
            if (is_null($responses)) {
                continue;
            }
            foreach($responses as $questionGroupId => $questionGroup) {
                $resIndex = 0;
                foreach($questionGroup as $repeatIndex => $questions) {
                    foreach($questions as $questionId => $value){
                        $question = Question::find((int) $questionId);
                        $type = $question->type;
                        $parsedValue = $this->parseValue($value, $type);
                        $answerId = Answer::updateOrCreate([
                            'form_instance_id' => $formInstanceId,
                            'question_id' => $question->id,
                            'name' => $type === "numeric" ? null : $parsedValue,
                            'value' => $type === "numeric" ? $parsedValue : null,
                            'repeat_index' => $resIndex,
                        ])->id;
                        if ($type === "option") {
                            $values = collect($value)->pluck('text');
                            $options = Option::where('question_id', $question->id)
                                ->whereIn('name', $values)->get();
                            foreach($options as $option) {
                                AnswerOption::updateOrCreate([
                                    'answer_id' => $answerId,
                                    'option_id' => $option->id,
                                ]);
                            }
                        }
                        if ($type === "cascade") {
                            $level = count($value);
                            $name = $value[$level - 1]['name'];
                            $cascade = Cascade::where('level', $level)
                                ->where('name', $name)
                                ->first();
                            if ($cascade) {
                                AnswerCascade::updateOrCreate([
                                    'answer_id' => $answerId,
                                    'cascade_id' => $cascade->id
                                ]);
                            }
                        }
                    }
                    $resIndex += 1;
                }
            }
        }
        if (isset($data['nextPageUrl'])) {
            echo('.');
            $this->seedFormInstances($data['nextPageUrl'], $formId);
        }
        return;
    }

    private function parseValue($value, $type) {
        switch($type){
            case "numeric":
                return (int) $value;
            case "cascade":
                return null;
            case "option":
                return null;
            case "photo":
                return $value["filename"];
            case "date":
                return date('Y-m-d', strtotime($value));
            case "geo":
                return $value["lat"].'|'.$value["long"];
            default:
                return $value;
        }
    }
}
