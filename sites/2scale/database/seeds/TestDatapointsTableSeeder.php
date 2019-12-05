<?php

use Illuminate\Database\Seeder;
use App\Http\Controllers\Api\SeedController;
use App\Partnership;
use App\Datapoint;
use App\Form;

class TestDatapointsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $seed = new SeedController();
        $forms = new Form();
        $partnerships = new Partnership();
        $datapoints = new Datapoint();
        $faker = Faker\Factory::create();
        $seed->seedDataPoint(1, 200, $forms, $partnerships, $faker, $datapoints);
        $seed->seedDataPoint(2, 200, $forms, $partnerships, $faker, $datapoints);
    }
}
