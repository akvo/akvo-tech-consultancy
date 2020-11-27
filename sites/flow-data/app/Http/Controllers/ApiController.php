<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Akvo\Api\FlowApi;
use Akvo\Api\Auth;

class ApiController extends Controller
{
    public function sources() {
        $data = config('data.sources');
        $data = collect($data)->map(function($d){
            $d['survey'] = env('APP_URL').'/api/survey/idh/'.$d['sid'];
            $d['form-instances'] = env('APP_URL').'/api/form-instances/idh/'.$d['sid'].'/'.$d['fid'];
            return $d;
        });
        return $data;
    }

    public function survey(Request $request) {
        return $this->getSurvey($request->instanceId, $request->surveyId);
    }

    public function getSurvey($instanceId, $surveyId)
    {
        $auth = new Auth();
        $api = new FlowApi($auth);
        $endpoint = env('AKVOFLOW_API_URL').'/'.$instanceId.'/surveys/'.$surveyId;
        $data = $api->fetch($endpoint);
        $data['forms'] = collect($data['forms'])->map(function($form) use ($instanceId, $data){
            $ep = env('APP_URL').'/api/form-instances/'.$instanceId.'/';
            $form['formInstancesUrl'] = $ep.$data['id'].'/'.$form['id'];
            return $form;
        });
        return collect($data)->except('dataPointsUrl');
    }

    public function formInstances(Request $request) {
        return $this->getFormInstances($request->instanceId, $request->surveyId, $request->formId, $request->result);
        // $endpoint = env('AKVOFLOW_API_URL');
        // $endpoint .= '/'.$request->instanceId.'/form_instances';
        // $endpoint .= '?survey_id='.$request->surveyId;
        // $endpoint .= '&form_id='.$request->formId;
        // $api = new FlowApi($auth);
        // $data = $this->fetchAll($api, $endpoint, collect([]));
        // $data = $data->flatten(1);
        // if ($request->result === "simple") {
        //     $data = $data->map(function($d) {
        //         $responses = collect($d['responses'])->values();
        //         $results = collect();
        //         $responses = $responses->each(function($r) use ($results) {
        //             collect($r)->each(function($d) use ($results){
        //                 collect($d)->each(function($a, $k) use ($results){
        //                     $results[$k] = $a;
        //                 });
        //             });
        //         });
        //         $d["responses"] = $results;
        //         return $d;
        //     });
        // }
        // return $data;
    }

    public function getFormInstances($instanceId, $surveyId, $formId, $result=false) {
        $endpoint = env('AKVOFLOW_API_URL');
        $endpoint .= '/'.$instanceId.'/form_instances';
        $endpoint .= '?survey_id='.$surveyId;
        $endpoint .= '&form_id='.$formId;
        $auth = new Auth();
        $api = new FlowApi($auth);
        $data = $this->fetchAll($api, $endpoint, collect([]));
        $data = $data->flatten(1);
        if ($result === "simple") {
            $data = $data->map(function($d) {
                $responses = collect($d['responses'])->values();
                $results = collect();
                $responses = $responses->each(function($r) use ($results) {
                    collect($r)->each(function($d) use ($results){
                        collect($d)->each(function($a, $k) use ($results){
                            $results[$k] = $a;
                        });
                    });
                });
                $d["responses"] = $results;
                return $d;
            });
        }
        return $data;
    }

    private function fetchAll($api, $url, $data) {
        $response = $api->fetch($url);
        $data->push($response['formInstances']);
        if (isset($response['nextPageUrl'])) {
            $url = $response['nextPageUrl'];
            return $this->fetchAll($api, $url, $data);
        }
        return $data;
    }
}
