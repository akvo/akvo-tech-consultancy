<?php

namespace App\Http\Controllers\api;

use Grimzy\LaravelMysqlSpatial\Types\Point;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Libraries\Flow;
use App\Libraries\FlowScale;
use App\Survey;
use App\Form;
use App\DataPoint;
use App\QuestionGroup;
use App\Cascade;
use App\Question;
use App\Option;
use App\FormInstance;
use App\Answer;
use App\AnswerOption;
use App\AnswerCascade;
use App\Sync;

class InitController extends Controller
{
    public function seedSurveyForms(Flow $flow, Survey $surveys)
    {
        $flowScale = new FlowScale();
        $survey = collect(config('surveys.surveyId'))->map(function ($surveyId) use ($surveys, $flow, $flowScale) {
            $data = $flow->get('surveys', $surveyId);
            $registrationId = (int) $data['registrationFormId'];
            if ($registrationId === 0) {
                $registrationId = null;
            }

            echo('Seeding Surveys Table...'.PHP_EOL);
            $postSurvey = $surveys->create([
                'id' => (int) $surveyId,
                'name' => $data['name'] ? $data['name'] : "Default Name",
                'registration_id' => $registrationId
            ]);
            $postSurvey->save();

            $formData = collect($data['forms']);
            if ($formData->count() === 0) {
                return $surveys;
            }

            // seed Data Point
            $postDataPoints = $this->seedDataPoints($flow, new DataPoint(), $surveyId);

            // seed Forms
            $postForms = $formData->map(function ($form) use ($flow, $surveyId, $flowScale) {
                echo('Seeding Forms Table...'.PHP_EOL);
                $postForm = new Form([
                    'id' => (int) $form['id'],
                    'survey_id' => (int) $surveyId,
                    'name' => $form['name']
                ]);
                $postForm->save();

                // collect question from flow-api
                $dataFlowScale = $flowScale->getQuestions($form['id']);
                $questionFlowScale = $this->collectQuestionFlowScale($collections = collect(), $dataFlowScale);

                // collect Form Instances (also seed) & Answers
                $responseCollections = collect();
                $formInstances = $flow->get('forminstances', $surveyId, (int) $form['id']);
                if (collect($formInstances['formInstances'])->count() !== 0) {
                    $collections = collect();
                    $collections = $this->collectFormInstances($collections, $formInstances);
                    do {
                        $nextPage = false;
                        if (isset($formInstances['nextPageUrl'])) {
                            $nextPage = true;
                            $formInstances = $flow->fetch($formInstances['nextPageUrl']);
                            $collections = $this->collectFormInstances($collections, $formInstances);
                        }
                    } while ($nextPage);

                    // seed Form Instances
                    $postFormInstances = $collections->each(function ($item) use ($form, $responseCollections) {
                        echo('Seeding Form Instances Table...'.PHP_EOL);
                        $postFormInstance = new FormInstance([
                            'fid' => (int) $item['id'],
                            'form_id' => (int) $form['id'],
                            'data_point_id' => (int) $item['dataPointId'],
                            'identifier' => $item['identifier'],
                            'submitter' => $item['submitter'],
                            'device' => $item['deviceIdentifier'],
                            'submission_date' => date('Y-m-d', strtotime($item['submissionDate'])),
                            'survey_time' => $item['surveyalTime']
                        ]);
                        $postFormInstance->save();

                        echo('Collecting Responses...'.PHP_EOL);
                        $responseCollections->push([
                            'formInstanceId' => $postFormInstance->id,
                            'responses' => $item['responses']
                        ]);
                    });
                }

                // seed Question Groups, Questions, Cascades, Options
                $postQuestionGroups = [];
                if (collect($form['questionGroups'])->count() !== 0) {
                    echo('Seeding Question Groups Table...'.PHP_EOL);
                    $postQuestionGroups = $this->seedQuestionGroup($form, $flowScale, $questionFlowScale, $responseCollections);
                }

                $postForm['questionGroups'] = $postQuestionGroups;
                return $postForm;
            });

            return [
                'surveys' => $postSurvey,
                'dataPoints' => $postDataPoints,
                'forms' => $postForms
            ];
        });

        return $survey;
    }

    private function collectFormInstances($collections, $results)
    {
        echo('Collecting Form Instances...'.PHP_EOL);
        $formInstances = collect($results['formInstances'])->map(function ($formInstance) use ($collections) {
            if (Arr::has($formInstance, 'dataPointId') && $formInstance['dataPointId'] !== "") {
                $collections->push($formInstance);
            }
            return $collections;
        });
        dump($collections->count());
        return $collections;
    }

    private function collectQuestionFlowScale($collections, $results)
    {
        if (!isset($results['questionGroup'])) {
            return null;
        }

        if (array_keys($results['questionGroup']) !== range(0, count($results['questionGroup']) - 1)) {
            $questionGroups = collect($results['questionGroup']['question'])->map(function ($question) use ($collections) {
                $question = isset($question['id']) ? [$question] : $question;
                $collections->push($question);
                return $collections;
            });
        } else {
            $questionGroups = collect($results['questionGroup'])->map(function ($questionGroup) use ($collections) {
                $questions = isset($questionGroup['question']['id']) ? [$questionGroup['question']] : $questionGroup['question'];
                $questions = collect($questions)->map(function ($question) use ($collections) {
                    $collections->push($question);
                    return $collections;
                });
                return $collections;
            });
        }

        return $collections;
    }

    private function seedQuestionGroup($results, $flowScale, $questionFlowScale, $responseCollections)
    {
        $questionGroups = collect($results['questionGroups'])->map(
            function ($questionGroup) use ($results, $flowScale, $questionFlowScale, $responseCollections) {
                $repeat = 0;
                if ($questionGroup['repeatable']) {
                    $repeat = 1;
                }

                $postQuestionGroup = new QuestionGroup([
                    'id' => (int) $questionGroup['id'],
                    'form_id' => (int) $results['id'],
                    'name' => $questionGroup['name'],
                    'repeat' => $repeat
                ]);
                $postQuestionGroup->save();

                $postQuestions = [];
                if (collect($questionGroup['questions'])->count() !== 0) {
                    echo('Seeding Questions Table...'.PHP_EOL);
                    $postQuestions = $this->seedQuestion($questionGroup, $results['id'], $flowScale, $questionFlowScale, $responseCollections);
                }

                $postQuestionGroup['questions'] = $postQuestions;
                return $postQuestionGroup;
            }
        );

        return $questionGroups;
    }

    private function seedQuestion($results, $formId, $flowScale, $questionFlowScale, $responseCollections)
    {
        $questionFlowScale = $questionFlowScale->map(function ($x) { return $x[0]; });
        $questions = isset($results['questions']['id']) ? [$results['questions']] : $results['questions'];
        $questions = collect($questions)->each(
            function ($question) use ($results, $formId, $flowScale, $questionFlowScale, $responseCollections) {
                $search = collect($questionFlowScale)->firstWhere('id', $question['id']);
                $parentId = NULL;
                if (isset($search['cascadeResource'])) {
                    // seed level as parent 0
                    echo('Seeding Cascades Table...'.PHP_EOL);
                    $checkCascades = Cascade::where('name', $search['cascadeResource'])->get();
                    if (collect($checkCascades)->count() === 0) {
                        $postParent = new Cascade([
                            'parent_id' => NULL,
                            'code' => NULL,
                            'name' => $search['cascadeResource'],
                            'level' => NULL
                        ]);
                        $postParent->save();
                        $parentId = $postParent->id;
                        $postCascades = $this->seedCascades($flowScale, $search['cascadeResource'], 0, $parentId);
                    } else {
                        $parentId = $checkCascades->pluck('id')[0];
                    }
                }

                // seed Questions
                $postQuestions = [];
                if (isset($search['type'])) {
                    $type = $search['type'];
                    if ($type === 'free' && isset($search['validationRule'])) {
                        $type = $search['validationRule']['validationType'];
                    }

                    $dependency = NULL;
                    $dependency_answer = NULL;
                    if (isset($search['dependency'])) {
                        $dependency = (int) $search['dependency']['question'];
                        $dependency_answer = $search['dependency']['answer-value'];
                    }

                    $postQuestions = new Question([
                        'id' => (int) $question['id'],
                        'form_id' => (int) $formId,
                        'dependency' => $dependency,
                        'dependency_answer' => $dependency_answer,
                        'question_group_id' => (int) $results['id'],
                        'cascade_id' => $parentId,
                        'name' => $search['text'],
                        'type' => $type
                    ]);
                    $postQuestions->save();
                }

                if (isset($search['options'])) {
                    $options = $search['options'];
                    $other = 0;
                    if ($options['allowOther']) {
                        $other = 1;
                    }

                    $option = $options['option'];
                    if (array_keys($option) !== range(0, count($option) - 1)) {
                        // associative array
                        echo('Seeding Options Table...'.PHP_EOL);
                        $code = Str::of($option['value'])->ltrim();
                        $name = Str::of($option['text'])->ltrim();
                        $postOption = new Option([
                            'question_id' => $question['id'],
                            'code' => Str::lower($code),
                            'name' => Str::lower($name),
                            'other' => $other
                        ]);
                        $postOption->save();
                    } else {
                        $postOptions = collect($option)->each(function ($option) use ($question, $other) {
                            echo('Seeding Options Table...'.PHP_EOL);
                            $code = Str::of($option['value'])->ltrim();
                            $name = Str::of($option['text'])->ltrim();
                            $postOption = new Option([
                                'question_id' => $question['id'],
                                'code' => Str::lower($option['value']),
                                'name' => Str::lower($option['text']),
                                'other' => $other
                            ]);
                            $postOption->save();
                            return $postOption;
                        });
                    }
                }

                // fetching and seed Response
                if ($responseCollections->count() !== 0 && isset($search['type'])) {
                    $postResponses = $responseCollections->map(function ($response) use ($results, $question, $search) {
                        if(!isset($response['formInstanceId'])) {
                            return null;
                        }

                        echo('Fetching Responses...'.PHP_EOL);
                        $repeatIndex = 0;
                        $formInstanceId = $response['formInstanceId'];
                        $responseGroup = collect($response['responses']);
                        $responseGroup->each(function ($item, $key) use ($results, $question, $repeatIndex, $formInstanceId, $search) {
                            if ($key != $results['id']) {
                                return null;
                            }

                            if ($results['repeatable']) {
                                $repeatIndex = $repeatIndex + 1;
                            }

                            $responses = collect($item)->map(function ($item, $rix) use ($results, $question, $repeatIndex, $formInstanceId, $search) {
                                if (!isset($item[$question['id']])) {
                                    return null;
                                }

                                echo('Seeding Answers Table...'.PHP_EOL);
                                $answer = $item[$question['id']];
                                $name = $answer;
                                $value = NULL;

                                if ($search['type'] === 'free' && isset($search['validationRule'])) {
                                    if ($search['validationRule']['validationType'] == 'numeric') {
                                        $name = NULL;
                                        $value = (int) $answer;
                                    }
                                }

                                if ($search['type'] === 'date') {
                                    $name = date('Y-m-d', strtotime($answer));
                                }

                                if ($search['type'] === 'geo') {
                                    $name = $answer['lat'] . ', ' . $answer['long'];
                                }

                                if ($search['type'] === 'photo') {
                                    $name = $answer['filename'];
                                }

                                if ($search['type'] === 'option') {
                                    $name = NULL;
                                }

                                if ($search['type'] === 'cascade') {
                                    $name = NULL;
                                }

                                $postAnswer = new Answer([
                                    'form_instance_id' => $formInstanceId,
                                    'question_id' => $question['id'],
                                    'name' => $name,
                                    'value' => $value,
                                    'repeat_index' => $rix
                                ]);
                                $postAnswer->save();

                                if ($search['type'] === 'option') {
                                    $postAnswerOptions = collect($answer)->each(function ($value) use ($postAnswer) {
                                        $checkVar = Str::lower($value['text']);
                                        $option = Option::where('name', $checkVar)->get();

                                        // Update answer table
                                        $updateAnswer = Answer::find($postAnswer->id);
                                        $updateAnswer->name = $checkVar;
                                        $result = $updateAnswer->save();

                                        if ($option->count() !== 0) {
                                            $optionId = $option->pluck('id')[0];
                                            $postAnswerOption = new AnswerOption([
                                                'answer_id' => $postAnswer->id,
                                                'option_id' => $optionId
                                            ]);
                                            $result = $postAnswerOption->save();
                                        }

                                        return $result;
                                    });
                                }

                                if ($search['type'] === 'cascade') {
                                    $checkVar = Str::lower(end($answer)['name']);

                                    // Update answer table
                                    $updateAnswer = Answer::find($postAnswer->id);
                                    $updateAnswer->name = $checkVar;
                                    $result = $updateAnswer->save();

                                    $cascade = Cascade::where('name', $checkVar)->get();
                                    if ($cascade->count() !== 0) {
                                        $cascadeId = $cascade->pluck('id')[0];
                                        $postAnswerCascade = new AnswerCascade([
                                            'answer_id' => $postAnswer->id,
                                            'cascade_id' => $cascadeId
                                        ]);
                                        $postAnswerCascade->save();
                                    }
                                }

                                return $postAnswer;
                            });

                            return $responses;
                        });

                        return $response;
                    });
                }

                return $postQuestions;
            }
        );

        return $questions;
    }

    private function seedCascades($flowScale, $resource, $parent, $parentId, $level = 0)
    {
        $cascades = collect($flowScale->getCascades($resource, $parent));
        if ($cascades->count() !== 0) {
            echo('Seeding Cascades Table...'.PHP_EOL);
            $post = $cascades->each(function ($cascade) use ($flowScale, $resource, $parentId, $level) {
                //$checkCascades = Cascade::where('name', Str::lower($cascade['name']))->get();
                //if (collect($checkCascades)->count() !== 0) {
                //    return null;
                //}

                $code = Str::of($cascade['code'])->ltrim();
                $name = Str::of($cascade['name'])->ltrim();
                $postCascades = new Cascade([
                    'parent_id' => $parentId,
                    'code' => Str::lower($code),
                    'name' => Str::lower($name),
                    'level' => $level
                ]);
                $postCascades->save();
                $nextLevel = $level + 1;
                $this->seedCascades($flowScale, $resource, $cascade['id'], $postCascades->id, $nextLevel);
            });
            return $post;
        }
        return null;
    }

    public function seedDataPoints(Flow $flow, DataPoint $dataPoints, $surveyId)
    {
        $collections = collect();
        $results = $flow->get('datapoints', $surveyId, $dataPoint = true);
        $collections = $this->collectDataPoint($collections, $results, $surveyId);

        do {
            $nextPage = false;
            if (isset($results['nextPageUrl'])) {
                $nextPage = true;
                $results = $flow->fetch($results['nextPageUrl']);
                $collections = $this->collectDataPoint($collections, $results, $surveyId);
            }
        } while ($nextPage);

        echo('Initial Seeding Sync Table...'.PHP_EOL);
        $syncs = $flow->sync('sync');
        $postSync = new Sync([
            'survey_id' => (int) $surveyId,
            'url' => $syncs['nextSyncUrl'],
        ]);
        $postSync->save();

        echo('Seeding Data Points Table...'.PHP_EOL);
        $postDataPoints = $collections->each(function ($item) use ($dataPoints) {
            $post = $dataPoints->create($item);
            $post->save();
            return $post;
        });

        return $postDataPoints;
    }

    private function collectDataPoint($collections, $results, $surveyId)
    {
        echo('Collecting Data Point...'.PHP_EOL);
        $dataPoints = collect($results['dataPoints'])->each(function ($dataPoint) use ($collections, $surveyId) {
            //$position = new Point($dataPoint['latitude'], $dataPoint['longitude']);
            $position = $dataPoint['latitude'].', '.$dataPoint['longitude'];
            $post = [
                'id' => (int) $dataPoint['id'],
                'survey_id' => (int) $surveyId,
                'display_name' => $dataPoint['displayName'],
                'position' => $position
            ];
            $collections->push($post);
            return $collections;
        });

        return $collections;
    }
}
