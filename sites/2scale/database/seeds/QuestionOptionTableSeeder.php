<?php

use Illuminate\Database\Seeder;
use App\Http\Controllers\Api\SyncController;
use App\Libraries\FlowApi;
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
        $forms = new Form();
        $questions = new Question();
        $options = new Option();
        $flow = new FlowApi();
        $sync->syncQuestionOptions($flow, $options, $forms, $questions);
    }
}
