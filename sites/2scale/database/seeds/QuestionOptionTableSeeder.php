<?php

use Illuminate\Database\Seeder;
use App\Http\Controllers\Api\SyncController;
use App\Libraries\Flow;
use App\Libraries\Keycloak;
use App\Form;
use App\Question;
use App\Option;

class QuestionOptionTableSeeder extends Seeder
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
        $forms = new Form();
        $questions = new Question();
        $flow = new Flow($keycloak);
        $options = new Option();
        $flow = new Flow($keycloak);
        $sync->syncQuestionOptions($flow, $options, $forms, $questions);
    }
}
