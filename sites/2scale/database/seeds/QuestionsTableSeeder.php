<?php

use Illuminate\Database\Seeder;
use App\Http\Controllers\Api\SyncController;
use App\Libraries\Flow;
use App\Libraries\Keycloak;
use App\Question;
use App\Form;

class QuestionsTableSeeder extends Seeder
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
        $form = new Form();
        $questions = new Question();
        $flow = new Flow($keycloak);
        $sync->syncQuestions($flow, $form, $questions);
    }
}
