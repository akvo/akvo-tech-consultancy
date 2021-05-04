<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\StatefulGuard;
use App\Models\WebForm;
use App\Models\Collaborator;
use Akvo\Models\FormInstance;
use Akvo\Models\QuestionGroup;
use Akvo\Models\Answer;
use League\Csv\Writer;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\FlowDataSeedController;
use App\Http\Controllers\FlowDataSyncController;
use Illuminate\Support\Facades\Log;

class SubmissionController extends Controller
{
    public function getSubmittedData(Request $request, StatefulGuard $guard)
    {
        $questionnaires = config('bc.questionnaires');
        foreach(config('bc.idh_questionnaires') as $property => $value){
            $questionnaires[$property] = $value;
        }
        $user = $request->user();
        $collaboratorForms = Collaborator::where('organization_id', $user->organization_id)->get()->pluck('web_form_id');
        $webforms = WebForm::where([
            ['user_id', $user->id],
            ['submitted', true]
        ])->orWhere(function ($query) use ($collaboratorForms) {
            $query->where('submitted', true)
                  ->whereIn('id', $collaboratorForms);
        })->with('organization', 'user')->get()->map(function ($wf) use ($questionnaires) {
            $wf['org_name'] = $wf['organization']['name'];
            // $wf['user_name'] = $wf['user']['name'];
            // return collect($wf)->only('uuid', 'org_name', 'user_name');
            $wf['submitter_name'] = $wf['user']['name'];
            $display_name = (is_null($wf['display_name'])) ? '' : ' - '.$wf['display_name'];
            $wf['form_name'] = $questionnaires[$wf['form_id']].$display_name;
            return collect($wf)->only('id', 'uuid', 'org_name', 'submitter_name', 'form_name', 'form_id', 'updated_at');
        });

        return $webforms;

        // $form_instances = FormInstance::whereIn('identifier', $webforms->pluck('uuid'))
        //     ->with('datapoint', 'form')
        //     ->get()
        //     ->map(function ($fi) use ($webforms) {
        //         $wf = $webforms->where('uuid', $fi['identifier'])->first();
        //         $fi['org_name'] = $wf['org_name'];
        //         $fi['submitter_name'] = $wf['user_name'];
        //         $fi['form_name'] = $fi['form']['name'].' - '.$fi['datapoint']['display_name'];
        //         return collect($fi)->only('org_name', 'submitter_name', 'form_name', 'id', 'form_id', 'data_point_id');
        //     });
        // return $form_instances;
    }

    public function syncAndDownloadData(Request $request, FlowDataSeedController $flowData, FlowDataSyncController $syncData)
    {
        $idh_forms = config('bc.idh_forms');
        # TODO :: check if uuid has been on database

        Log::error('webform_id', [$request->webform_id]);
        $webform = WebForm::where('id', $request->webform_id)->first();
        if (!is_null($webform) && $webform->form_instance_id == 'idh' ){
            return ["link" => "uploads/idh/".$this->trim($request->filename).".csv"];
        }
        $form_instance = FormInstance::where('identifier', $request->uuid)->first();
        Log::error('ey!', [$form_instance, $request->uuid]);
        if (!is_null($form_instance)) {
            # Download data, use downloadData function
            Log::error('not null ... calling downloadData');
            if(in_array($form_instance['form_id'], $idh_forms)){
                return ["link" => "uploads/idh/".$this->trim($request->filename).".csv"];
            } else {
                return $this->downloadData($request->form_id, $form_instance->id, $request->filename, false);
            }
        }

        # TODO :: if uuid not found, then run sync first, then download the data
        // $sync = $flowData->seedFlowData(false, $request->form_id); # using seed to sync
        $sync = $syncData->syncData(false, $request->uuid); # using flow sync api
        Log::error($sync);
        if ($sync !== true) {
            Log::error('Sync failed');
            return \response('Sync failed', 204);
        }
        $form_instance = FormInstance::where('identifier', $request->uuid)->first();
        Log::error($form_instance);
        if (is_null($form_instance)) {
            Log::error('No Content');
            return \response('No Content', 204);
        }
        return $this->downloadData($request->form_id, $form_instance->id, $request->filename, false);
    }

    protected function trim($s)
    {
        return str_replace(' ', '', $s);
    }


    public function allCsv(Request $request, FlowDataSeedController $flowData, FlowDataSyncController $syncData)
    {
        $config = config('bc');
        $credentials = $config['credentials'];
        if ($request->password !== $credentials['api']) {
            throw new NotFoundHttpException();
        }
        $questionnaires = config('bc.questionnaires');
        $webforms = WebForm::where([
            ['submitted', true]
        ])->with('organization', 'user')->get()->map(function ($wf) use ($questionnaires) {
            $wf['submitter_name'] = (is_null($wf['user'])) ? 'not-found-user' : $wf['user']['name'];
            $display_name = (is_null($wf['display_name'])) ? '' : ' - '.$wf['display_name'];
            $wf['form_name'] = $questionnaires[$wf['form_id']].$display_name;
            $wf['download_url'] = $this->trim(str_replace(' - ', '-', $wf['form_name'])).'-'.$this->trim($wf['submitter_name']);
            $wf['file'] =  $this->downloadData($wf['form_id'], $wf['form_instance_id'], $wf['download_url'], true);
            return collect($wf)->only('download_url', 'form_id', 'form_instance_id', 'file');
        });
        return $webforms;
    }


    public function downloadData($form_id, $instance_id, $filename, $older_reports)
    // public function downloadData(Request $request)
    {
        try {
            $headers = ["gid", "groupName", "repeat", "qid", "question", "answer"];
            // $qGroups = QuestionGroup::where('form_id', $request->form_id)->with('questions')->get();
            // $answers = Answer::where('form_instance_id', $request->instance_id)->with('option.option', 'cascade.cascade')->get();
            $qGroups = QuestionGroup::where('form_id', $form_id)->with('questions')->get();
            $answers = Answer::where('form_instance_id', $instance_id)->with('option.option', 'cascade.cascade')->get();
            $records = collect();
            $results = $qGroups->map(function ($qg, $qgIndex) use ($answers, $records) {
                foreach ($qg['questions'] as $qIndex => $q) {
                    $gid = null;
                    $groupName = null;
                    $repeat = null;
                    if ($qIndex === 0) {
                        $gid = $qgIndex + 1;
                        $groupName = $qg['name'];
                    }
                    $qid = $qIndex + 1;
                    $question = $q['name'];
                    $answer = $answers->where('question_id', $q['id'])->values();
                    # TODO:: Repeat question-answer values
                    $repeat = 1;
                    if ($qg['repeat']) {
                        foreach ($answer as $key => $value) {
                            $repeatValue = ($qIndex === 0) ? $repeat : null;
                            $answerValue = $this->fetchAnswer($q['type'], $answer->first());
                            // $records->push([$gid, $groupName, $repeatValue, $qid, $question, $answerValue]);
                            $records->push([
                                'gid' => $qgIndex + 1,
                                'groupName' => $groupName,
                                'repeat' => $repeat,
                                'qid' => $qid,
                                'question' => $question,
                                'answer' => $answerValue
                            ]);
                            $repeat++;
                        }
                    }
                    # END:: Repeat question-answer values

                    # TODO:: Non repeat question-answer values
                    if (!$qg['repeat']) {
                        $repeatValue = ($qIndex === 0) ? $repeat : null;
                        $answerValue = $this->fetchAnswer($q['type'], $answer->first());
                        // $records->push([$gid, $groupName, $repeatValue, $qid, $question, $answerValue]);
                        $records->push([
                            'gid' => $qgIndex + 1,
                            'groupName' => $groupName,
                            'repeat' => $repeat,
                            'qid' => $qid,
                            'question' => $question,
                            'answer' => $answerValue
                        ]);
                    }
                }
            });
            // $results = ["headers" => $headers, "records" => $records];
            $groupRecords = $records->groupBy(['gid', 'repeat'])->values()->flatten(1);
            $remapRecords = collect();
            foreach ($groupRecords as $gIndex => $gValue) {
                foreach ($gValue as $itemIndex => $item) {
                    $gid = ($item['groupName'] !== null) ? $item['gid'] : null;
                    $groupName = ($item['groupName'] !== null) ? $item['groupName'] : null;
                    $repeat = ($item['groupName'] !== null) ? $item['repeat'] : null;
                    $qid = $item['qid'];
                    $question = $item['question'];
                    $answer = $item['answer'];
                    $remapRecords->push([$gid, $groupName, $repeat, $qid, $question, $answer]);
                }
            }
            $results = ["headers" => $headers, "records" => $remapRecords];

            return ["link" => $this->writeCsv($results, $filename, $older_reports)];
        } catch (\Exception $exception) {
            return $exception->getMessage();
        };

    }

    private function fetchAnswer($qtype, $answer)
    {
        if ($answer === null) {
            $answer = 'NA';
            return $answer;
        }
        $repeat_index = $answer['repeat_index'] + 1;
        if ($qtype === 'free') {
            $answer = $answer['name'];
        }
        if ($qtype === 'numeric') {
            $answer = $answer['value'];
        }
        if ($qtype === 'option') {
            $answer = ($answer['option'] === null) ? "NA" : $answer['option']['option']['name'];
        }
        if ($qtype === 'cascade') {
            // TODO:: Check for multiple select
            if ($answer['cascade'] === null) {
                $answer = 'NA';
                return $answer;
            }
            if (!is_array($answer['cascade'])) {
                $answer = $answer['cascade']['cascade']['name'];
                return $answer;
            }
            if (is_array($answer['cascade'])) {
                $answer = $answer['cascade']->pluck('cascades')->pluck('name')->join(' | ');
                return $answer;
            }
        }
        return $answer;
    }

    private function writeCsv($data, $filename, $older_reports)
    {
        $filename .= ".csv";
        if (count($data) === 0) {
            return Storage::disk('public')->url($filename);
        }
        if($older_reports){
            $writer = Writer::createFromPath('../public/uploads/idh/'.$filename, 'w+'); // path-local:'./uploads/idh/'
        } else {
            $writer = Writer::createFromPath('../public/uploads/'.$filename, 'w+');
        }


        $writer->insertOne(collect($data['headers'])->toArray());
        $writer->insertAll(collect($data['records'])->toArray());

        return Storage::disk('public')->url($filename);
    }
}
