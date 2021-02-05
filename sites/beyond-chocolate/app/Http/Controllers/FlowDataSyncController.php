<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Akvo\Api\Auth;
use Akvo\Api\FlowApi;
use Akvo\Models\Sync;
use App\Seeds\DataPointSeeder;
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

        # TODO :: collect all webform table value if submitted
        if ($init) {
            $webforms = WebForm::where('submitted', true)->pluck('uuid');
        }

        # TODO :: sync database with collections value
        $dataPointSeeder = new DataPointSeeder($api, null);
        if (count($dataPointChanged) > 0 && count($formInstanceChanged) > 0) {
            $datapoints = $dataPointChanged->flatten(1);
            $datapoints = ($init) ? $datapoints->whereIn('identifier', $webforms)->values() : $datapoints->where('identifier', $uuid)->values();
            $form_instances = $formInstanceChanged->flatten(1);
            $form_instances = ($init) ? $form_instances->whereIn('identifier', $webforms)->values() : $form_instances->where('identifier', $uuid)->values();
            foreach ($form_instances as $key => $fi) {
                $survey = $surveys->where('surveyId', $fi['formId'])->first();
                $datapoint_updates = $dataPointSeeder->seedDataPoints(null, false, $datapoints, $survey['surveyGroupId']);
            }
            $form_instance_updates = $dataPointSeeder->seedFormInstances(null, null, false, $form_instances);
        }

        # TODO :: save last sync_url
        $sync = Sync::create(['survey_id' => 116680069, 'url' => $sync_url]);

        return ($init) ? "Done" : true;
    }
}
