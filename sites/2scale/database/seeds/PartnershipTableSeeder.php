<?php

use Illuminate\Database\Seeder;
use App\Http\Controllers\Api\SyncController;
use App\Libraries\FlowApi;
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
        $partnership = new Partnership();
        $flow = new FlowApi();
        $sync->syncPartnerships($flow, $partnership);
    }
}
