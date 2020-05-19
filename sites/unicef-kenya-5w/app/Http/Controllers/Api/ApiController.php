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
            $this->collection->push($this->getValues($this->bridges, $parent, 'domain', null, true));

            /* Populate Subdomain Values */
            $childs = collect($this->bridges)->where('domain', $parent['id'])->values();
            $groups = \App\Option::whereIn('id', $childs->pluck('sub_domain'))->get();
            collect($groups)->unique('id')->each(
                function($meta) use ($parent, $childs) {
                $this->collection->push($this->getValues($childs, $meta, 'sub_domain', $parent, true));
            });
        });
        return $this->collection;
    }

    public function locations(Request $request)
    {
        $question = \App\Question::where('id', config('query.cascade.locations'))
                             ->with('cascade.childrens')
                             ->first();
        return $question->cascade->childrens->transform(function($county){
            $county->code = $county->code;
            $county->name = Str::title($county->name);
            return $county->makeHidden(['level','parent_id']);
        });

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

    private function getValues($data, $meta, $subject, $parent=["id" => null], $details = false)
    {
        $name = $meta['name'];
        $name = $subject === 'sub_domain' ? Str::afterLast($name, $parent['name'].' - ') : $name;
        $name = Str::beforeLast(Str::title($name), ' (');
        $values = collect(['id' => $meta['id'], 'parent_id' => $parent['id'], 'subject' => $subject,'name' => $name]);
        $data = collect($data)->where($subject, $meta['id'])->values();
        $this->value_names->each(function($keyval) use ($data, $values) {
            $values[$keyval] = $data->sum($keyval);
        });

        if ($details) {
            $details = collect(config('query.cascade'))->keys();
            $cascade = config('query.cascade');

            $details->each(function($name) use ($data, $values, $cascade){
                $values[$name] = collect();
                $data->each(function($dt) use ($values, $cascade, $name){
                    $list = \App\Answer::where('form_instance_id', $dt["form_instance_id"])
                        ->where('question_id', $cascade[$name])
                        ->with('cascades')
                        ->get()->pluck('name');
                    $values[$name]->push($list);
                });
                $values[$name] = [
                    'count' => $values[$name]->flatten()->unique()->count(),
                    'list' => $values[$name]->flatten()->unique()->values(),
                ];
            });
        }
        return $values;
    }

    public function locationValues(Request $requests, Answer $answers)
    {
        $id = $requests->domain;
        $value = 'domain';
        if ($requests->subdomain) {
            $id = $requests->subdomain;
            $value = 'sub_domain';
        }
        $details = collect(config('query.cascade'))->keys();
        $cascade = config('query.cascade');
        $filter = $this->bridges->where($value, $id)->values();
        $filter = $filter->map(function($data) use ($answers, $cascade, $details){
            $details->each(function($name) use ($data, $answers, $cascade){
                $data[$name] = $answers
                    ->where('question_id', $cascade[$name])
                    ->where('form_instance_id', $data["form_instance_id"])
                    ->with('cascades')
                    ->first()->cascades->first()->text;
            });
            return $data;
        });
        collect($filter)
            ->unique('county')
            ->each(function($county) use ($requests, $filter, $details) {
                $county = \App\Cascade::where('id', $county["county"])->first();
                $county = collect($county);
                collect(config('query.wash_domain.domains'))
                    ->each(function($parent, $key) use ($county, $requests, $filter, $details) {
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
                            $county["details"] = collect();
                            $details->each(function($name) use ($data, $county){
                                $val = $data->groupBy($name)->keys();
                                $county["details"][$name] = ['count' => $val->count(), 'list' => $val];
                            });
                        }
                    });
                $this->collection->push($county);
            });
        return $this->collection;
    }

    public function domainValues(Request $requests)
    {
        $bridges = new \App\Bridge ();
        $domainConfig = collect(config('query.wash_domain.domains'));
        $domains = collect();
        $domainConfig->each(function ($item, $index) use ($domains, $bridges) {
            $domainData = $bridges->where('domain', $item['id'])->get();
            $subDomainIds = $domainData->pluck('sub_domain');
            $subDomains = \App\Option::whereIn('id', $subDomainIds)->get();
            $domainTotal = $this->setAnswerValue($domainData);

            $subDomains->map(function ($subDomain) use ($domainData, $domainTotal) {
                $subDomainData = $domainData->where('sub_domain', $subDomain->id)->values();
                $answers = $this->setAnswerValue($subDomainData);
                $subDomain['quantity'] = ['planned' => $answers['qp'], 'achived' => $answers['qa']];
                $subDomain['details'] = $this->getDetails($subDomainData);
                return $subDomain;
            });

            $domains->push([
                'id' => $item['id'], 
                'text' => Str::title($index), 
                'sub_domains' => $subDomains->makeHidden(['code', 'name', 'other', 'question_id']),
                'quantity' => [
                    'planned' => $domainTotal['qp'],
                    'achived' => $domainTotal['qa'],
                ],
                'details' => $this->getDetails($domainData),
            ]); 
        }); 

        return $domains;
    }

    private function getDetails($data)
    {
        $details = collect(config('query.cascade'))->keys();
        $cascade = config('query.cascade');
        $tempDetail = collect();
        $details->each(function($name) use ($data, $cascade, $tempDetail){
            $temp[$name] = collect();
            $data->each(function($dt) use ($temp, $cascade, $name){
                $list = \App\Answer::where('form_instance_id', $dt["form_instance_id"])
                    ->where('question_id', $cascade[$name])
                    ->with('cascades')
                    ->get()->pluck('name');
                $temp[$name]->push($list);
            });
            $tempDetail->put($name, [
                'count' => $temp[$name]->flatten()->unique()->count(),
                'list' => $temp[$name]->flatten()->unique()->values(),
            ]); 
        });

        return $tempDetail;
    }

    private function setAnswerValue($collection)
    {
        return [
            'qp' => $this->getAnswerValue($collection, 'value_planned'),
            'qa' => $this->getAnswerValue($collection, 'value_achived'),
            'bp' => $this->getAnswerValue($collection, 'beneficiaries_planned'),
            'ba' => $this->getAnswerValue($collection, 'beneficiaries_achived'),
            'girl' => $this->getAnswerValue($collection, 'girl_achived'),
            'boy' => $this->getAnswerValue($collection, 'boy_achived'),
            'woman' => $this->getAnswerValue($collection, 'woman_achived'),
            'man' => $this->getAnswerValue($collection, 'man_achived')
        ];
    }

    private function getAnswerValue($collection, $value) 
    {
        $ids = $collection->whereNotNull($value)->pluck($value);
        $data = \App\Answer::whereIn('id', $ids)->get();
        if ($ids->count() === 1) {
            $values = $data->first();
            return $values['value']; 
        }

        $value = $data->reduce(function ($total, $value) {
            return $total + $value['value'];
        });
        return $value;
    }
}
