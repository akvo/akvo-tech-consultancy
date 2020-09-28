<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use App\Libraries\FlowApi;
use App\Libraries\FlowAuth0;
use App\SurveyGroup;
use App\Partnership;
use App\Form;
use App\Question;
use App\Option;
use App\Datapoint;
use App\Answer;
use \Mailjet\Resources;
use Mailjet\LaravelMailjet\Facades\Mailjet;

class SyncController extends Controller
{
    public function __construct() {
        $this->collections = collect();
        $this->success = collect();
        $this->error = collect();
    }

    public function syncPartnerships(FlowApi $flow, Partnership $partnerships)
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
           if ($cascade['code'] === '' || $cascade['code'] === null) {
               $cascade['code'] = Str::before($cascade['name'], '_');
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
        $personalData = false;
        if (isset($question['validationRule'])){
            $validation = $question['validationRule']['validationType'];
            if ($validation === "numeric") {
                $questiontype = "number";
            }
        }
        if (isset($question['cascadeResource'])){
            $cascade = $question['cascadeResource'];
        }
        if (isset($question['personalData'])){
            $personalData = $question['personalData'];
        }
        return array(
            'question_id' => (int) $question['id'],
            'type' => $questiontype,
            'text' => $question['text'],
            'personal_data' => $personalData,
            'resource' => $cascade,
            'form_id' => $form_id,
        );
    }

    public function syncQuestions(FlowApi $flow, Form $forms, Question $questions)
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

    public function syncQuestionOptions(FlowApi $flow, Option $options, Form $forms, Question $questions)
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

    public function syncDataPoints(FlowAuth0 $flow, Form $forms, Partnership $partnerships, DataPoint $datapoints)
    {
        $forms = $forms->load('surveygroup')->all();
        $this->collections = collect();
		$forms = collect($forms)->each(function($form) use ($flow, $partnerships) {
            $results = $flow->get('forminstances', $form->survey_id, $form->form_id);
            if($results === null){
                return "No data";
            }
			$this->groupDataPoint($results, $form, $partnerships);
			$next_page = false;
			if (isset($results['nextPageUrl'])) {
				$next_page = true;
			}
			do{
				$next_page = false;
				if (isset($results['nextPageUrl'])) {
					$next_page = true;
					$results = $flow->fetch($results['nextPageUrl']);
					$this->groupDataPoint($results, $form, $partnerships);
				}
			}
			while($next_page);
		});
        $data_points = $this->collections->map(function($data_point) use ($datapoints) {
			$data = collect($data_point["answers"])->map(function($answer) {
				return new Answer($answer);
			});
			$data_points = collect($data_point)->except('answers')->toArray();
			$id = $datapoints->insertGetId($data_points);
			$answers = $datapoints->find($id)->answers()->saveMany($data);
			return ["answers" => $answers,"datapoints" => $datapoints];
        });

        // delete datapoints where not found on flow data
        $dps = collect($datapoints->all());
        $deletes = $dps->whereNotIn('datapoint_id', $this->success->pluck('datapoint_id'))->values();
        $datapoints->whereIn('id', $deletes->pluck('id'))->delete();

        // generate report
        $success = $forms->map(function ($form) {
            $countdps = $this->success->filter(function ($value) use ($form) {
                 return $value['form_id'] === $form['form_id']; 
            });
            return [
                'survey_id' => $form['survey_id'],
                'form_id' => $form['form_id'],
                'name' => $form['name'],
                'count' => count($countdps)
            ];
        });

        $success_table = $this->generateTable($success, 'success');
        $error_table = $this->generateTable($this->error, 'error');

        $html = '<html>
            <body>
                <h4>Success</h4>
                '.$success_table.'
                <br/>
                <h4>Error</h4>
                '.$error_table.'
            </body>
        </html>';

        // send email
        $this->sendEmail('Report Sync Datapoints', $html);
        return $datapoints->with('answers')->get();
    }

    private function groupDataPoint($response, $form, $partnerships)
    {
        collect($response['formInstances'])->each(function($datapoints, $ii) use ($form, $partnerships) {
            $instance_id = (int) $datapoints['id'];
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
                                        if ($option !== null) {
                                            $options->push($option['id']);
                                        }
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
                $partnership_part = Str::before($partner['partnership'], '_');
                $country_id = $partnerships->where('name', $partner['country'])->first();
                $partnership_id = $partnerships->where('code', $partnership_part)->first();
                $dt = DataPoint::where('datapoint_id', $datapoint_id)->first();

                if ($country_id === null || $partnership_id === null) {
                    $this->error->push(
                        array(
                            'survey_id' => $form['survey_id'],
                            'form_id' => $form['form_id'],
                            'name' => $form['name'],
                            'instance_id' => $instance_id,
                        )
                    );
                }
                if ($country_id !== null && $partnership_id !== null) {
                    $this->success->push(
                        array(
                            'form_id' => $form['form_id'],
                            'datapoint_id' => $datapoint_id,
                        )
                    );
                }
                if ($dt === null && $country_id !== null && $partnership_id !== null) {
                    $this->collections->push(
                        array(
                            'datapoint_id' => $datapoint_id,
                            'form_id' => $form['form_id'],
                            'partnership_id' => $partnership_id['id'],
                            'country_id' => $country_id['id'],
                            'survey_group_id' => $form['survey_group_id'],
                            'submission_date' => date('Y-m-d', strtotime($submission_date)),
                            'answers' => $group,
                        )
                    );
                }
            }
        });
        return;
    }

    public function countSyncData(Form $forms, FlowAuth0 $flow, Partnership $partnerships, DataPoint $datapoints)
    {
        // sync
        $this->syncDataPoints($flow, $forms, $partnerships, $datapoints);
        // get forms with datapoints
        $formData = $forms->with('datapoints')->get();
        $formData = collect($formData)->transform(function ($form) use ($flow) {
            $countdps = 0;
            // get form instances from flow
            $results = $flow->get('forminstances', $form['survey_id'], $form['form_id']);
            if($results === null){
                return [
                    'survey_id' => $form['survey_id'],
                    'form_id' => $form['form_id'],
                    'name' => $form['name'],
                    'flow_dps' => 0,
                    'db_dps' => 0
                ];
            }
            $countdps += count($results['formInstances']);
			$next_page = false;
			if (isset($results['nextPageUrl'])) {
				$next_page = true;
			}
			do{
				$next_page = false;
				if (isset($results['nextPageUrl'])) {
					$next_page = true;
                    $results = $flow->fetch($results['nextPageUrl']);
					$countdps += count($results['formInstances']);
				}
			}
            while($next_page);
            return [
                'survey_id' => $form['survey_id'],
                'form_id' => $form['form_id'],
                'name' => $form['name'],
                'flow_dps' => $countdps,
                'db_dps' => count($form['datapoints'])
            ];
        })->reject(function ($x) {
            return $x['flow_dps'] === $x['db_dps'];
        })->values();

        if (count($formData) === 0) {
            return "No mismatch data";
        }

        $table = $this->generateTable($formData, 'check');
        $html = '<html><body>'.$table.'</body></html>';

        // send email
        $this->sendEmail('Check Sync Datapoints', $html);
        return $html;
    }

    private function generateTable($formData, $status)
    {
        $thead = '<tr>';
        $thead .= '<th>Survey Id</th>';
        $thead .= '<th>Form Id</th>';
        $thead .= '<th>Name</th>';
        if ($status === 'check') {
            $thead .= '<th>Datapoints count on Flow</th>';
            $thead .= '<th>Datapoints count on 2Scale Database</th>';
        }
        if ($status === 'success') {
            $thead .= '<th>Datapoints count</th>';
        }  
        if ($status === 'error') {
            $thead .= '<th>Instance id</th>';
        }               
        $thead .= '</tr>';
        
        
        $tbody = '';
        foreach ($formData as $key => $x) {
            $tbody .= '<tr>';
            $tbody .= '<td>'.$x['survey_id'].'</td>';
            $tbody .= '<td>'.$x['form_id'].'</td>';
            $tbody .= '<td>'.$x['name'].'</td>';
            if ($status === 'check') {
                $tbody .= '<td>'.$x['flow_dps'].'</td>';
                $tbody .= '<td>'.$x['db_dps'].'</td>';
            }
            if ($status === 'success') {
                $tbody .= '<td>'.$x['count'].'</td>';
            }
            if ($status === 'error') {
                $tbody .= '<td>'.$x['instance_id'].'</td>';
            }
            $tbody .= '</tr>';
        }

        $table = '
            <table border="1">
                <thead>'.$thead.'</thead>
                <tbody>'.$tbody.'</tbody>
            </table>';
        
        return $table;
    }

    private function sendEmail($subject, $html)
    {
        $mails = ['joy@akvo.org', 'deden@akvo.org', 'galih@akvo.org'];
        // $mails = ['galih@akvo.org'];
        $recipients = collect();
        collect($mails)->each(function ($mail) use ($recipients) {
            $recipients->push(['Email' => $mail]);
        });

        $mj = Mailjet::getClient();
        $body = [
            'FromEmail' => config('mail.host'),
            'FromName' => config('mail.host'),
            'Subject' => $subject,
            'Html-part' => $html,
            'Recipients' => $recipients
        ];

        try {
            $response =  $mj->post(Resources::$Email, ['body' => $body]);
            $result = $response->success();
        } catch (\Exception $e) {
            logger()->error('Goutte client error ' . $e->getMessage());
        }
    }

}
