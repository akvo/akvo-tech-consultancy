<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Akvo\Api\Auth;
use Akvo\Api\FlowApi;
use Akvo\Models\Sync;
use App\Seeds\DataPointSeeder;
use App\Seeds\FormSeeder;
use App\Models\WebForm;

class FlowDataSyncController extends Controller
{
    /**
     * init true -> run this sync for all data
     *      false -> run this sync based on given uuid
     */
    public function syncData($init = true, $uuid = null)
    {
        $config = config('bc');
        $surveys = collect($config['forms']);

        // collections
        $dataPointDeleted = collect();
        $dataPointChanged = collect();
        $formChanged = collect();
        $surveyChanged = collect();
        $formInstanceDeleted = collect();
        $formInstanceChanged = collect();
        $formDeleted = collect();
        $surveyDeleted = collect();

        $sync_url = Sync::all()->last()['url'];
        $auth = new Auth();
        $token = $auth->getToken();
        if (!$token) {
            return "Invalid Access";
        }
        $api = new FlowApi($auth);
        $repeat = true;
        do {
            $results = $api->fetch($sync_url);
            if ($results === 204) {
                $repeat = false;
                continue;
            }
            // collections
            $dataPointDeleted->push($results['changes']['dataPointDeleted']);
            $dataPointChanged->push($results['changes']['dataPointChanged']);
            $formChanged->push($results['changes']['formChanged']);
            $surveyChanged->push($results['changes']['surveyChanged']);
            $formInstanceDeleted->push($results['changes']['formInstanceDeleted']);
            $formInstanceChanged->push($results['changes']['formInstanceChanged']);
            $formDeleted->push($results['changes']['formDeleted']);
            $surveyDeleted->push($results['changes']['surveyDeleted']);
            $sync_url = $results['nextSyncUrl'];
        } while($repeat);

        # TODO :: sync database with collections value
        $dataPointSeeder = new DataPointSeeder($api, null);
        // SURVEY
        if ($init && count($surveyChanged) > 0) {
            $survey_changes = $surveyChanged->flatten(1)->whereIn('id', $surveys->pluck('surveyGroupId'))->values();
            foreach ($survey_changes as $key => $survey) {
                $input = \Akvo\Models\Survey::updateOrCreate(
                    ['id' => (int) $survey['id']],
                    [
                        'id' => (int) $survey['id'],
                        'name' => $survey['name'],
                        'path' => '',
                        'registration_id' => (int) $survey['registrationFormId']
                    ]
                );
            }
        }
        // FORM
        if ($init && count($formChanged) > 0) {
            $formIds = $surveys->pluck('surveyId');
            $forms = $formChanged->flatten(1)->whereIn('id', $formIds)->values();
            foreach ($forms as $key => $form) {
                $survey = $surveys->where('surveyId', $form['id'])->first();
                $input = \Akvo\Models\Form::updateOrCreate(
                    ['id' => (int) $form['id']],
                    [
                        'id' => (int) $form['id'],
                        'survey_id' => (int) $survey['surveyGroupId'],
                        'name' => $form['name']
                    ]
                );
            }
            $formSeeder = new FormSeeder($api);
            $formSeeder->seed(false, $forms);
        }
        // DATAPOINT & FORM_INSTANCE
        if (count($dataPointChanged) > 0 && count($formInstanceChanged) > 0) {
            # TODO :: collect all webform table value if submitted
            $webforms = WebForm::where('submitted', true)->pluck('uuid');
            if (!$init && !is_null($uuid) && !collect($webforms)->contains($uuid)) {
                $webforms = collect($webforms)->push($uuid);
            }
            $datapoints = $dataPointChanged->flatten(1)->whereIn('identifier', $webforms)->values();;
            $form_instances = $formInstanceChanged->flatten(1)->whereIn('identifier', $webforms)->values();
            foreach ($form_instances as $key => $fi) {
                $survey = $surveys->where('surveyId', $fi['formId'])->first();
                $datapoint_updates = $dataPointSeeder->seedDataPoints(null, false, $datapoints, $survey['surveyGroupId']);
            }
            $form_instance_updates = $dataPointSeeder->seedFormInstances(null, null, false, $form_instances);
        }

        # TODO :: save last sync_url
        $checkSyncUrl = Sync::where('url', $sync_url)->first();
        if(is_null($checkSyncUrl)) {
            $sync = Sync::create(['survey_id' => 116680069, 'url' => $sync_url]);
        } 

        return ($init) ? "Done" : true;
    }
}
