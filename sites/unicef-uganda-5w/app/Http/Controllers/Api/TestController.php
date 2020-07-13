<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Libraries\Flow;
use App\Libraries\Auth;
use App\Form;
use App\Answer;
use App\AnswerOption;
use App\AnswerCascade;
use App\DataPoint;
use App\FormInstance;

class TestController extends Controller
{
    public function __construct() {
        $fid = 0;
        $this->collection = collect();
        $this->saved = [
                'dataPoints' => collect(),
                'formInstances' => collect(),
                'answers' => collect(),
            ];
        $this->form = Form::select('id','survey_id')->first();
        $auth = new Auth();
        $this->flow = new Flow($auth);
    }

    public function sync()
    {
        Artisan::call('flow:bridge --empty');
        return Artisan::call('flow:bridge');
    }

    public function init()
    {
        $data = $this->flow->get('forminstances', $this->form->survey_id, $this->form->id);
        if ($data) {
            foreach($data['formInstances'] as $d) {
                $this->collection->push($d);
            }
            $this->getAllFormInstances($data['nextPageUrl']);
        }
        if (count($this->collection) > 0) {
            $this->saveall('dataPoints',$this->collection);
            $this->saveall('formInstances',$this->collection);
            $answers = $this->collection->map(function($fi){
                $this->fid = $fi['id'];
                return collect($fi['responses'])->values()->map(function($qg) {
                    return collect($qg)->map(function($as, $i) {
                        return collect($as)->map(function($a, $qid) use ($i) {
                            $qdb = \App\Question::select('type','cascade_id')
                                ->where('id', $qid)->first();
                            $answer = collect([
                                'form_instance_id' => (int) $this->fid,
                                'repeat_index' => $i,
                                'question_id' => $qid,
                            ]);
                            switch($qdb->type){
                            case 'option':
                                $opt = \App\Option::where('name', Arr::last($a)['text'])->first();
                                $answer['name'] = $opt->text;
                                $answer = Answer::create($answer->toArray());
                                $answer_option = AnswerOption::create([
                                    'answer_id' => $answer->id,
                                    'option_id' => $opt->id
                                ]);
                                break;
                            case 'numeric':
                                $answer['value'] = (int) $a;
                                $answer = Answer::create($answer->toArray());
                                break;
                            case 'cascade':
                                $code = Str::lower(Arr::last($a)['code']);
                                $level = count($a) - 1;
                                $casc = \App\Cascade::where('level', $level)
                                    ->where('code', $code)
                                    ->first();
                                dd($casc); die();
                                $answer['name'] = $code;
                                $answer = Answer::create($answer->toArray());
                                $answer_option = AnswerCascade::create([
                                    'answer_id' => $answer->id,
                                    'cascade_id' => $casc->id
                                ]);
                                break;
                            case 'date':
                                $answer['name'] = Str::beforeLast($a, 'T');
                                $answer = Answer::create($answer->toArray());
                                break;
                            default:
                                $answer['name'] = $a;
                                $answer = Answer::create($answer->toArray());
                                break;
                            }
                            $this->saved['answers']->push($answer);
                            return $answer;
                        })->values();
                    });
                });
            });
            return $data;
        }
        return "No Data";
    }

    private function saveAll($type, $data)
    {
        return $data->map(function($d) use ($type) {
            $result = False;
            if ($type === "dataPoints") {
                $result = DataPoint::create([
                    'id' =>  $d['dataPointId'],
                    'survey_id' =>  $this->form->survey_id,
                    'display_name' =>  $d['displayName'],
                ]);
                $this->saved[$type]->push($result);
            }
            if ($type === "formInstances") {
                $result = FormInstance::create([
                    'id' => $d['id'],
                    'form_id' =>  $this->form->id,
                    'data_point_id' =>  $d['dataPointId'],
                    'identifier' =>  $d['identifier'],
                    'submitter' =>  $d['submitter'],
                    'device' =>  $d['deviceIdentifier'],
                    'submission_date' =>  new Carbon($d['submissionDate']),
                    'survey_time' =>  $d['surveyalTime'],
                ]);
                $this->saved[$type]->push($result);
            }
            return $result;
        });
    }

    private function getAllFormInstances($url)
    {
        $data = $this->flow->fetch($url);
        if (count($data['formInstances']) > 0) {
            foreach($data['formInstances'] as $d) {
                $this->collection->push($d);
            }
            return $this->getAllFormInstances($data['nextPageUrl']);
        }
        return true;
    }

}
