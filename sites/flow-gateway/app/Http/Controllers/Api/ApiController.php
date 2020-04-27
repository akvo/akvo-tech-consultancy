<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Faker\Generator as Faker;
use App\SurveySession;
use Carbon\Carbon;
use App\Http\AkvoFlow;

class ApiController extends Controller
{
    public function index(Request $request, SurveySession $session)
    {
        return $session->with('answers')->paginate(5);
    }
    public function submit(Request $request, SurveySession $sessions, AkvoFlow $flow, Faker $faker)
    {
        $session = $sessions->where('id',$request->id)->with('answers')->first();
        $questions = $this->list_questions($session, $flow);
        $dataPointName = collect();
        $questionId = collect();
        $uuid = $faker->uuid();
        $uuid = explode("-", $uuid);
		$data = collect([
			'_version'=> $session->version,
			'_username'=> $session->type.'-'.$session->phone_number,
			'_formId'=> (string) $session->form_id,
			'_deviceId'=> $session->type.'-'.$session->phone_number,
			'_instanceId'=> $session->app,
			'_submissionStart'=> Carbon::parse($session->created_at)->timestamp,
			'_submissionStop'=> Carbon::now()->timestamp,
            '_dataPointId' => $uuid[1]."-".$uuid[2]."-".$uuid[3],
        ]);
		$answerType = collect($session->answers)->map(function($val) use ($data, $questions, $dataPointName, $flow, $questionId) {
            $dpname = $val->input;
            $questionId->push($val->question_id.'-k');
            if ($val->type === "cascade") {
                $input = explode("|", $val->input);
                $val->input = collect();
                $i = 0;
                $dpname = "";
                do {
                    if ($i === 0) {
                        $level = 0;
                    } else {
                        $dpname .= " - ";
                        $level = $input[$i - 1];
                    }
                    $cascade = $flow->getCascade($val->cascade, $level);
                    $selected = collect($cascade)->where('id',(int)$input[$i])->values()->first();
                    $dpname .= $selected["name"];
                    $val->input->push(array(
                        "id" => (int) $input[$i],
                        "text" => $selected["name"],
                        "option" => (int) $selected["code"]
                    ));
                    $i++;
                } while ($i < count($input));
                $val->input = json_encode($val->input);
            }
            if ($val->type === "option") {
                $input = $questions->where('id', $val->question_id)->first();
                $val->input = (string) $val->input;
                $val->input = strtoupper($val->input);
                $dpname = collect($input["options"]["option"])
                    ->where('code', $val->input)->values();
                $val->input = (string) $dpname->map(function($keyval) {
                    if (Arr::hasAny($keyval,'code')) {
                        return [
                            "text" => $keyval["text"],
                            "code" => $keyval["code"]
                        ];
                    }
                    return ["text" => $keyval["text"]];
                });
                $dpname = $dpname->first()["text"];
            }
            if ($val->type === "numeric") {
                $val->type = "FREE";
            }
			if ($val->datapoint) {
                $dataPointName->push($dpname);
			}
            $qid = (string) $val->question_id;
			$data->put($qid.'-k', $val->input);
            return strtoupper($val->type);
		})->toArray();
		$data['answerType'] = join(",",$answerType);
        $data['_dataPointName'] = join("-", $dataPointName->toArray());
        $data['questionId'] = join(",", $questionId->toArray());
        $response = Http::withHeaders([
            'Origin' => config('akvoflow.submit'),
            'Content-Type' => 'application/json'
          ])->post(config('akvoflow.submit'), $data->all());
        if ($response->status() === 200) {
            $session->synced_at = now();
            $session->uuid = $data['_dataPointId'];
            $session->save();
        }
        return $session;
    }

    private function list_questions($session, $flow)
    {
        $questions;
        $survey = $flow->getForm($session->instance_name, $session->form_id);
        $isObject = Arr::has($survey["questionGroup"], "question");
        if ($isObject) {
            $heading = $survey["questionGroup"]["heading"];
            $questions = collect($survey["questionGroup"]["question"])
                ->map(function($question) {
                    return $question;
            });
        }
        if (!$isObject) {
            $questions = collect($survey["questionGroup"])->map(function($group){
                return collect($group["question"])->map(function($question) {
                    return $question;
                })->toArray();
            })->flatten(1);
        }
        return collect($questions);
    }
}
