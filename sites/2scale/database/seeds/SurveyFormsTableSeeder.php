<?php

use Illuminate\Database\Seeder;
use App\Http\Controllers\Api\SyncController;
use App\SurveyGroup;
use App\Libraries\FlowAuth0;
use App\Libraries\AkvoAuth0;

class SurveyFormsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sync = new SyncController();
        $surveyGroups = new SurveyGroup();

        $auth0 = new AkvoAuth0();
        $flow = new FlowAuth0($auth0);

        $sync->syncSurveyForms($surveyGroups, $flow);
    }
}
