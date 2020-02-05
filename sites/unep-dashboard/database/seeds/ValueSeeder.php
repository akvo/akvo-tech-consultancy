<?php

use Illuminate\Database\Seeder;

class ValueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $client = new \GuzzleHttp\Client();
        $response = $client->request('GET','http://geodata.grid.unep.ch/api/variables/national')->getBody();
        $response = json_decode($response);
        $variables = collect($response)->reject(function($q) {
            return $q->geo_theme === null || $q->geo_subtheme === null; 
        })->groupBy('geo_theme')->map(function($data, $key){
            $data = $data->map(function($content){ 
                $content->definition = preg_replace('/[[:^print:]]/', '', $content->definition);
                $content->definition = str_replace("\r\n",'', $content->definition);
                return $content;
            });
            $description = $data->groupBy('geo_subtheme')->keys()->values()->toArray();
            $description = implode(", " ,$description);
            $value = new App\Value();
            $input = array( 
                "name" => $key,
                "code" => null,
                "units" => null,
                "color" => null,
                "description" => $description,
            ); 
            $parent_id = $value->insertGetId($input);
            $childrens = $data->groupBy('geo_subtheme')->map(function($data, $key) use ($parent_id){
                $description = $data->groupBy('name')->keys()->values()->toArray();
                $description = implode(", " ,$description);
                $value = new App\Value();
                $input = array( 
                    "name" => $key,
                    "code" => null,
                    "units" => null,
                    "color" => null,
                    "parent_id" => $parent_id,
                    "description" => $description,
                ); 
                $parent_id = $value->insertGetId($input);
                $childrens = $data->map(function($data) use ($parent_id){
                    $description = null;
                    $faker = Faker\Factory::create();
                    if (property_exists($data,'definition')){
                        $description = $data->definition;
                    };
                    $value = new App\Value();
                    $input = array( 
                        "name" => $data->name,
                        "code" => $data->id,
                        "units" => $data->units,
                        "parent_id" => $parent_id,
                        "color" => $faker->hexcolor(),
                        "description" => $description,
                    ); 
                    $id = $value->insertGetId($input);
                    return $id; 
                });
                return $parent_id;
            })->values()->toArray();
           return $parent_id;
        })->values();
    }
}
