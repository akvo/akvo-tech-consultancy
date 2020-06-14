<?php

use Illuminate\Database\Seeder;
use App\Http\Controllers\Api\SyncController;
use App\Libraries\FlowApi;
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
        $form = new Form();
        $questions = new Question();
        $flow = new FlowApi();
        $sync->syncQuestions($flow, $form, $questions);
    }
}
