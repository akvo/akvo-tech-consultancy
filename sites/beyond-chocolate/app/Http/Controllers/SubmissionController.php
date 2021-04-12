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

class SubmissionController extends Controller
{
    public function getSubmittedData(Request $request, StatefulGuard $guard)
    {
        $questionnaires = config('bc.questionnaires');
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
            return collect($wf)->only('uuid', 'org_name', 'submitter_name', 'form_name', 'form_id', 'updated_at');
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
        # TODO :: check if uuid has been on database
        $form_instance = FormInstance::where('identifier', $request->uuid)->first();
        error_log($form_instance);
        if (!is_null($form_instance)) {
            # Download data, use downloadData function
            error_log('not null ... calling downloadData');
            return $this->downloadData($request->form_id, $form_instance->id, $request->filename);
        }

        # TODO :: if uuid not found, then run sync first, then download the data
        // $sync = $flowData->seedFlowData(false, $request->form_id); # using seed to sync
        $sync = $syncData->syncData(false, $request->uuid); # using flow sync api
        error_log($sync);
        if ($sync !== true) {
            error_log('Sync failed');
            return \response('Sync failed', 204);
        }
        $form_instance = FormInstance::where('identifier', $request->uuid)->first();
        error_log($form_instance);
        if (is_null($form_instance)) {
            error_log('No Content');
            return \response('No Content', 204);
        }
        return $this->downloadData($request->form_id, $form_instance->id, $request->filename);
    }

    public function downloadData($form_id, $instance_id, $filename)
    // public function downloadData(Request $request)
    {
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
        // return ["link" => $this->writeCsv($results, $request->filename)];
        return ["link" => $this->writeCsv($results, $filename)];
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

    private function writeCsv($data, $filename)
    {
        $filename .= ".csv";
        if (count($data) === 0) {
            return Storage::disk('public')->url($filename);
        }

        $writer = Writer::createFromPath('../public/uploads/'.$filename, 'w+');
        $writer->insertOne(collect($data['headers'])->toArray());
        $writer->insertAll(collect($data['records'])->toArray());

        return Storage::disk('public')->url($filename);
    }
}