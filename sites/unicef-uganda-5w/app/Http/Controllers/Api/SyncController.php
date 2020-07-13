<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Libraries\Flow;
use App\Libraries\FlowScale;
use App\Sync;
use App\DataPoint;
use App\FormInstance;

class SyncController extends Controller
{
    public function syncData(Flow $flow) 
    {
        $surveyIds = collect(config('surveys.surveyId'));
        $surveyIds->each(function ($surveyId) use ($flow) {
            $sync = Sync::where('survey_id', $surveyId)->orderBy('id', 'desc')->first(); 
            $results = $flow->fetch($sync->url);
            
            if (!isset($results['changes']) && $results === 204) {
                echo($results." : No update data available".PHP_EOL);
                return null;
            }

            $deleteSurveys = null;
            if (collect($results['changes']['surveyDeleted'])->isNotEmpty()) {
                $deleteSurveys = $this->deleteSurveys($results['changes']['surveyDeleted']);
            } 

            $updateSurveys = null;
            if (collect($results['changes']['surveyChanged'])->isNotEmpty()) {
                $updateSurveys = $this->updateSurveys($results['changes']['surveyChanged']);
            } 

            $deleteDataPoints = null;
            if (collect($results['changes']['dataPointDeleted'])->isNotEmpty()) {
                $deleteDataPoints = $this->deleteDataPoints($results['changes']['dataPointDeleted']);
            } 

            $updateDataPoints = null;
            if (collect($results['changes']['dataPointChanged'])->isNotEmpty()) {
                $updateDataPoints = $this->updateDataPoints($results['changes']['dataPointChanged'], $surveyId);
            } 

            $deleteForms = null;
            if (collect($results['changes']['formDeleted'])->isNotEmpty()) {
                $deleteForms = $this->deleteForms($results['changes']['formDeleted']);
            } 

            $updateForms = null;
            if (collect($results['changes']['formChanged'])->isNotEmpty()) {
                $updateForms = $this->updateForms($results['changes']['formChanged']);
            } 


            $deleteFormInstances = null;
            if (collect($results['changes']['formInstanceDeleted'])->isNotEmpty()) {
                $deleteFormInstances = $this->deleteFormInstances($results['changes']['formInstanceDeleted']);
            } 

            $updateFormInstances = null;
            if (collect($results['changes']['formInstanceChanged'])->isNotEmpty()) {
                $updateFormInstances = $this->updateFormInstances($results['changes']['formInstanceChanged']);
            } 

            if (isset($results['nextSyncUrl'])) {
                $postSync = new Sync(['url' => $results['nextSyncUrl']]);
                //$postSync->save();
            }

            return $results;
        });
    }

    private function updateDataPoints($results, $surveyId)
    {
        $data = collect($results)->each(function ($item) use ($surveyId) {
            $dataPoint = DataPoint::where('id', $item->id)->get();
            $result = null;
            if ($dataPoint->isNotEmpty()) {
                $updateData = $dataPoint->first();
                $updateDataPoint = DataPoint::find($updateData->id);
                $updateDataPoint->display_name = $item->displayName;
                $updateDataPoint->position = $item->latitude.', '.$item->longitude;
                $result = $updateDataPoint->save();
            }

            if ($dataPoint->isEmpty()) {
                $postDataPoint = new DataPoint([
                    'id' => $item->id,
                    'survey_id' => $surveyId,
                    'display_name' => $item->displayName,
                    'position' => $item->latitude.', '.$item->longitude
                ]); 
                $result = $postDataPoint->save();
            }
            return $result;
        });

        return $data;
    }

    private function updateFormInstances($results)
    {
        $data = collect($results)->each(function ($item) {
            $formInstance = FormInstance::where('identifier', $item->identifier)->get();
            $result = null;
            return $result;
        });
    }
}
