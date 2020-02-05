<?php

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Log;

class CountryValueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $url = 'http://geodata.grid.unep.ch/api/countries/#cid/'.'variables/#vid/'.'years/2012';
        $countries = $countries->select('id','code')->get()->random(10);
        $countries = collect($countries)->map(function($data) use ($url, $values) {
            $variables = $values->select('id','code')
                                ->doesnthave('childrens')
                                ->get()->random(20);
            sleep(1);
            $urls = $variables->map(function($var) use ($data, $url){
                $faker = Faker::create();
                $client = New \GuzzleHttp\Client();
                $url = str_replace('#cid',$data->code, $url);
                $url = str_replace('#vid',$var->code, $url);
                Log::info('FETCH: '.$url);
                $response = $client->request('GET', $url)->getBody();
                $response = json_decode($response);
                $response_value = null;
                $results = null;
                if ($response !== "null"){
                    $response_value = $response[0]->value; 
                    $results = array( 
                        'country_id' => $data->id,
                        'value_id' => $var->id,
                        'value' => $response_value,
                        'description' => $faker->sentence() 
                    );
                }
                return $results;
            });
            return $urls;
        });
        $input = $countries->flatten(1)->filter()->values()->toArray();
        \App\CountryValue::insert($input);
    }
}
