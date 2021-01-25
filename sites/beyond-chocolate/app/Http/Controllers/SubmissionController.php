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

class SubmissionController extends Controller
{
    public function getSubmittedData(Request $request, StatefulGuard $guard)
    {
        $user = $request->user();
        $collaboratorForms = Collaborator::where('organization_id', $user->organization_id)->get()->pluck('web_form_id');
        $webforms = WebForm::where([
            ['user_id', $user->id],
            ['submitted', true]
        ])->orWhere(function ($query) use ($collaboratorForms) {
            $query->where('submitted', true)
                  ->whereIn('id', $collaboratorForms);
        })->with('organization', 'user')->get()->map(function ($wf) {
            $wf['org_name'] = $wf['organization']['name'];
            $wf['user_name'] = $wf['user']['name'];
            return collect($wf)->only('uuid', 'org_name', 'user_name');
        });
        $form_instances = FormInstance::whereIn('identifier', $webforms->pluck('uuid'))
            ->with('datapoint', 'form')
            ->get()
            ->map(function ($fi) use ($webforms) {
                $wf = $webforms->where('uuid', $fi['identifier'])->first();
                $fi['org_name'] = $wf['org_name'];
                $fi['submitter_name'] = $wf['user_name'];
                $fi['form_name'] = $fi['form']['name'].' - '.$fi['datapoint']['display_name'];
                return collect($fi)->only('org_name', 'submitter_name', 'form_name', 'id', 'form_id', 'data_point_id');
            });
        return $form_instances;
    }

    public function downloadData(Request $request)
    {
        $headers = ["gid", "groupName", "repeat", "qid", "question", "answer"];
        $qGroups = QuestionGroup::where('form_id', $request->form_id)->with('questions')->get();
        $answers = Answer::where('form_instance_id', $request->instance_id)->with('option.option', 'cascade.cascade')->get();
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
                $answer = $answers->where('question_id', $q['id']);
                # TODO:: Repeat question-answer values
                if ($qg['repeat']) {
                    foreach ($answer as $key => $value) {
                        $fetchAnswer = $this->fetchAnswer($q['type'], $answer->first());
                        $repeat = ($qIndex === 0) ? $fetchAnswer['repeat'] : null;
                        $answerValue = $fetchAnswer['answer'];
                        $records->push([$gid, $groupName, $repeat, $qid, $question, $answerValue]);
                    }
                }
                # TODO:: Non repeat question-answer values
                if (!$qg['repeat']) {
                    $fetchAnswer = $this->fetchAnswer($q['type'], $answer->first());
                    $repeat = ($qIndex === 0) ? $fetchAnswer['repeat'] : null;
                    $answerValue = $fetchAnswer['answer'];
                    $records->push([$gid, $groupName, $repeat, $qid, $question, $answerValue]);
                }
            }
        });
        $results = ["headers" => $headers, "records" => $records];
        return ["link" => $this->writeCsv($results, $request->filename)];
    }

    private function fetchAnswer($qtype, $answer)
    {
        // return answer and repeat_index
        $repeat_index = 1;
        if ($answer === null) {
            $answer = 'NA';
            return ['repeat' => $repeat_index, 'answer' => $answer];
        }
        $repeat_index += $answer['repeat_index'];
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
                return ['repeat' => $repeat_index, 'answer' => $answer];
            }
            if (!is_array($answer['cascade'])) {
                $answer = $answer['cascade']['cascade']['name'];
                return ['repeat' => $repeat_index, 'answer' => $answer];
            }
            if (is_array($answer['cascade'])) {
                $answer = $answer['cascade']->pluck('cascades')->pluck('name')->join(' | ');
                return ['repeat' => $repeat_index, 'answer' => $answer];
            }
        }
        return ['repeat' => $repeat_index, 'answer' => $answer];
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