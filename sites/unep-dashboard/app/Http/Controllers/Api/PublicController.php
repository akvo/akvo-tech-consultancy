<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function questions() {
        return \App\Question::select(['code', 'name'])->get();
    }

    public function values() {
        return \App\Value::select(['code', 'name'])->get();
    }

    public function countries() {
        return \App\Country::select(['code', 'name'])->get();
    }

    public function regions() {
        return \App\Group::select(['code', 'name'])->get();
    }

    public function actions() {
        $actions = \App\Datapoint::select(['uuid', 'id'])->with('title')->get();
        $actions = $actions->transform(function($q) {
            return [
                'uuid' => $q->uuid,
                'name' => $q->title->value,
            ];
        });
        return $actions;
    }

}
