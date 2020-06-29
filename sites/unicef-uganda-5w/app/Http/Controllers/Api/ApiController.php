<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use App\Bridge;
use App\Option;
use App\Answer;

class ApiController extends Controller
{

    public function __construct()
    {
        $this->collection = collect();
    }

    public function filters(Request $requests)
    {
        /* Populate Domain Values */
        $bridges = \App\Bridge::all();
        $domains = $bridges->groupBy('domain')->transform(function($group, $key){ 
            $collection = $this->getValues($group, $key, 'domain');
            $sub_group = collect($group->groupBy('sub_domain'))->map(function($subgroup, $subkey) use ($key) {
                $collection = $this->getValues($subgroup, $subkey, 'sub_domain', $key);
                $this->collection->push($collection);
                return $collection;
            });
            $this->collection->push($collection);
            return $group;
        });
        return $this->collection;
    }

    public function locations(Request $request)
    {
        $locations = \App\Bridge::select('district')
            ->get()->unique('district')->values();
        return $locations->transform(function($location){
            $loc = \App\Cascade::select('id','code','name')->where('id', $location->district)->first();
            return collect($loc)->map(function($data, $key){
                return is_int($data) ? $data : Str::upper($data);
            });
        });
    }

    public function locationValues(Request $requests, Answer $answers)
    {
        $bridges = \App\Bridge::where('domain',$requests->domain);
        $value = 'domain';
        if ($requests->subdomain) {
            $bridges = $bridges->where('sub_domain', $requests->subdomain);
            $value = 'sub_domain';
        }
        $bridges = $bridges->get()->groupBy('district');
        $bridges = collect($bridges)->map(function($data, $key) use ($requests, $value) {
            $location = \App\Cascade::where('id', $key)->first();
            $id= $value === 'domain' ? $requests->domain : $requests->subdomain;
            $parentId = $value === 'domain' ? null : $requests->domain;
            $value = $this->getValues($data, $id, $value, $parentId);
            return [
                "id" => (int) $key,
                "parent_id" => (int) $location->parent_id,
                "code" => $location->code,
                "name" => $location->text,
                "level"=> $location->level,
                "text" => $location->text,
                "values" => collect($value)->forget(["organisations","activities"]),
                "details" => [
                    "organisations" => $value["organisations"]
                ],
            ];
        });
        return $bridges->values();
    }

    public function locationOrganisations(Request $requests)
    {
        $bridges = \App\Bridge::all();
        $bridges = $bridges->groupBy('district')->transform(function($district, $key){
            $location = \App\Cascade::where('id', $key)->first();
            $domains = $district->unique('domain')->transform(function($data){
                return \App\Option::select('name')->where('id', $data->domain)->first()->text;
            });
            $sub_domains = $district->unique('sub_domain')->transform(function($data){
                return \App\Option::select('name')
                    ->where('id', $data->sub_domain)->first()->text;
            });
            $organisations = collect($district)->map(function($data){
                return [
                    'name' => \App\Cascade::select('name')->where('id', $data->org_name)->first()->text,
                    'activity' => \App\Option::select('name')->where('id', $data->activity)->first()->text,
                    'domain' => \App\Option::select('id')->where('id', $data->domain)->first()->id,
                    'partner_type' => \App\Cascade::select('name')->where('id', $data->org_type)->first()->text,
                    'partner' => 'Organisation',
                    'sub_domain' => \App\Option::select('id')->where('id', $data->sub_domain)->first()->id,
                    'value_quantity' => $data->quantity,
                    'value_total' => $data->total,
                    'value_new' => $data->new
                ];
            });
            return [
                'id' => $key,
                'name' => $location->text,
                'organisations' => [
                    'list' => $organisations,
                    'count' => count($organisations)
                ],
                'activities' => $organisations->unique('activity')->values()->pluck('activity'),
                'domains' => $domains->values(),
                'sub_domains' => $sub_domains->values(),
            ];
        })->values();
        return $bridges;
    }

    private function getValues($group, $key, $subject, $parentId=null)
    {
        $org_ids = $group->pluck('org_name')->unique();
        $org_values = $group->groupBy('org_name')->map(function($data, $key){
            $org = \App\Cascade::select('name', 'parent_id')->where('id', $key)->first();
            $act = \App\Option::select('name')->whereIn('id',$data->pluck('activity'))->get();
            return [
                'name' => $org->text,
                'type' => \App\Cascade::select('name')->where('id',$org->parent_id)->first()->text,
                'value_quantity' => $data->sum('quantity'),
                'value_total' => $data->sum('total'),
                'value_new' => $data->sum('new'),
                'activities' => $act->pluck('text'),
            ];
        })->values();
        $act_values = $group->groupBy('activity')->map(function($data, $key){
            return \App\Option::select('name')->where('id', $key)->first()->text;
        });
        $collection = [
            'id' => (int) $key,
            'name' => \App\Option::select('name')->where('id', $key)->first()->text,
            'subject' => $subject,
            'parent_id' => $parentId !== null ? (int) $parentId : null,
            'value_quantity' => collect($group)->sum('quantity'),
            'value_total' => collect($group)->max('total'),
            'value_new' => collect($group)->sum('new'),
            'organisations' => [
                'list' => $org_values->pluck('name'),
                'count' => count($org_values),
                'data' => $org_values
            ],
        ];
        return $collection;
    }

}