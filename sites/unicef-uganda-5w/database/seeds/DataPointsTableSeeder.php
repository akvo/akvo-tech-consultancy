<?php

use Illuminate\Database\Seeder;
use App\Http\Controllers\Api\InitController;
use App\Libraries\Auth;
use App\Libraries\Flow;
use App\DataPoint;

class DataPointsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $init = new InitController();
        $dataPoints = new DataPoint();
        $auth = new Auth();
        $flow = new Flow($auth);
        $init->seedDataPoints($flow, $dataPoints);
    }
}
