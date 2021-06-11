<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use App\Libraries\FlowApi;
use App\Libraries\FlowAuth0;
use App\SurveyGroup;
use App\Partnership;
use App\Sector;
use App\Form;
use App\Question;
use App\Option;
use App\Datapoint;
use App\Answer;
use App\Sync;
use App\QuestionGroup;
use \Mailjet\Resources;
use Mailjet\LaravelMailjet\Facades\Mailjet;

class SyncController extends Controller
{
    public function __construct() {
        $this->collections = collect();
        $this->success = collect();
        $this->error = collect();
        $this->repeat_temp = [];
        $this->formChanged = collect();
        $this->dpsChanged = collect();
        $this->dpsDeleted = 0;
        $this->oldData = collect();
        $this->bugs = collect();
    }

    public function syncPartnerships(FlowApi $flow, Partnership $partnerships, $sync = false, $cascadeResource = null)
    {
        $id = 0;
        $resource = config('surveys.cascade');
        if ($sync && $cascadeResource !== null) {
            $resource = $cascadeResource;
        }

        $cascades = $flow->cascade($resource, $id);
        $cascades = $this->breakCascade($cascades);
        // $insert = $partnerships->insert($cascades);
        $insert = collect($cascades)->map(function ($cascade) use ($partnerships) {
            return $partnerships->updateOrCreate(['cascade_id' => $cascade['cascade_id']], $cascade);
        });
        $childs = $partnerships->get();
        $childs = collect($childs)->map(function($child) use ($flow, $partnerships, $resource) {
                $partnership = $partnerships->find($child->id);
                $cascades = $flow->cascade($resource, $partnership->cascade_id);
                $cascades = $this->breakCascade($cascades);
                if (!empty($cascades)) {
                    $cascades = collect($cascades)->map(function($cascade) use ($partnership, $partnerships) {
                        // $cascade = new Partnership($cascade);
                        // return $cascade;
                        $cascade['parent_id'] = $partnership['id'];
                        return $partnerships->updateOrCreate(['cascade_id' => $cascade['cascade_id']], $cascade);
                    });
                    // $insert = $partnership->childrens()->saveMany($cascades);
                    // return [$child->id => $insert];
                    return [$child->id => $cascades];
                }
                return [$child->id => 'no-childrens'];
        });
        return $childs;
    }

    public function syncSectors(FlowApi $flow, Sector $sectors, $sync = false, $cascadeResource = null)
    {
        # TODO :: need to create this sync condition (sync cron job)
        $id = 0;
        $resource = config('surveys.sector_cascade');
        if ($sync && $cascadeResource !== null) {
            $resource = $cascadeResource;
        }

        $cascades = $flow->cascade($resource, $id);
        $cascades = $this->breakCascade($cascades, false);
        $insert = collect($cascades)->map(function ($cascade) use ($sectors) {
            return $sectors->updateOrCreate(['cascade_id' => $cascade['cascade_id']], $cascade);
        });
        $childs = $sectors->get();
        $childs = collect($childs)->map(function($child) use ($flow, $sectors, $resource) {
                $sector = $sectors->find($child->id);
                $cascades = $flow->cascade($resource, $sector->cascade_id);
                $cascades = $this->breakCascade($cascades, false);
                if (!empty($cascades)) {
                    $cascades = collect($cascades)->map(function($cascade) use ($sector, $sectors) {
                        $cascade['parent_id'] = $sector['id'];
                        return $sectors->updateOrCreate(['cascade_id' => $cascade['cascade_id']], $cascade);
                    });
                    return [$child->id => $cascades];
                }
                return [$child->id => 'no-childrens'];
        });
        return $childs;
    }

    private function breakCascade($cascades, $partnership = true){
       $cascades = collect($cascades)->map(function($cascade) use ($partnership) {
           $cascade = $cascade;
           $cascade['cascade_id'] = $cascade['id'];
           if ($cascade['parent'] === null || $cascade['parent'] === 0) {
                $cascade['level'] = ($partnership) ? 'country' : 'industry';
           }
           if ($cascade['code'] === '' || $cascade['code'] === null) {
               $cascade['code'] = Str::before($cascade['name'], '_');
           }
           return collect($cascade)->forget(['id','parent']);
       })->toArray();
       return $cascades;
    }

    public function syncSurveyForms(SurveyGroup $surveyGroups, FlowAuth0 $flow)
    {
        // create sync URL
        $sync = $flow->sync('sync');
        $postSync = new Sync(['url' => $sync['nextSyncUrl']]);
        $postSync->save();

        $surveyGroup = collect(config('surveys.forms'))
			->map(function($group) use ($surveyGroups, $flow) {
                $id = $surveyGroups->insertGetId(['name' => $group['name']]);
				$forms = collect($group['list'])->map(function($form) {
                    $form = collect($form)->except('sector_qid')->toArray();
					$form = new Form($form);
					return $form;
				});
				$insertedForms = $surveyGroups->find($id);
				$insertedForms = $insertedForms->forms()->saveMany($forms);
				return ['id' => $id, 'forms' => $insertedForms];
			});
		return $surveyGroup;
    }

    private function breakQuestions($form_id, $question, $qgroup) {
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
            'question_group_id' => $qgroup['id'],
        );
    }

    public function syncQuestions(FlowApi $flow, Form $forms, Question $questions)
    {
        $formlist = $forms->get();
        $all_forms = collect($formlist)->map(function($form) use ($flow, $questions) {
            $form_id = $form->form_id;
            $groups = collect($flow->questions($form_id));
            return $this->updateOrCreateQuestions($form_id, $groups, $questions);
        })->flatten(1);
        return $all_forms;
    }

    private function updateOrCreateQuestions($form_id, $groups, $questions)
    {
        $isObject = Arr::isAssoc($groups['questionGroup']);
        if($isObject){
            // update or create question group
            $qgroup = QuestionGroup::updateOrCreate(
                [
                    'form_id' => $form_id,
                    'name' => $groups['questionGroup']['heading']
                ],
                [
                    'form_id' => $form_id,
                    'name' => $groups['questionGroup']['heading'],
                    'repeat' => $groups['questionGroup']['repeatable']
                ]
            );
            $questionlist = collect($groups['questionGroup']['question'])->map(function($question)
                use ($questions, $form_id, $qgroup) {
                // return $this->breakQuestions($form_id, $question);
                $qs = $this->breakQuestions($form_id, $question, $qgroup);
                return $questions->updateOrCreate(
                    [
                        'question_id' => $qs['question_id'],
                        'form_id' => $qs['form_id']
                    ],
                    $qs
                );
            })->toArray();
            // $insert = $questions->insert($questionlist);
            // return ['status' => $insert];
            return ['status' => $questionlist];
        };
        $groupList = collect($groups['questionGroup'])->map(function($group)
            use ($questions, $form_id) {
            // update or create question group
            $qgroup = QuestionGroup::updateOrCreate(
                [
                    'form_id' => $form_id,
                    'name' => $group['heading']
                ],
                [
                    'form_id' => $form_id,
                    'name' => $group['heading'],
                    'repeat' => $group['repeatable']
                ]
            );
            $questionlist = collect($group['question'])->map(function($question)
                use ($form_id, $questions, $qgroup) {
                // return $this->breakQuestions($form_id, $question);
                $qs = $this->breakQuestions($form_id, $question, $qgroup);
                return $questions->updateOrCreate(
                    [
                        'question_id' => $qs['question_id'],
                        'form_id' => $qs['form_id']
                    ],
                    $qs
                );
            })->toArray();
            // $insert = $questions->insert($questionlist);
            // return ['status' => $insert];
            return ['status' => $questionlist];

        });
        return $groupList;
    }

    public function syncQuestionOptions(FlowApi $flow, Option $options, Form $forms, Question $questions)
    {
        $forms = collect($forms->get())->map(function($form) use ($flow) {
            $survey_form = collect($flow->questions($form['form_id']))->get('questionGroup');
            return $survey_form;
        });
        return $this->updateOrCreateQuestionOptions($forms, $questions);
    }

    private function updateOrCreateQuestionOptions($forms, $questions)
    {
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
            $opts = collect($options['options']['option'])->map(function($opt) use ($type, $question) {
                $opt['type'] = $type;
                $opt['question_id'] = $question['id'];
                // there was a translation on options, so we need to forget the altText
                $opt = collect($opt)->forget(['value', 'altText'])->toArray();
                // return new Option($opt);
                return Option::updateOrCreate($opt);
            });
            // $insert = $questions->find($question->id)->options()->saveMany($opts);
            // return [$question->id => $insert];
            return [$question->id => $opts];
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

        // $success_table = $this->generateTable($success, 'success');
        $error_table = $this->generateTable($this->error, 'error');
        $html = '<html><body><h4>Error</h4>'.$error_table.'</body></html>';

        // send email
        if (count($this->error) > 0) {
            $this->sendEmail('Report Sync Datapoints', $html);
        }
        return $datapoints->with('answers')->get();
    }

    private function groupDataPoint($response, $form, $partnerships, $sync = false)
    {
        collect($response['formInstances'])->each(function($datapoints, $ii) use ($form, $partnerships, $sync) {
            $instance_id = (int) $datapoints['id'];
            $datapoint_id = (int) $datapoints['dataPointId'];
            $submission_date = $datapoints['submissionDate'];
            $partner = collect();
            $group = collect($datapoints['responses'])
                ->flatten(1)
                ->map(function($data) use ($datapoint_id, $form, $partner) {
                    $answerData = collect($data);
                    $answers = $answerData->map(function($answer, $question_id) use ($datapoint_id, $form, $partner, $answerData) {
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
                        // check repeatable
                        $question = Question::where('question_id', $question_id)->first();
                        $qgroup = QuestionGroup::find($question['question_group_id']);
                        $repeat_index = 0;
                        if ($qgroup['repeat']) {
                            if (isset($this->repeat_temp[$question_id])) {
                                $this->repeat_temp[$question_id] = $this->repeat_temp[$question_id] + 1;
                            } else {
                                $this->repeat_temp[$question_id] = 1;
                            }
                            $repeat_index = $this->repeat_temp[$question_id];

                            $check = $answerData->keys();
                            $qids = Question::where('question_group_id', $qgroup['id'])->pluck('question_id');
                            $diff = $qids->diff($check);
                            if (count($diff) > 0) {
                                $diff->each(function ($val) use ($repeat_index) {
                                    $this->repeat_temp[$val] = $repeat_index;
                                });
                            }
                        }
                        return array(
                            'datapoint_id' => $datapoint_id,
                            'question_id' => $question_id,
                            'text' => $text,
                            'value' => $value,
                            'options' => $options,
                            'repeat_index' => $repeat_index,
                        );
                    });
                    return $answers;
                })->flatten(1);
            if($partner->isNotEmpty()){
                $partnership_part = Str::before($partner['partnership'], '_');
                $country_id = $partnerships->where('name', $partner['country'])->first();
                $partnership_id = $partnerships->where('code', $partnership_part)->first();
                $dt = DataPoint::where('datapoint_id', $datapoint_id)->first();
                // check error & success
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
                // eol check error & success

                // new data
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
                // old data to update
                if ($dt !== null && $sync && $country_id !== null && $partnership_id !== null) {
                    $this->oldData->push(
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

        // check bugs if there duplicate datapoint id
        $this->bugs = $this->collections->countBy('datapoint_id')->reject(function ($x) {
            return $x === 1;
        })->keys();

        return;
    }

    public function countSyncData(Form $forms, FlowAuth0 $flow, Partnership $partnerships, DataPoint $datapoints)
    {
        // sync
        $flowApi = new FlowApi();
        $syncs = new Sync();
        $answers = new Answer();
        $questions = new Question();
        $this->syncData($flowApi, $flow, $syncs, $forms, $partnerships, $datapoints, $answers, $questions);

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
            logger()->error('Got client error ' . $e->getMessage());
        }
    }

    public function syncData(
        FlowApi $flowApi, FlowAuth0 $flow, Sync $syncs, Form $forms,
        Partnership $partnerships, Datapoint $datapoints, Answer $answers, Question $questions,
        $syncUrl=false
    )
    {
        if (!$syncUrl) {
            $sync = $syncs->orderBy('id', 'desc')->first();
            $syncUrl = $sync['url'];
        }
        $syncData = $flow->fetch($syncUrl);

        if (!isset($syncData['changes']) || $syncData === 204) {
            if (count($this->formChanged) === 0 && count($this->dpsChanged) === 0 && $this->dpsDeleted === 0) {
                return "No data update";
            }

            return [
                "formChanged" => $this->formChanged,
                "formInstanceChanged" => $this->dpsChanged,
                "datapointDeleted" => $this->dpsDeleted,
            ];
        }

        // $formChanged = [];
        if (count($syncData['changes']['formChanged']) !== 0) {
            $this->collections = collect();
            $formChanged = collect($syncData['changes']['formChanged'])->map(function ($form) use ($flowApi, $forms, $partnerships, $questions) {
                // update the form on flow api
                $updatedFlowApi = $flowApi->questions($form['id'], $update = true);

                // updateOrCreate partnership table
                $partner_qids = collect(config('surveys.forms'))->map(function ($item) {
                    return $item['list'];
                })->flatten(1)->pluck('partner_qid');
                // get the partnership questions
                $isObject = Arr::isAssoc($updatedFlowApi['questionGroup']);
                if ($isObject) {
                    $partner_qs = collect($updatedFlowApi['questionGroup']['question'])->map(function ($q) {
                        $q['id'] = (int) $q['id'];
                        return $q;
                    })->reject(function ($item) use ($partner_qids) {
                        return collect($item)->whereNotIn('id', $partner_qids);;
                    });
                }
                if (!$isObject) {
                    $partner_qs = collect($updatedFlowApi['questionGroup'])->map(function ($qgroup) use ($partner_qids) {
                        $qs = collect($qgroup['question'])->map(function ($q) {
                            $q['id'] = (int) $q['id'];
                            return $q;
                        });
                        return $qs->whereIn('id', $partner_qids);
                    })->reject(function ($item) {
                        return count($item) === 0;
                    })->flatten(1);
                }
                // check if cascade same cascade resource
                $partnerUpdated = [];
                if (count($partner_qs) !== 0 && $partner_qs[0]['cascadeResource'] !== config('surveys.cascade')) {
                    // do partnership update
                    $partnerUpdated = $this->syncPartnerships($flowApi, $partnerships, $sync = true, $cascadeResource = $partner_qs[0]['cascadeResource']);
                }
                // eol updateOrCreate partnership table

                // updateOrCreate form table
                $formUpdated = Form::updateOrCreate(
                    [
                        'form_id' => (int) $updatedFlowApi['surveyId'],
                        'survey_id' => (int) $updatedFlowApi['surveyGroupId'],
                    ],
                    ['name' => $updatedFlowApi['surveyGroupName']]
                );
                // eol updateOrCreate form table

                // updateOrCreate question table
                $questionUpated = $this->updateOrCreateQuestions((int) $form['id'], $updatedFlowApi, $questions);
                // eol updateOrCreate question table

                // collect questions
                $this->collections->push($updatedFlowApi['questionGroup']);

                return [
                    'partnershipUpdated' => $partnerUpdated,
                    'formUpdated' => $formUpdated,
                    'questionUpdated' => $questionUpated,
                ];
            });

            // updateOrCreate options table
            $optionUpdated = $this->updateOrCreateQuestionOptions($this->collections, $questions);
            $formChanged['optionUpdated'] = $optionUpdated;
            // eol updateOrCreate options table

            $this->formChanged->push($formChanged);
        }

        // $dpsChanged = [];
        if (count($syncData['changes']['formInstanceChanged']) !== 0) {
            $forms = $forms->all();
            $this->collections = collect();
            $formInstanceChanged = collect($syncData['changes']['formInstanceChanged'])->groupBy('formId');
            $formInstanceChanged->each(function ($item, $key) use ($forms, $partnerships) {
                $results['formInstances'] = $item;
                $form = $forms->where('form_id', (int) $key)->first();
                // ignore sync datapoints when form id not in db
                if ($form !== null) {
                    $this->groupDataPoint($results, $form, $partnerships, $sync = true);
                }
            });
            // update or create (old data)
            $dpsChanged = $this->oldData->map(function ($data_point) use ($datapoints, $answers) {
                $data_points = collect($data_point)->except('answers')->toArray();
                $dp = $datapoints->updateOrCreate(
                    ['datapoint_id' => $data_points['datapoint_id']],
                    $data_points
                );
                $answer = collect($data_point["answers"])->map(function ($answer) use ($dp, $answers) {
                    $answer['datapoint_id'] = $dp['id'];
                    $answer['options'] = strval($answer['options']);
                    $answer = $answers->updateOrCreate(
                        [
                            'datapoint_id' => $answer['datapoint_id'],
                            'question_id' => $answer['question_id'],
                        ],
                        [
                            'text' => $answer['text'],
                            'value' => $answer['value'],
                            'options' => $answer['options'],
                        ],
                    );
                    return $answer;
                });
                return ["answers" => $answer,"datapoints" => $dp];
            });
            // new datapoint coming
            $dpsNew = $this->collections->map(function($data_point) use ($datapoints) {
                $data = collect($data_point["answers"])->map(function($answer) {
                    return new Answer($answer);
                });
                $data_points = collect($data_point)->except('answers')->toArray();
                $id = $datapoints->insertGetId($data_points);
                $answers = $datapoints->find($id)->answers()->saveMany($data);
                return ["answers" => $answers,"datapoints" => $datapoints];
            });

            $this->dpsChanged->push(["new" => $dpsNew, "change" => $dpsChanged]);
        }

        // $dpsDeleted = 0;
        if (count($syncData['changes']['formInstanceDeleted']) !== 0 || count($syncData['changes']['dataPointDeleted']) !== 0) {
            $datapointDeleted = collect($syncData['changes']['dataPointDeleted'])->map(function ($item) { return (int) $item; });
            $dpsDeleted = $datapoints->whereIn('datapoint_id', $datapointDeleted)->delete();

            $this->dpsDeleted = $this->dpsDeleted + $dpsDeleted;
        }

        // check nextSyncUrl if contains any data
        if (isset($syncData['nextSyncUrl'])) {
            $postSync = new Sync(['url' => $syncData['nextSyncUrl']]);
            $postSync->save();
            $forms = new Form();
            $this->syncData($flowApi, $flow, $syncs, $forms,
                            $partnerships, $datapoints, $answers, $questions,
                            $syncData['nextSyncUrl']
                        );
        }

        return "Done";
    }
}
