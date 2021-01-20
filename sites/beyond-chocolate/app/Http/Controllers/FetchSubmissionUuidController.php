<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\WebForm;

class FetchSubmissionUuidController extends Controller
{
    public function fetch()
    {
        $forms = config('bc.forms');
        $url = config('bc.flow_data_form_instance_url');
        $projects = config('webform.forms.project');
        $collections = collect();
        foreach ($forms as $form) {
            $data = $this->request($url.$form['surveyGroupId']."/".$form['surveyId']);
            if(count($data) > 0) {
                $collections->push($data);
            }
        }
        $users = User::all();
        $webforms = WebForm::where('submitted', true)->get();
        $results = $collections->flatten(1)->map(function ($item) use ($users, $webforms) {
            $user = $users->where('email', $item['submitter'])->first();
            $webform = $webforms->filter(function ($wf) use ($user, $item) {
                $dpname = (strtolower($item['displayName']) === 'untitled') ? null : $item['displayName'];
                return $wf['user_id'] === $user->id && $wf['organization_id'] === $user->organization_id && $wf['form_id'] === (int) $item['formId'] && $wf['display_name'] === $dpname;
            })->values();
            // update webform
            $update = [];
            if (count($webform) === 1) {
                $update = WebForm::find($webform[0]['id']);
                $update['uuid'] = $item['identifier'];
                $update->save();
            }
            $res = collect($item)->only('identifier', 'displayName', 'formId', 'submitter');
            $res['webform'] = $webform;
            $res['update'] = $update;
            return $res;
        });
        return $results;
    }

    private function request($url)
    {
        $client = new \GuzzleHttp\Client();
        try {
            $response = $client->get($url);        
            if ($response->getStatusCode() === 200) {
                return json_decode($response->getBody(), true);
            }
            return $response->getStatusCode();

        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
            }
        }
        return false;
    }
}
