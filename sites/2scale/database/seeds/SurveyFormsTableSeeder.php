<?php

use Illuminate\Database\Seeder;
use App\Http\Controllers\Api\SyncController;
use App\SurveyGroup;


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
        $sync->syncSurveyForms($surveyGroups);
    }
}
