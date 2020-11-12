<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    /**
        @OA\Info(
            title="UNEP PUBLIC API", 
            version="0.1"
        )
    */

    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function index(Request $request)
    {
        return view('index', $request);
    }

    public function questions() {
        $question = \App\Question::select(['id', 'name'])->get();
        return $question->transform(function($q){
            return [
                'translationable_id' => $q->id,
                'text' => $q->name,
            ];
        });
    }

    public function values() {
        $value = \App\Value::select(['id', 'name'])->get();
        return $value->transform(function($q){
            return [
                'translationable_id' => $q->id,
                'text' => $q->name,
            ];
        });
    }

    public function countries() {
        $country = \App\Country::select(['id', 'name'])->get();
        return $country->transform(function($q){
            return [
                'translationable_id' => $q->id,
                'text' => $q->name,
            ];
        });
    }

    public function regions() {
        $regions = \App\Group::select(['id', 'name'])->get();
        return $regions->transform(function($q){
            return [
                'translationable_id' => $q->id,
                'text' => $q->name,
            ];
        });
    }

    public function actions() {
        $actions = \App\Datapoint::select(['uuid', 'id'])->with('title')->get();
        $actions = $actions->transform(function($q) {
            return [
                'translationable_id' => $q->title->id,
                'text' => $q->title->value,
            ];
        });
        return $actions;
    }

}
