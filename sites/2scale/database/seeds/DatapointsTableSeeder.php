<?php

use Illuminate\Database\Seeder;
use App\Http\Controllers\Api\SyncController;
use App\Libraries\Flow;
use App\Libraries\Keycloak;
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
        $keycloak = new Keycloak();
        $flow = new Flow($keycloak);

        $forms = new Form();
        $partnerships = new Partnership();
        $datapoints = new Datapoint();
        $sync->syncDataPoints($flow,$forms,$partnerships,$datapoints);
    }
}
