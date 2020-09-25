<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use League\Csv\Reader;
use League\Csv\Writer;

class DataSourceController extends Controller
{
    public function __construct()
    {
        $this->source = collect(config('data.sources'));
    }
    public function index(Request $request)
    {
        $data = $this->source->map(function($source){
            $form = \App\Models\Form::find($source['form_id']);
            return [
                'url' => '/data-source/'.$source['form_id'],
                'file' => Str::afterLast($source['file'], '/'),
                'form_id' => $source['form_id'],
                'form_name' => $form->name,
                'country' => $form->survey->country,
            ];
        });
        return view('sources.list', ['data' => $data]);
    }

    public function view(Request $request)
    {
        $data = $this->source->where('form_id', $request->id)->first();
        $csv = Reader::createFromPath(base_path().$data['file'], 'r');
        $csv->setHeaderOffset(0);
        $headers = $csv->getHeader();
        $records = iterator_to_array($csv, true);
        $samplerec = collect($records)->first();
        $headers = collect($headers)->reject(function ($value) use ($data){
            return $value === 'identifier' || $value === $data['cascade']['name'];
        })->values();
        $headers = $headers->map(function($header) use ($samplerec) {
            return [
                'name' => $header,
                'type' => is_numeric($samplerec[$header]) ? 'numeric' : 'option',
            ];
        })->toArray();
        $variables = collect();
        foreach($headers as $header) {
            $variable = \App\Models\Variable::updateOrCreate($header);
            $variables[$header['name']] = $variable->id;
        }
        foreach($records as $record){
            $form_instance = \Akvo\Models\FormInstance::updateOrCreate([
                'form_id' => $request->id,
                'identifier' => $record['identifier'],
            ]);
            foreach($headers as $header) {
                $value = null;
                $variable_id = $variables[$header['name']];
                $input = $record[$header['name']];
                if ($header['type'] === 'numeric') {
                    $value = (int) $input;
                }
                $answer = \App\Models\Answer::updateOrCreate([
                    'variable_id' => $variable_id,
                    'form_instance_id' => $form_instance->id,
                    'value' => $value
                ]);
                if ($header['type'] === 'option') {
                    $options = explode('|', $input);
                    foreach($options as $option) {
                        $option = \App\Models\VariableOption::updateOrCreate([
                            'variable_id' => $variable_id,
                            'name' => $option
                        ]);
                        $answerOption = \App\Models\AnswerOption::updateOrCreate([
                            'answer_id' => $answer->id,
                            'variable_option_id' => $option->id,
                        ]);
                    }
                }
            }
        }
        return "success";
    }
}
