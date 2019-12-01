<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Arr;
use App\Libraries\Flow;
use App\SurveyGroup;
use App\Partnership;
use App\Form;
use App\Question;
use App\Option;
use App\Datapoint;
use App\Answer;

class SyncController extends Controller
{
    public function syncPartnerships(Flow $flow, Partnership $partnerships)
    {
       $id = 0;
       $cascades = $flow->cascade($id); 
       $cascades = $this->breakCascade($cascades);
       $insert = $partnerships->insert($cascades);
       $childs = $partnerships->get(); 
       $childs = collect($childs)->map(function($child) use ($flow, $partnerships) {
            $partnership = $partnerships->find($child->id);
            $cascades = $flow->cascade($partnership->cascade_id); 
            $cascades = $this->breakCascade($cascades);
            if (!empty($cascades)) {
                $cascades = collect($cascades)->map(function($cascade) {
                    $cascade = new Partnership($cascade);
                    return $cascade;
                });
                $insert = $partnership->childrens()->saveMany($cascades); 
                return [$child->id => $insert];
            }
            return [$child->id => 'no-childrens'];
       });
       return $childs;
    }

    private function breakCascade($cascades, $partnerships = false){
       $cascades = collect($cascades)->map(function($cascade) {
           $cascade = $cascade;
           $cascade['cascade_id'] = $cascade['id'];
           if ($cascade['parent'] === null || $cascade['parent'] === 0) {
                $cascade['level'] = 'country';
           }
           if ($cascade['code'] === '') {
               $cascade['code'] = null;
           }
           return collect($cascade)->forget(['id','parent']);
       })->toArray();
       return $cascades;
    }

    public function syncSurveyForms(SurveyGroup $surveyGroups)
    {
        $surveyGroup = collect(config('surveys.forms'))
			->map(function($group) use ($surveyGroups) {
				$id = $surveyGroups->insertGetId(['name' => $group['name']]);
				$forms = collect($group['list'])->map(function($form) {
					$form = new Form($form);
					return $form;
				});
				$insertedForms = $surveyGroups->find($id);
				$insertedForms = $insertedForms->forms()->saveMany($forms);
				return ['id' => $id, 'forms' => $insertedForms];
			});
		return $surveyGroup;
    }

    public function syncQuestions(Flow $flow, Form $forms, Question $questions)
    {
        $formlist = $forms->get();
		$status = collect($formlist)->map(function($form) use ($flow, $questions, $forms) {
			$groups = collect($flow->get('surveys', $form->survey_id))
				->get('forms')[0]['questionGroups'];
			$groups = collect($groups)->map(function($questions)
				use ($form) {
				$questions = collect($questions['questions'])
					->map(function($question) use ($form) {
						$form_id = $form->form_id;
						return array(
							'question_id' => (int) $question['id'],
							'type' => $question['type'],
							'text' => $question['name'],
							'form_id' => $form_id,
						);
					});
				return $questions;
				})->flatten(1)->toArray();
			$insert = $questions->insert($groups);
		    return [$form->name => $insert];
		});
		return $status; 
    }

    public function syncQuestionOptions(Flow $flow, Option $options, Form $forms, Question $questions)
    {
        $forms = collect($forms->get())->map(function($form) use ($flow) {
                $survey_form = collect($flow->questions($form['form_id']))->get('questionGroup');
                return $survey_form;
            });
        $forms = collect($forms)->map(function($form){
            if (Arr::has($form, 'question')) {
                return [$form['question']];
            }
            return collect($form)->map(function($group){
                return $group['question'];
            });
        })->flatten(2)->where('type','option')->values();
        $forms = collect($forms)->map(function($options) use ($questions) {
            $qid = $options['id'];
            $question = $questions->where('question_id',$qid)->first();
            $type = 'single';
            if ($options['options']['allowMultiple']){
                $type = 'multiple';
            };
            $opts = collect($options['options']['option'])->map(function($opt) use ($type) {
                $opt['type'] = $type;
                $opt = collect($opt)->forget('value')->toArray();
                return new Option($opt);
            });
            $insert = $questions->find($question->id)->options()->saveMany($opts);
            return [$question->id => $insert];
        });
        return $forms; 
    }

    public function syncDataPoints(Flow $flow, Form $forms, Partnership $partnerships, DataPoint $datapoints)
    {
        $forms = $forms->load('surveygroup')->all();
        $collections = collect();
		$forms = collect($forms)->each(function($form) use ($flow, $collections, $partnerships) {
			$results = $flow->get('forminstances', $form->survey_id, $form->form_id);
			if($results === 500){
				return "Internal Server Error";
			};
			$collections = $this->groupDataPoint($collections, $results, $form, $partnerships);
			$next_page = false;
			if (isset($result['nextPageUrl'])) {
				$next_page = true;
			}
			do{
				$next_page = false;
				if (isset($result['nextPageUrl'])) {
					$next_page = true;
					$results = $flow->fetch($results['nextPageUrl']);
					$collections = $this->groupDataPoint($collections, $results, $form, $partnerships);
				}
			}
			while($next_page);
		});
        $data_points = $collections->map(function($data_point) use ($datapoints) {
			$data = collect($data_point["answers"])->map(function($answer) {
				return new Answer($answer);
			});
			$data_points = collect($data_point)->except('answers')->toArray();
			$id = $datapoints->insertGetId($data_points);
			$answers = $datapoints->find($id)->answers()->saveMany($data);
			return ["answers" => $answers,"datapoints" => $datapoints];
        });
        return $datapoints->with('answers')->get();
    }

    public function groupDataPoint($collections, $response, $form, $partnerships)
    {
        collect($response['formInstances'])->each(function($datapoints) use ($collections, $form, $partnerships) {
            $datapoint_id = (int) $datapoints['dataPointId'];
            $submission_date = $datapoints['submissionDate'];
            $partner = collect();
            $group = collect($datapoints['responses'])
                ->flatten(1)
                ->map(function($data) use ($datapoint_id, $form, $partner) {
                    $answers = collect($data)->map(function($answer, $question_id) use ($datapoint_id, $form, $partner) {
                        if ($question_id === $form['partner_qid']) {
                            $partner->put('country', $answer[0]['name']); 
                            $partner->put('partnership', $answer[1]['name']); 
                        };
                        $text = $answer;
                        $value = null;
                        $options = collect();
                        $split = false;
                        if (is_array($answer) && count($answer) > 0) {
                            $cascade = '';
                            for($i=0; $i < count($answer); $i++) {
                                $isOption = Arr::has($answer[$i], 'text') 
                                    ? true 
                                    : false;
                                $cascade .= ($isOption) 
                                    ? $answer[$i]['text']
                                    : $answer[$i]['name'];
                                if($isOption) {
                                    $option = \App\Option::where('text', $answer[$i]['text'])->first();
                                    $options->push($option['id']);
                                }
                                if ($i < count($answer) - 1) {
                                    $cascade .= '|';
                                }
                            }
                            $text = $cascade;
                        }
                        if(!is_array($answer) && (int) $answer) {
                            $value = (int) $answer;
                        }
                        return array(
                            'datapoint_id' => $datapoint_id,
                            'question_id' => $question_id,
                            'text' => $text,
                            'value' => $value,
                            'options' => $options,
                        );
                    });
                    return $answers;
                })->flatten(1);
            $country_id = $partnerships->where('name', $partner['country'])->first();
            $partnership_id = $partnerships->where('name', $partner['partnership'])->first();
            $collections->push(
                array(
                    'datapoint_id' => $datapoint_id,
                    'form_id' => $form['form_id'],
                    'partnership_id' => $partnership_id->id,
                    'country_id' => $country_id->id,
                    'survey_group_id' => $form['survey_group_id'],
                    'submission_date' => date('Y-m-d', strtotime($submission_date)),
                    'answers' => $group,
                )
            );
        });
        return $collections;
    } 

}
