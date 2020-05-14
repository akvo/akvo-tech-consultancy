<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use App\Question;
use App\FormInstance;
use App\Cascade;

class PageController extends Controller {

    public function getDomains(Request $requests, FormInstance $forminstances, Cascade $cascades){
        $data = $forminstances->has('answers.options')->get();
        $data = collect($data)->map(function($item) use ($cascades) {
            $domain = collect();
            $values = collect();
            $resuts = collect();
            collect($item->answers)->each(function($answer) use ($domain , $values){
                if($answer->question_id === config('query.wash_domain.id')){
                    $domain["parent"] = Str::beforeLast($answer->name, ' - ');
                    $domain["children"] = Str::afterLast($answer->name, ' - ');
                    $domain["option_id"] = $answer->options->first()->id;
                }
                if($answer->question_id === config('query.cascade.locations')){
                    $domain["county"] = $answer->cascades->first()->parent_id;
                    $domain["county_id"] = $answer->cascades->first()->id;
                };
                $name = Str::lower($answer->question->name);
                $numeric = $answer->question->type === "numeric";
                if (Str::contains($name, ' - quantity')){
                    $name = Str::afterLast($name, ' - quantity ');
                }
                if($numeric){
                    $values[$name] = $answer->value;
                }
            });
            return [
                "name"=> $domain["parent"],
                "county_id"=> $domain["county_id"],
                "county"=> $domain["county"],
                "child"=> $domain["children"],
                "child_id"=> $domain["option_id"],
                "parent_id"=> NULL,
                "details"=> $values,
            ];
        });
        $data = $data->groupBy("name")->map(function($groups, $key) {
            $parent_id = config('query.wash_domain.domains.'.$key.'.id');
            $childs= $groups->groupBy("child")->map(function($child, $key) use ($parent_id) {
                $id = $child->first()["child_id"];
                $values = $child->groupBy("county")->map(function($value, $key) use ($id) {
                    $sums = collect();
                    $country_id = $value->first()["county_id"];
                    $value = $value->map(function($d) use ($sums) {
                        collect($d["details"])->each(function($v, $k) use ($sums){
                            $name = Str::replaceFirst(' beneficiaries ', '_' , $k);
                            if (!isset($sums[$name])) {
                                $sums[$name] = $v;
                            }
                            if (isset($sums[$name])) {
                                $sums[$name] += $v;
                            }
                        });
                        return $d["details"];
                    });
                    return [
                        "id" => $key,
                        "value_id" => $id,
                        "country_id" => $country_id,
                        "value" => isset($sums["archived"]) ? $sums["archived"] : NULL,
                        "description" => NULL,
                        // "origin" => $value,
                    ];
                })->values();
                return [
                    "id" => $id,
                    "parent_id" => $parent_id,
                    "name" => $key,
                    "country_values" => $values,
                ];
            })->values();
            $childs = $childs->map(function($item, $index) use ($parent_id){
                $index = (string) $index;
                $item["code"] = (string) $parent_id."#".$index;
                return $item;
            });
            return [
                "id" => $parent_id,
                "code" => (string) $parent_id,
                "name"=>$key,
                "parent_id"=>NULL,
                "childs"=>$childs,
            ];
        })->values();
        return $data;
    }

    public function getLocations(Question $questions) {
        $question = $questions->where('id', config('query.cascade.locations'))
                             ->with('cascade.childrens')
                             ->first();
        return $question->cascade->childrens->transform(function($county){
            $county->code = Str::upper($county->code);
            $county->name = Str::title($county->name);
            return $county->makeHidden(['level','parent_id']);
        });
    }

}
