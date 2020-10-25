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

    public function survey(Request $request, Auth $auth) {
        $api = new FlowApi($auth);
        $endpoint = env('AKVOFLOW_API_URL').'/'.$request->instanceId.'/surveys/'.$request->surveyId;
        $data = $api->fetch($endpoint);
        $data['forms'] = collect($data['forms'])->map(function($form) use ($request, $data){
            $ep = env('APP_URL').'/api/form-instances/'.$request->instanceId.'/';
            $form['formInstancesUrl'] = $ep.$data['id'].'/'.$form['id'];
            return $form;
        });
        return collect($data)->except('dataPointsUrl');
    }

    public function formInstances(Request $request, Auth $auth) {
        $endpoint = env('AKVOFLOW_API_URL');
        $endpoint .= '/'.$request->instanceId.'/form_instances';
        $endpoint .= '?survey_id='.$request->surveyId;
        $endpoint .= '&form_id='.$request->formId;
        $api = new FlowApi($auth);
        $data = $this->fetchAll($api, $endpoint, collect([]));
        return $data->flatten(1);
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
