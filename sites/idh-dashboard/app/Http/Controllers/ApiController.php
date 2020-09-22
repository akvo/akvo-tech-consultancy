<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Akvo\Models\Datapoint;
use Akvo\Models\AnswerOption;
use App\Models\Answer;
use App\Models\Survey;
use App\Models\Question;

class ApiController extends Controller
{

    public function filters(Survey $surveys)
    {
        $data = $surveys->with(['fsize','childrens.childrens'])->get();
        $data = $data->groupBy('country');
        $data = collect($data)->map(function($data, $key){
            $childrens = $data->makeHidden('country');
            $data = collect($data)->map(function($survey){
                $groups = collect($survey->childrens)->map(function($group){
                    $vars = collect($group->childrens)->map(function($var){
                        return [
                            'id' => $var->id,
                            'lv'  => 4,
                            'sel'  => 'var',
                            'name' => $var->variable_name,
                            'type' => $var->type,
                            'var_id' => $var->variable_id,
                            'details' => $var->name
                        ];
                    });
                    return [
                        'name' => $group->name,
                        'lv'  => 3,
                        'sel'  => 'groups',
                        'childrens' => $vars,
                    ];
                });
                return [
                    'name' => $survey->name,
                    'lv'  => 2,
                    'sel'  => 'survey',
                    'childrens'=> $groups,
                    'fsize' => $survey->fsize->first()->id,
                ];
            });
            return [
                'name' => $key,
                'sel'  => 'country',
                'lv'  => 1,
                'childrens' => $data
            ];
        })->values();
        return $data;
    }

    public function data(Request $request, Question $questions)
    {
        $question = $questions->find($request->id);
        if ($question->type === "option") {
            $options = $question->options->pluck('id');
            $options = AnswerOption::whereIn('option_id', $options)->get();
            $options = collect($options)->groupBy('option_id')->map(function($opt, $key){
                return [
                    'name' => \Akvo\Models\Option::find($key)->name,
                    'value' => $opt->count()
                ];
            })->values();
            return $options;
        }
        if ($question->type === "numeric") {
            $questions = $question->load('questionGroup.form.survey');
            $survey = Survey::where('id', $question->questionGroup->form->survey->id)->with('fsize')->first();
            $fsize = $survey->fsize->first()->id;
            $values = Answer::where('question_id', $request->id)->get();
            $values = collect($values)->map(function($data) use ($fsize) {
                $fsize = Answer::where('question_id', $fsize)->where('form_instance_id', $data->form_instance_id)->first();
                return [ $fsize->value, $data->value ];
            });
            return $values;
        }
        return $answers;
    }

}
