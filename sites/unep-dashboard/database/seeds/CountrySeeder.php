<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $group = new \App\Group();
        $country = new \App\Country();
        $parent = array('name' => 'Region', 'code' => 'REG');
        $parent = $group->insertGetId($parent);
        $client = New \GuzzleHttp\Client();
        $response = $client->request('GET', 'http://geodata.grid.unep.ch/api/countries');
        $response = json_decode($response->getBody(), true);
        $response = collect($response)->reject(function($data){
            return $data['iso_2'] === null || $data['region'] === null || $data['name'] === null;
        });
        $region = $response->groupBy('region')->map(function($data, $key) {
            return Str::replaceLast(' + ', ' & ', $key);
        })->map(function($data) {
	        $data = Str::replaceLast(' & ', ' ', $data);
	        $code = explode(' ',$data);
            if (count($code) < 2){
                $code = $code[0][0].$code[0][1];
            } else {
                $code = $code[0][0].$code[1][0];
            }
            $data = array(
                'name' => $data,
                'code' => 'REG_'.strtoupper($code),
            );
            $data = new App\Group($data);
            return $data;
        });
        $parent = $group->find($parent)->first();
        $regions = $parent->childrens()->saveMany($region);
        $subregions = $response->groupBy('subregion')->map(function($data, $key) use ($regions) {
            $data = Str::replaceLast(' + ', ' ', $data[0]['region']);
            foreach($regions as $region){
                if($data === $region->name){
	                $code = explode(' ',$key);
                    $code = $code[0][0].$code[0][1];
                    $data = new App\Group(array(
                        'name' => $key,
                        'code' => 'SUBREG_'.strtoupper($code),
                    ));
                    $data = $region->childrens()->save($data);
                }
            }
            return $data;
        });
        $countries = $response->map(function($data) use ($country) {
            $id = $country->insertGetId(
                array(
                    'name'=> $data['name'],
                    'code'=> $data['iso_2']
                )
            );
            return [
                'id' => $id,
                'region' => Str::replaceLast(' + ', ' ', $data['region']),
                'subregion' => Str::replaceLast(' + ', ' ', $data['subregion']),
            ];
        })->values();
        $countries = $countries->map(function($data) use ($subregions, $regions) {
            foreach($regions as $region){
                if($region->name === $data['region']){
                    \App\CountryGroup::create(
                        array('group_id' => $region->id, 'country_id' => $data['id'])
                    );
                }
            }
            foreach($subregions as $subregion){
                if($subregion->name === $data['subregion']) {
                    \App\CountryGroup::create(
                        array('group_id' => $subregion->id, 'country_id' => $data['id'])
                    );
                }
            }
            return $data;
        });
        return $countries;
    }
}
