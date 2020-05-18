<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use App\Bridge;
use App\Option;

class ApiController extends Controller
{

    public function __construct(Bridge $bridges)
    {
        $this->value_names = collect($bridges->first())->filter(function($value, $key){
            return Str::contains($key, ['planned', 'achived']);
        })->keys();
        $this->bridges = $bridges->get()->transform(function($item) {
            $this->value_names->each(function($keyval) use ($item) {
                $value = \App\Answer::where('id', $item->$keyval)->first();
                $item->$keyval = isset($value->value) ? $value->value : null;
            });
            return $item;
        });
        $this->collection = collect();
    }

    public function filters(Request $requests)
    {
        /* Populate Domain Values */
        collect(config('query.wash_domain.domains'))
            ->each(function($parent, $key) {
            $parent = ["id" => $parent["id"], "name" => $key];
            $this->collection->push($this->getValues($this->bridges, $parent, 'domain'));

            /* Populate Subdomain Values */
            $childs = collect($this->bridges)->where('domain', $parent['id'])->values();
            $groups = \App\Option::whereIn('id', $childs->pluck('sub_domain'))->get();
            collect($groups)->unique('id')->each(
                function($meta) use ($parent, $childs) {
                $this->collection->push($this->getValues($childs, $meta, 'sub_domain', $parent));
            });
        });
        return $this->collection;
    }

    public function locations(Request $request)
    {
        collect($this->bridges)
            ->unique('county')
            ->each(function($county) {
                $county = \App\Cascade::where('id', $county["county"])->first();
                    $county = collect($county);
                    $county["values"] = collect();
                    collect(config('query.wash_domain.domains'))
                        ->each(function($parent, $key) use ($county) {
                        $parent = ["id" => $parent["id"], "name" => $key];
                        $data = collect($this->bridges)->where('county', $county['id']);
                        if ($data) {
                            $county["values"]->push(collect($this->getValues($data, $parent, 'domain')));
                            /* Populate Subdomain Values */
                            $childs = collect($this->bridges)
                                ->where('county', $county['id'])->where('domain', $parent['id'])->values();
                            if ($childs) {
                            $groups = \App\Option::whereIn('id', $childs->pluck('sub_domain'))->get();
                            collect($groups)->unique('id')->each(
                                function($meta) use ($parent, $childs, $county) {
                                    $county["values"]
                                        ->push($this->getValues($childs, $meta, 'sub_domain', $parent));
                                });
                            }
                        }
                    });
                    $this->collection->push($county);
            });
        return $this->collection;
    }

    private function getValues($data, $meta, $subject, $parent=["id" => null])
    {
        $name = $meta['name'];
        $name = $subject === 'sub_domain' ? Str::afterLast($name, $parent['name'].' - ') : $name;
        $name = Str::beforeLast(Str::title($name), ' (');
        $values = collect(['id' => $meta['id'], 'parent_id' => $parent['id'], 'subject' => $subject,'name' => $name]);
        $data = collect($data)->where($subject, $meta['id'])->values();
        $this->value_names->each(function($keyval) use ($data, $values) {
            $values[$keyval] = $data->sum($keyval);
        });
        return $values;
    }

    public function locationValues(Request $requests)
    {
        $id = $requests->domain;
        $value = 'domain';
        if ($requests->subdomain) {
            $id = $requests->subdomain;
            $value = 'sub_domain';
        }
        $filter = $this->bridges->where($value, $id)->values();

        collect($filter)
            ->unique('county')
            ->each(function($county) use ($requests, $filter) {
                $county = \App\Cascade::where('id', $county["county"])->first();
                    $county = collect($county);
                    collect(config('query.wash_domain.domains'))
                        ->each(function($parent, $key) use ($county, $requests, $filter) {
                            if ($parent["id"] === (int) $requests->domain) {
                                $parent = ["id" => $parent["id"], "name" => $key];
                                $data = collect($filter)->where('county', $county['id']);
                                if ($data && !isset($requests->subdomain)) {
                                    $county["values"] = collect($this->getValues($data, $parent, 'domain'));
                                }
                                if ($data && isset($requests->subdomain)) {
                                    $groups = \App\Option::whereIn('id', $data->pluck('sub_domain'))->get();
                                    collect($groups)->unique('id')->each(
                                        function($meta) use ($parent, $data, $county) {
                                            $county["values"] = $this->getValues($data, $meta, 'sub_domain', $parent);
                                        });
                                }
                            }
                        });
                    $this->collection->push($county);
            });
        return $this->collection;
    }
}
