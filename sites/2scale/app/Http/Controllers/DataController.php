<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Libraries\Akvo;

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
}
