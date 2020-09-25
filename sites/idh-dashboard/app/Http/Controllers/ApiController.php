<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use App\Models\Survey;
use App\Models\Form;
use App\Models\Answer;
use League\Csv\Reader;

class ApiController extends Controller
{

    public function filters(Survey $surveys)
    {
        $data = $surveys->get()->groupBy('country');
        $data = collect($data)->map(function($list, $key){
            return [
                'name' => $key,
                'childrens' => $list->makeHidden('country')
            ];
        })->values();
        return $data;
    }

    public function data(Request $request, Form $forms)
    {
        $forms = $forms->where('survey_id', $request->id)->get('id');
        $formdata = collect($forms)->map(function($form) {
            $data = collect(config('data.sources'))->where('form_id', $form->id)->first();
            $csv = Reader::createFromPath(base_path().$data['file'], 'r');
            $csv->setHeaderOffset(0);
            $headers = $csv->getHeader();
            $records = iterator_to_array($csv, true);
            $headers = collect($headers)->reject(function ($value) use ($data){
                return $value === 'identifier';
            })->values();
            $collection = collect();
            foreach($records as $record){
                $answers = collect();
                foreach($headers as $header) {
                    $value = $record[$header];
                    $value = is_numeric($value) ? (float) $value : $value;
                    $value = $value === "NA" ? 0 : $value;
                    $header = Str::before($header, ' (');
                    $answers[$header] = $value;
                }
                $collection->push($answers);
            }
            $attributes = collect();
            $samplerec = $collection->first();
            foreach($headers as $header) {
                $name = Str::after($header, '_');
                $name = str_replace('_', ' ', $name);
                $name = Str::title($name);
                $header = Str::before($header, ' (');
                $attributes->push([
                    'name' => $name,
                    'variable' => $header,
                    'type' => is_numeric($samplerec[$header]) ? 'numeric' : 'option',
                ]);
            }
            return [
                'attributes' => $attributes,
                'records' => $collection
            ];
        });
        return $formdata;
    }

}
