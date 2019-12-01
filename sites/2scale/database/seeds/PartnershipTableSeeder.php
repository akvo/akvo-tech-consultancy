<?php

use Illuminate\Database\Seeder;
use App\Http\Controllers\Api\SyncController;
use App\Libraries\Flow;
use App\Libraries\Keycloak;
use App\Partnership;

class PartnershipTableSeeder extends Seeder
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
        $partnership = new Partnership();
        $flow = new Flow($keycloak);
        $sync->syncPartnerships($flow, $partnership);
    }
}
