<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Option;
use App\Question;
use Illuminate\Database\Eloquent\Builder;

class TestController extends Controller
{
    public function getTest()
    {
        $questions = new \App\Question ();
        $groups = $questions->whereIn('question_group_id', config('query.groups'))->pluck('id');
        $groups->push(config('query.cascade.locations')); // location questions

        $formInstances = new \App\FormInstance ();
        $results = $formInstances->with(['answers' => function ($query) use ($groups) {
           $query->whereIn('question_id', $groups); 
           $query->with(['question', 'options', 'cascades']);
        }],)->get();

        return $results;

        /*
        $domains = config('query.wash_domain.domains');
        $results->each(function ($item) use ($domains) {
            $postData = collect();
            $item->answers->each(function ($answer) use ($domains, $postData) {
                $qlocId = config('query.cascade.locations');
                $washId = config('query.wash_domain.id');
                $whom = config('query.for_whom');

                if ($answer->question->id === $qlocId) {
                    $cascades = $answer->cascades->first();
                    $postData['county'] = $cascades->parent_id;
                    $postData['sub_county'] = $cascades->id;
                }

                $domainName = Str::beforeLast($answer->name, ' - ');
                if ($answer->question->id === $washId) {
                    $options = $answer->options->first();
                    $postData['domain'] = $domains[$domainName]['id'];
                    $postData['sub_domain'] = $options->id; 
                }

                if ($answer->question->id === $washId && ($domainName === 'sanitation' || $domainName === 'health' || $domainName === 'other')) {
                    $postData['other_status'] = true;
                } 

                if ($answer->question->dependency === $washId && isset($postData['other_status']) == true) {
                    $postData['other'] = $answer->id;
                }

                if ($answer->question->dependency === $washId && Str::contains($answer->question->name, '- Quantity Planned')) {
                    $postData['value_planned'] = $answer->id;
                }

                if ($answer->question->dependency === $washId && Str::contains($answer->question->name, '- Quantity Archived')) {
                    $postData['value_achived'] = $answer->id;
                }

                if ($answer->question->id === $whom['total']['planned']) {
                    $postData['beneficiaries_planned'] = $answer->id; 
                }

                if ($answer->question->id === $whom['total']['achived']) {
                    $postData['beneficiaries_achived'] = $answer->id; 
                }

                if ($answer->question->id === $whom['girl']) {
                    $postData['girl_achived'] = $answer->id; 

                }

                if ($answer->question->id === $whom['boy']) {
                    $postData['boy_achived'] = $answer->id; 
                }

                if ($answer->question->id === $whom['woman']) {
                    $postData['woman_achived'] = $answer->id; 
                }

                if ($answer->question->id === $whom['man']) {
                    $postData['man_achived'] = $answer->id; 
                }
            });

            $valuePlanned = isset($postData['value_planned']) ? $postData['value_planned'] : NULL;
            $valueAchived = isset($postData['value_achived']) ? $postData['value_achived'] : NULL;
            $other = isset($postData['other']) ? $postData['other'] : NULL;

            $postBridges = new \App\Bridge ([
                'form_instance_id' => $item->id,
                'county' => $postData['county'],
                'sub_county' => $postData['sub_county'], 
                'domain' => $postData['domain'],
                'sub_domain' => $postData['sub_domain'], 
                'value_planned' => $valuePlanned,
                'value_achived' => $valueAchived,
                'other' => $other,
                'beneficiaries_planned' => $postData['beneficiaries_planned'],
                'beneficiaries_achived' => $postData['beneficiaries_achived'],
                'girl_achived' => $postData['girl_achived'],
                'boy_achived' => $postData['boy_achived'],
                'woman_achived' => $postData['woman_achived'],
                'man_achived' => $postData['man_achived'],
            ]);
            $postBridges->save();
        });

        return $results;
         */
    }

    public function getDomains(Request $requests)
    {
        $bridges = new \App\Bridge ();
        $domainConfig = collect(config('query.wash_domain.domains'));
        $domains = collect();
        $domainConfig->each(function ($item, $index) use ($domains, $bridges) {
            $domainData = $bridges->where('domain', $item['id'])->get();
            $subDomainIds = $domainData->pluck('sub_domain');
            $subDomains = \App\Option::whereIn('id', $subDomainIds)->get();

            $subDomains->map(function ($subDomain) use ($domainData) {
                $subDomainData = $domainData->where('sub_domain', $subDomain->id)->values();
                $countyIds = $subDomainData->pluck('county');
                $counties = \App\Cascade::whereIn('id', $countyIds)->get();
                $subDomain['county_values'] = $counties;

                $counties->map(function ($county) use ($subDomainData) {
                    $countyData = $subDomainData->where('county', $county->id)->values();
                    $subCountyIds = $countyData->pluck('sub_county');
                    $subCounties = \App\Cascade::whereIn('id', $subCountyIds)->get();
                    $county['sub_county_values'] = $subCounties;

                    return $county; 
                });

                return $subDomain;
            });

            $domains->push([
                'id' => $item['id'], 
                'name' => $index, 
                'sub_domains' => $subDomains
            ]); 
        }); 

        return $domains;
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

    public function getDomain(Request $requests)
    {
        $bridges = new \App\Bridge ();
        $subDomainData = $bridges->where('domain', $requests->domain_id)->get();
        $subDomainIds = $subDomainData->pluck('sub_domain');

        $results = collect();
        $subDomains = \App\Option::whereIn('id', $subDomainIds)->get();
        $subDomains->map(function ($subDomain) use ($results, $subDomainData) {
            $countyIds = $subDomainData->where('sub_domain', $subDomain->id)->pluck('county');
            $counties = \App\Cascade::whereIn('id', $countyIds)->get();
            $subDomain['county_values'] = $counties;

            $answers = $this->setAnswerValue($subDomainData);

            $subDomain['quantity'] = ['planned' => $answers['qp'], 'achived' => $answers['qa']];
            $subDomain['beneficiaries'] = [
                'planned' => $answers['bp'], 
                'achived' => $answers['ba'], 
                'girl' => $answers['girl'], 
                'boy' => $answers['boy'],
                'woman' => $answers['woman'],
                'man' => $answers['man']
            ];

            $counties->map(function ($county) use ($subDomainData) {
                $countyData = $subDomainData->where('county', $county->id)->values();
                $subCountyIds = $countyData->pluck('sub_county');
                $subCounties = \App\Cascade::whereIn('id', $subCountyIds)->get();
                $answers = $this->setAnswerValue($countyData);

                $county['quantity'] = ['planned' => $answers['qp'], 'achived' => $answers['qa']];
                $county['beneficiaries'] = [
                    'planned' => $answers['bp'], 
                    'achived' => $answers['ba'], 
                    'girl' => $answers['girl'], 
                    'boy' => $answers['boy'],
                    'woman' => $answers['woman'],
                    'man' => $answers['man']
                ];
                $county['sub_county_values'] = $subCounties;

                $subCounties->map(function ($subCounty) use ($countyData) {
                    $subCountyData = $countyData->where('sub_county', $subCounty->id)->values();
                    $answers = $this->setAnswerValue($subCountyData);

                    $subCounty['quantity'] = ['planned' => $answers['qp'], 'achived' => $answers['qa']];
                    $subCounty['beneficiaries'] = [
                        'planned' => $answers['bp'], 
                        'achived' => $answers['ba'], 
                        'girl' => $answers['girl'], 
                        'boy' => $answers['boy'],
                        'woman' => $answers['woman'],
                        'man' => $answers['man']
                    ];

                    return $subCounty;
                });

                return $county; 
            });
            return $subDomain;
        });
        $results->push($subDomains);

        return $subDomains;
    }

    public function getLocation(Request $requests)
    {
        $bridges = new \App\Bridge ();
        $column = 'county';
        $locationId = $requests->county;
        if (isset($requests->sub_county)) {
            $column = 'sub_county';
            $locationId = $requests->sub_county;
        }

        $locationData = $bridges->where($column, $locationId)->get();
        $locationIds = $locationData->pluck($column);
        $locations = \App\Cascade::whereIn('id', $locationIds)->get();

        $domainConfig = config('query.wash_domain.domains');
        $domainData = collect();
        $test = collect($domainConfig)->each(function ($item, $index) use ($domainData) {
            $domainData->push([
                'id' => $item['id'], 
                'name' => $index,
                'text' => Str::title($index)
            ]);
        });

        $results = $locations->map(function ($location) use ($locationData, $column, $domainData) {
            $domainBridge = $locationData->where($column, $location->id)->values();
            $domainIds = $domainBridge->pluck('domain')->unique();
            $domains = $domainData->whereIn('id', $domainIds)->values();

            $domainWithSub = $domains->map(function ($domain) use ($domainBridge) {
                $subDomainData = $domainBridge->where('domain', $domain['id'])->values();
                $subDomainIds = $subDomainData->pluck('sub_domain'); 
                $subDomains = \App\Option::whereIn('id', $subDomainIds)->get();

                $subDomainWithTotal = $subDomains->map(function ($subDomain) use ($subDomainData) {
                    $answers = $this->setAnswerValue($subDomainData->where('sub_domain', $subDomain->id)->values());

                    $subDomain['quantity'] = ['planned' => $answers['qp'], 'achived' => $answers['qa']];
                    $subDomain['beneficiaries'] = [
                        'planned' => $answers['bp'], 
                        'achived' => $answers['ba'], 
                        'girl' => $answers['girl'], 
                        'boy' => $answers['boy'],
                        'woman' => $answers['woman'],
                        'man' => $answers['man']
                    ];
                    return $subDomain;
                });

                $answers = $this->setAnswerValue($domainBridge->where('domain', $domain['id'])->values());

                $domain['quantity'] = ['planned' => $answers['qp'], 'achived' => $answers['qa']];
                $domain['beneficiaries'] = [
                    'planned' => $answers['bp'], 
                    'achived' => $answers['ba'], 
                    'girl' => $answers['girl'], 
                    'boy' => $answers['boy'],
                    'woman' => $answers['woman'],
                    'man' => $answers['man']
                ];

                $domain['sub_domains'] = $subDomainWithTotal;
                return $domain;
            });

            $answers = $this->setAnswerValue($domainBridge);

            $location['quantity'] = ['planned' => $answers['qp'], 'achived' => $answers['qa']];
            $location['beneficiaries'] = [
                'planned' => $answers['bp'], 
                'achived' => $answers['ba'], 
                'girl' => $answers['girl'], 
                'boy' => $answers['boy'],
                'woman' => $answers['woman'],
                'man' => $answers['man']
            ];

            $location['domains'] = $domainWithSub;
            return $location;
        });

        return $results;
    }
}
