<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class SeedCountryValues extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:values {number=10}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seeding Values to Coutries';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $numbers = $this->argument('number');
        $url = 'http://geodata.grid.unep.ch/api/countries/#cid/'.'variables/#vid/'.'years/2012';
        $countries = \App\Country::select('id','code')->get()->random($numbers);
        $countries = collect($countries)->map(function($data) use ($url, $numbers) {
            $variables = \App\Value::select('id','code')
                                ->doesnthave('childrens')
                                ->get()->random($numbers);
            sleep(1);
            $urls = $variables->map(function($var) use ($data, $url){
                $faker = Faker::create();
                $client = New \GuzzleHttp\Client();
                $url = str_replace('#cid',$data->code, $url);
                $url = str_replace('#vid',$var->code, $url);
                echo 'FETCH:'.$url."\n";
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
