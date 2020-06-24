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
                $collection = $this->getValues($subgroup, $subkey, 'sub_domain', ['id' => $key]);
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
        $bridges = collect($bridges)->map(function($data, $key) use ($requests) {
            $location = \App\Cascade::where('id', $key)->first();
            $value = $this->getValues($data, $requests->subdomain, 'sub_domain', ['id' => $requests->domain]);
            return [
                "id" => (int) $key,
                "parent_id" => (int) $location->parent_id,
                "code" => $location->code,
                "name" => $location->text,
                "level"=> $location->level,
                "text" => $location->text,
                "values" => collect($value)->forget("organisations"),
                "details" => [
                    "organisations" => $value["organisations"]
                ]
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
                return \App\Option::select('name')
                    ->where('id', $data->domain)->first()->text;
            });
            $sub_domains = $district->unique('sub_domain')->transform(function($data){
                return \App\Option::select('name')
                    ->where('id', $data->sub_domain)->first()->text;
            });
            $organisations = $district->transform(function($data){
                return [
                    'name' => \App\Cascade::select('name')->where('id', $data->org_name)->first()->text,
                    'domain' => \App\Option::select('id')->where('id', $data->domain)->first()->id,
                    /*'partner' => \App\Cascade::select('name')->where('id', $data->org_type)->first()->text,*/
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
                'domains' => $domains->values(),
                'sub_domains' => $sub_domains->values(),
            ];
        })->values();
        return $bridges;
    }

    public function domainValues(Request $requests)
    {
        $bridges = new \App\Bridge ();
        return $domains;
    }

    private function getValues($group, $key, $subject, $parent=["id" => null])
    {
        $org_ids = $group->pluck('org_name')->unique();
        $organisations = \App\Cascade::select('name')->whereIn('id', $org_ids)->get();
        $organisations = $organisations->transform(function($orgs){
            return $orgs['text'];
        });
        $collection = [
            'id' => (int) $key,
            'name' => \App\Option::select('name')->where('id', $key)->first()->text,
            'subject' => $subject,
            'parent_id' => $parent['id'] !== null ? (int) $parent['id'] : null,
            'value_quantity' => collect($group)->sum('quantity'),
            'value_total' => collect($group)->max('total'),
            'value_new' => collect($group)->sum('new'),
            'organisations' => [
                'list' => $organisations,
                'count' => count($organisations)
            ]
        ];
        return $collection;
    }

}
