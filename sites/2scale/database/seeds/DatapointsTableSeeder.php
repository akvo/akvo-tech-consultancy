<?php

use Illuminate\Database\Seeder;
use App\Http\Controllers\Api\SyncController;
use App\Libraries\FlowAuth0;
use App\Libraries\AkvoAuth0;
use App\Form;
use App\Datapoint;
use App\Partnership;

class DatapointsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sync = new SyncController();
        $auth0 = new AkvoAuth0();
        $flow = new FlowAuth0($auth0);

        $forms = new Form();
        $partnerships = new Partnership();
        $datapoints = new Datapoint();
        $sync->syncDataPoints($flow,$forms,$partnerships,$datapoints);
    }
}
