<?php

use Illuminate\Database\Seeder;
use App\Http\Controllers\Api\InitController;
use App\Libraries\Auth;
use App\Libraries\Flow;
use App\Survey;

class SurveyFormsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $init = new InitController();
        $surveys = new Survey();
        $auth = new Auth();
        $flow = new Flow($auth);
        $init->seedSurveyForms($flow, $surveys);
    }
}
