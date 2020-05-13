<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Option;
use App\Question;
use App\FormInstance;

class QueryController extends Controller
{
    public function getWashDomain(Request $requests, FormInstance $forminstances)
    {
        $data = $forminstances->has('answers.options')->get();
        $data = collect($data)->map(function($item){
            $domain = collect();
            $values = collect();
            $resuts = collect();
            collect($item->answers)->each(function($answer) use ($domain , $values){
                if($answer->question_id === config('query.wash_domain.id')){
                    $domain["parent"] = Str::beforeLast($answer->name, ' - ');
                    $domain["children"] = Str::afterLast($answer->name, ' - ');
                }
                $name = Str::lower($answer->question->name);
                $numeric = $answer->question->type === "numeric";
                if (Str::contains($name, ' - quantity')){
                    $name = Str::afterLast($name, ' - ');
                }
                if($numeric){
                    $values[$name] = $answer->value;
                }
            });
            return [
                "domain"=> $domain,
                "values"=> $values,
            ];
        });
        return $data;
    }
}
