<?php

namespace App\Seeds;

use Illuminate\Support\Str;
use Akvo\Models\Form;
use Akvo\Models\QuestionGroup;
use Akvo\Models\Question;
use Akvo\Models\Cascade;
use Akvo\Models\Variable;
use Akvo\Models\Option;
use Illuminate\Support\Facades\Log;

class FormSeeder
{
    public function __construct($api) {
        $this->api = $api;
    }

    public function seed($init = true, $formValues = [])
    {
        $forms = ($init) ? Form::doesntHave('questionGroups')->get('id') : $formValues;
        $method = env('AKVOFLOW_METHOD', 'update');
        foreach($forms as $form) {
            $id = $form['id'];
            $form = $this->api->fetch($this->api->formurl . $id . '/' . $method, 'web');
            dd($form);
            $this->seedQuestionGroups($form, $id);
        }
        return;
    }

    public function seedQuestionGroups($form, $formId)
    {
        Log::error('seedQuestionGroups', [$formId]);
        if (isset($form['questionGroup']['heading'])) {
            $repeat = isset($form['questionGroup']['repeatable'])
                ? $form['questionGroup']['repeatable']
                : false;
            $questions = isset($form['questionGroup']['question']['text'])
                ? [$form['questionGroup']['question']]
                : $form['questionGroup']['question'];
            $questionGroup = QuestionGroup::updateOrCreate([
                'form_id' => $formId,
                'name' => $form['questionGroup']['heading'],
                'repeat' => $repeat
            ]);
            $this->seedQuestions($questionGroup, $questions);
        } else {
            foreach($form['questionGroup'] as $questionGroup) {
                $questions = isset($questionGroup['question']['text'])
                    ? [$questionGroup['question']]
                    : $questionGroup['question'];
                $repeat = isset($questionGroup['repeatable'])
                    ? $questionGroup['repeatable']
                    : false;
                $questionGroup = QuestionGroup::updateOrCreate([
                    'form_id' => $formId,
                    'name' => $questionGroup['heading'],
                    'repeat' => $repeat
                ]);
                $this->seedQuestions($questionGroup, $questions);
            }
        }
        return;

    }

    private function seedQuestions($questionGroup, $questions)
    {
        Log::error('seedQuestions', [$questionGroup]);
        foreach($questions as $question) {
        Log::error('seedQuestion', [$question]);
            $type = $question['type'];
            if (isset($question['validationRule'])) {
                $type = $question['validationRule']['validationType'] === 'numeric' ? 'numeric' : false;
            }
            $casacde = false;
            $cascadeId = null;
            if ($type === 'cascade') {
                $cascade = Cascade::where('name', $question['cascadeResource'])->first();
                if ($cascade) {
                    $cascadeId = $cascade->id;
                }
                if (!$cascade) {
                    $cascade = Cascade::updateOrCreate([
                        'parent_id' => null,
                        'code' => null,
                        'name' => $question['cascadeResource'],
                        'level' => 0,
                    ]);
                    $cascadeId = $cascade->id;
                    $endpoint = $this->api->cascade . $question['cascadeResource'];
                    $levelnames = isset($question['levels']['level']['text'])
                        ? [$question['levels']['level']]
                        : $question['levels']['level'];
                    $this->seedCascades($endpoint, $cascadeId, 0, $levelnames, 1);
                }
            }
            $options = false;
            $allowOtherOption = false;
            if ($type === 'option') {
                $options = $question['options']['option'];
                $allowOtherOption = $question['options']['allowOther'];
            }
            $variableId = null;
            if (isset($question['variableName'])) {
                $variable = Variable::updateOrCreate(['name' => $question['variableName']]);
                $variableId = $variable->id;
            }
            $dependency = isset($question['dependency']) ? (int) $question['dependency']['question'] : null;
            $dependency_answer = isset($question['dependency']) ? (string) $question['dependency']['answer-value'] : null;
            $question = Question::updateOrCreate(
                ['id' => (int) $question['id']],
                [
                    'form_id' => $questionGroup->form_id,
                    'question_group_id' => $questionGroup->id,
                    'name' => $question['text'],
                    'dependency' => $dependency,
                    'dependency_answer' => $dependency_answer,
                    'type' => $type,
                    'cascade_id' => $cascadeId,
                    'variable_id' => $variableId
                ]);
            if ($options) {
                if (isset($options['text'])) {
                    Option::updateOrCreate([
                        'question_id' => $question->id,
                        'name' => $options['value'],
                        'code' => isset($options['code']) ? $options['code'] : null,
                        'other' => false
                    ]);
                } else {
                    foreach($options as $option) {
                        Option::updateOrCreate([
                            'question_id' => $question->id,
                            'name' => $option['value'],
                            'code' => isset($option['code']) ? $option['code'] : null,
                            'other' => false
                        ]);
                    }
                }
                if ($allowOtherOption) {
                    Option::updateOrCreate([
                        'question_id' => $question->id,
                        'name' => 'Other',
                        'code' => null,
                        'other' => true
                    ]);
                }
            }
        }
        return true;
    }

    private function seedCascades($endpoint, $parentId, $pathId, $levelnames, $level = 0)
    {
        $cascades = $this->api->fetch($endpoint. '/' . $pathId, 'web');
        if (count($cascades) !== 0) {
            foreach($cascades as $cascade) {
                $code = Str::of($cascade['code'])->ltrim();
                $name = Str::of($cascade['name'])->ltrim();
                $pathId = $cascade['id'];
                $cascadeId = Cascade::updateOrCreate([
                    'parent_id' => $parentId,
                    'code' => Str::lower($code),
                    'name' => Str::lower($name),
                    'level' => $level,
                    'level_name' => $levelnames[$level - 1]['text']
                ])->id;
                $nextLevel = $level + 1;
                $this->seedCascades($endpoint, $cascadeId, $pathId, $levelnames, $nextLevel);
            }
        }
        return true;
    }


}

