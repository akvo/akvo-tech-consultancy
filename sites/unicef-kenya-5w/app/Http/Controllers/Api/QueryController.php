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

        $results = collect();
        $parentGroup = collect($data)->groupBy('domain.parent')->map(function ($item, $index) use ($results) {
            $result['name'] = $index;
            $result['count'] = $item->count();

            $activities = collect();
            $result['activities'] = $activities;
            $childGroup = $item->groupBy('domain.children')->map(function ($item, $index) use ($activities) {
                $values = collect();
                $activities->push([
                    'name' => $index,
                    'count' => $item->count(),
                    'values' => $values
                ]);
                
                $item->groupBy('domain.children')->map(function ($item) use ($values) {
                    $valGroup = $item->map(function ($val) {
                        return $val['values'];
                    });

                    $qtyPlanned = $valGroup->reduce(function ($total, $val) {
                        return $total + $val->get('quantity planned');
                    });

                    $qtyAchived = $valGroup->reduce(function ($total, $val) {
                        return $total + $val->get('quantity archived');
                    });

                    $beneficiariesPlanned = $valGroup->reduce(function ($total, $val) {
                        return $total + $val->get('total beneficiaries targeted');
                    });

                    $beneficiariesAchived = $valGroup->reduce(function ($total, $val) {
                        return $total + $val->get('total beneficiaries reached to date');
                    });

                    $girl = $valGroup->reduce(function ($total, $val) {
                        return $total + $val->get('girl beneficiaries reached');
                    });

                    $boy = $valGroup->reduce(function ($total, $val) {
                        return $total + $val->get('boy beneficiaries reached');
                    });

                    $man = $valGroup->reduce(function ($total, $val) {
                        return $total + $val->get('man beneficiaries reached');
                    });

                    $woman = $valGroup->reduce(function ($total, $val) {
                        return $total + $val->get('woman beneficiaries reached');
                    });

                    $values['quantity'] = [
                        'planned' => $qtyPlanned,
                        'achived' => $qtyAchived,
                    ];

                    $values['beneficiaries'] = [
                        'planned' => $beneficiariesPlanned,
                        'achived' => $beneficiariesAchived,
                        'girl' => $girl,
                        'boy' => $boy,
                        'man' => $man,
                        'woman' => $woman
                    ];
                    //$values['data'] = $valGroup;
                });
            });

            $results->push($result);
        });


        return $results;
    }
}
