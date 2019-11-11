<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Libraries\Akvo;
use App\Libraries\Helpers;
use App\Question;
use App\Data;

class DataController extends Controller
{
    public function getDataPoint(Request $request)
    {
        $query = http_build_query($request->all());

        $result = Akvo::get(config('akvo.endpoints.datapoints') . '?' . $query);
        $tmp = [];
        foreach($result['dataPoints'] as $item) {
            $tmp[] = $item;
        }

        $isNotFinished = true;
        while($isNotFinished) {
            if (isset($result['nextPageUrl'])) {
                $result = Akvo::get($result['nextPageUrl']);
                foreach($result['dataPoints'] as $item) {
                    $tmp[] = $item;
                }
            } else {
                $isNotFinished = false;
            }
        }

        if ($tmp) {
            return response()->json([
                'status' => 'success',
                'data' => $tmp
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Survey error'
            ]);
        }
    }

    public function getFormInstance(Request $request)
    {
        $query = http_build_query($request->all());

        $surveyRslt = Akvo::get(config('akvo.endpoints.surveys') . '/' . $request->query('survey_id'));

        $result = Akvo::getSurveyData(
            $request->query('survey_id'),
            $request->query('form_id')
        );

        if ($result) {
            return response()->json([
                'status' => 'success',
                'data' => $result
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Data error'
            ]);
        }
    }

    public function downloadCSV(Request $request)
    {
        $query = http_build_query($request->all());
        
        $surveyRslt = Akvo::get(config('akvo.endpoints.surveys') . '/' . $request->query('survey_id'));

        foreach ($surveyRslt['forms'] as $item) {
            if ($item['id'] == $request->query('form_id')) {
                $form = $item;
            }
        }

        if ($form && isset($form['questionGroups'])) {
            $gids = [];
            $names = [];
            $qids = [];
            foreach ($form['questionGroups'] as $qgitem) {
                $gids[] = $qgitem['id'];
                foreach ($qgitem['questions'] as $question) {
                    $names[$question['id']] = ['name' => $question['name'], 'type' => $question['type']];
                }
            }
        }
        
        $result = Akvo::getSurveyData(
            $request->query('survey_id'),
            $request->query('form_id')
        );

        $answersTmp = [];
        $qids = array_keys($names);
        foreach ($result as $item) {
            $list = [];
            foreach ($gids as $gid) {
                $group = isset($item['responses'][$gid]) ? $item['responses'][$gid] : false;
                if ($group) {
                    foreach ($qids as $qid) {
                        $tmp = isset($group[0][$qid]) ? $group[0][$qid] : false;
                        if ($tmp) {
                            $list[$qid] = $tmp;
                        }
                    }
                }
            }

            $answersTmp[] = $list;
        }

        $titles = [];
        foreach ($names as $item) {
            $titles[] = $item['name'];
        }

        $answers = [];
        foreach ($answersTmp as $item) {
            $tmp = [];
            foreach ($names as $k => $name) {
                $val = isset($item[$k]) ? $item[$k] : '';
                if ($val) {
                    if (in_array($name['type'], ['FREE_TEXT', 'NUMBER', 'DATE'])) {
                        $val = $val;
                    } else if ($name['type'] == 'OPTION') {
                        $tmpval = [];
                        foreach ($val as $cval) {
                            $tmpval[] = $cval['text'];
                        }

                        $val = implode('-', $tmpval);
                    } else if ($name['type'] == 'CASCADE') {
                        $tmpval = [];
                        foreach ($val as $cval) {
                            $tmpval[] = $cval['name'];
                        }

                        $val = implode('-', $tmpval);
                    }
                }

                $tmp[] = $val;
            }

            $answers[] = $tmp;
        }

        $data['names'] = $titles;
        $data['rows'] = $answers;

        return Helpers::downloadCSV('SURVEY_' 
            . $request->query('survey_id') 
            . '_FORM_' 
            . $request->query('form_id') 
            . '.csv', $data
        );
    }

    public function downloadCSV2(Request $request)
    {
        $formId = $request->input('form_id');
        $country = $request->input('country');
        $from = $request->input('from');
        $to = $request->input('to');

        $questions = Question::where('form_id', $formId)->get();
        $titles = [];
        $qids = [];
        foreach ($questions as $item) {
            $titles[] = $item->text;
            $qids[] = $item->question_id;
        }
      
        $query = Data::whereIn('question_id', $qids);

        if ($country) {
            $query->where('country', $country);
        }

        if ($from && $to) {
            $query->whereBetween('created_at', [$from, $to]);
        } else if ($from) {
            $query->whereDate('created_at', '>=', $from);
        } else if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }

        $qdata = $query->get();

        $answers = [];
        foreach ($qdata as $item) {
            $answers[$item->datapoint_id][$item->question_id] = $item->answer;
        }

        $tmp = [];
        foreach ($answers as $k => $item) {
            foreach ($qids as $qid) {
                $tmp[$k][] = isset($item[$qid]) ? $item[$qid] : '';
            }
        }

        $data['names'] = $titles;
        $data['rows'] = $tmp;
        return Helpers::downloadCSV(
            $country . '_' .
            'FORM_' 
            . $request->query('form_id') 
            . '.csv', $data
        );
    }

    public function cron(Request $request)
    {
        Akvo::updateDataSurvey();

        return response()->json([
            'status' => 'Updated at ' . date('d-m-Y h:i:s')
        ]);
    }
}
