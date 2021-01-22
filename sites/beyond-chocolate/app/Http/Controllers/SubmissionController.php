<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\StatefulGuard;
use App\Models\WebForm;
use App\Models\Collaborator;
use Akvo\Models\FormInstance;
use Akvo\Models\QuestionGroup;
use Akvo\Models\Answer;

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
        $questions = QuestionGroup::where('form_id', $request->form_id)->with('questions')->get();
        $answers = Answer::where('form_instance_id', $request->instance_id)->with('option.option', 'cascade.cascade')->get();
        $records = collect();
        $results = $questions->map(function ($q) use ($answers, $records) {
            foreach ($q['questions'] as $key => $value) {
                $gid = null;
                $groupName = null;
                $repeat = null;
                if ($key === 0) {
                    $gid = $q['id'];
                    $groupName = $q['name'];
                    $repeat = $q['repeat'];
                }
                $qid = $key;
                $question = $value['name'];
                $answer = $this->fetchAnswer($value, $answers);
                $records->push([$gid, $groupName, $repeat, $qid, $question, $answer]);
            }
        });
        return [$headers, $records];
        return [$questions, $answers];
    }

    private function fetchAnswer($question, $answers)
    {
        $qtype = $question['type'];
        $answer = $answers->where('question_id', $question['id']);
        if (count($answer) === 0) {
            $answer = 'NA';
            return $answer;
        }
        if ($qtype === 'free') {
            if (count($answer) === 1) {
                $answer = $answer->first();
                $answer = $answer['name'];
            }
        }
        if ($qtype === 'numeric') {
            if (count($answer) === 1) {
                $answer = $answer->first();
                $answer = $answer['value'];
            }
        }
        if ($qtype === 'option') {
            if (count($answer) === 1) {
                $answer = $answer->first();
                $answer = ($answer['option'] === null) ? "NA" : $answer['option']['option']['name'];
            } else {
                dd($answer);
            }
        }
        if ($qtype === 'cascade') {
            if (count($answer) === 1) {
                $answer = $answer->first();
                $answer = ($answer['cascade'] === null) ? "NA" : $answer['cascade']['cascade']['name'];
            } else {
                dd($answer);
            }
        }
        return $answer;
    }
}
