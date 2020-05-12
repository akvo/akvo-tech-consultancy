<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Libraries\Flow;
use App\Libraries\FlowScale;
use App\Sync;

class SyncController extends Controller
{
    public function syncData(Flow $flow) 
    {
       $sync = Sync::orderBy('id', 'desc')->first(); 
       $results = $flow->fetch($sync['url']);
       $changes = collect($results['changes'])->map(function ($item) {
           $deleteSurveys = null;
           if (collect($item['surveyDeleted'])->count() !== 0) {
               $deleteSurveys = $this->deleteSurveys($item['surveyDeleted']);
           } 

           $updateSurveys = null;
           if (collect($item['surveyChanged'])->count() !== 0) {
               $updateSurveys = $this->updateSurveys($item['surveyChanged']);
           } 

           $deleteDataPoints = null;
           if (collect($item['dataPointDeleted'])->count() !== 0) {
               $deleteDataPoints = $this->deleteDataPoints($item['dataPointDeleted']);
           } 

           $updateDataPoints = null;
           if (collect($item['dataPointChanged'])->count() !== 0) {
               $updateDataPoints = $this->updateDataPoints($item['dataPointChanged']);
           } 

           $deleteForms = null;
           if (collect($item['formDeleted'])->count() !== 0) {
               $deleteForms = $this->deleteForms($item['formDeleted']);
           } 

           $updateForms = null;
           if (collect($item['formChanged'])->count() !== 0) {
               $updateForms = $this->updateForms($item['formChanged']);
           } 


           $deleteFormInstances = null;
           if (collect($item['formInstanceDeleted'])->count() !== 0) {
               $deleteFormInstances = $this->deleteFormInstances($item['formInstanceDeleted']);
           } 

           $updateFormInstances = null;
           if (collect($item['formInstanceChanged'])->count() !== 0) {
               $updateFormInstances = $this->updateFormInstances($item['formInstanceChanged']);
           } 
       });

       if (isset($results['nextSyncUrl'])) {
           $postSync = new Sync(['url' => $results['nextSyncUrl']]);
           //$postSync->save();
       }

       return $changes;
    }
}
