<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use League\Csv\Reader;
use League\Csv\Writer;

class SeedController extends Controller
{
    public function seed() 
    {
        $sources = config('data.sources');
        echo("Seeding Forms".PHP_EOL);
        foreach ($sources as $data) {
            $this->createForm($data);
        }
        return "finish";
    }

    private function createForm($data) 
    {
        $form = \App\Models\Form::updateOrCreate([
            'fid' => $data['fid'],
            'kind' => $data['kind'],
            'country' => $data['country'],
        ]);
        $csv = Reader::createFromPath(base_path().$data['file'], 'r');
        $csv->setHeaderOffset(0);
        $headers = $csv->getHeader();
        $records = iterator_to_array($csv, true);
        $samplerec = collect($records)->first();
        $headers = collect($headers)->reject(function ($value) use ($data){
            return $value === 'identifier';
        })->values();
        $headers = $headers->map(function($header) use ($samplerec) {
            return [
                'name' => $header,
                'type' => is_numeric($samplerec[$header]) ? 'number' : 'option',
            ];
        })->toArray();
        $variables = collect();
        echo("Seeding Headers".PHP_EOL);
        foreach($headers as $header) {
            $variable = \App\Models\Variable::updateOrCreate($header);
            $variables[$header['name']] = $variable->id;
        }
        echo("Seeding Records".PHP_EOL);
        foreach($records as $record){
            $form_instance = \App\Models\FormInstance::updateOrCreate([
                'form_id' => $form->id,
                'identifier' => $record['identifier'],
            ]);
            foreach($headers as $header) {
                $value = null;
                $variable_id = $variables[$header['name']];
                $input = $record[$header['name']];
                if ($header['type'] === 'number') {
                    $value = (float) $input;
                }
                $answer = \App\Models\Answer::updateOrCreate([
                    'variable_id' => $variable_id,
                    'form_instance_id' => $form_instance->id,
                    'value' => $value
                ]);
                if ($header['type'] === 'option') {
                    $options = explode('|', $input);
                    foreach($options as $option) {
                        $option = \App\Models\Option::updateOrCreate([
                            'variable_id' => $variable_id,
                            'name' => $option
                        ]);
                        $answerOption = \App\Models\AnswerOption::updateOrCreate([
                            'answer_id' => $answer->id,
                            'option_id' => $option->id,
                        ]);
                    }
                }
            }
        }
        return true;
    }

}
