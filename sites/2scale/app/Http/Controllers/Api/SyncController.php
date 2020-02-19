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

    private function breakQuestions($form_id, $question) {
        $questiontype = $question['type'];
        $cascade = null;
        if (isset($question['validationRule'])){
            $validation = $question['validationRule']['validationType'];
            if ($validation === "numeric") {
                $questiontype = "number";
            }
        }
        if (isset($question['cascadeResource'])){
            $cascade = $question['cascadeResource'];
        }
        return array(
            'question_id' => (int) $question['id'],
            'type' => $questiontype,
            'text' => $question['text'],
            'resource' => $cascade,
            'form_id' => $form_id,
        );
    }

    public function syncQuestions(Flow $flow, Form $forms, Question $questions)
    {
        $formlist = $forms->get();
        $all_forms = collect($formlist)->map(function($form) use ($flow, $questions) {
            $form_id = $form->form_id;
            $groups = collect($flow->questions($form_id));
            $isObject = Arr::isAssoc($groups['questionGroup']);
            if($isObject){
                $questionlist = collect($groups['questionGroup']['question'])->map(function($question) 
                    use ($questions, $form_id) {
                    return $this->breakQuestions($form_id, $question);
                })->toArray();
                $insert = $questions->insert($questionlist); 
                return ['status' => $insert];
            };
            $groupList = collect($groups['questionGroup'])->map(function($group)
                use ($questions, $form_id) {
                $questionlist = collect($group['question'])->map(function($question)
                    use ($form_id) {
                    return $this->breakQuestions($form_id, $question);
                })->toArray();
                $insert = $questions->insert($questionlist); 
                return ['status' => $insert];
            });
            return $groupList;
        })->flatten(1);
        return $all_forms;
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

    private function groupDataPoint($collections, $response, $form, $partnerships)
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
                            $partnership_name = isset($answer[1]) ? $answer[1]['name'] : '';
                            $partner->put('country', $answer[0]['name']); 
                            $partner->put('partnership', $partnership_name); 
                        };
                        $text = $answer;
                        $value = null;
                        $options = collect();
                        $split = false;
                        if (is_array($answer) && count($answer) > 0) {
                            $cascade = '';
                            if(isset($answer['filename'])) {
                                $text = $text['filename'];
                            }
                            else {
                                for($i=0; $i < count($answer); $i++) {
                                    $isOption = Arr::has($answer[$i], 'text') 
                                        ? true 
                                        : false;
                                    if (Arr::has($answer[$i], 'isOther')) {
                                        if ($answer[$i]['isOther']){
                                            $answer[$i]['name'] = "Choose Other Options";
                                        } 
                                    }
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
            if($partner->isNotEmpty()){
                $partnership_part = explode('_', $partner['partnership']);
                $country_id = $partnerships->where('name', $partner['country'])->first();
                $partnership_id = $partnerships->where('name', 'like', $partnership_part[0] . '%')->first();
                $dt = DataPoint::where('datapoint_id', $datapoint_id)->first();
                if ($dt === null) {
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
                }
            }
        });
        return $collections;
    } 

}
