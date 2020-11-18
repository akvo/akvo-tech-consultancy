<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Answer;
use App\Cascade;
use App\Bridge;
use App\FormInstance;
use App\AnswerOption;
use App\AnswerCascade;
use Artisan;

class BridgeController extends Controller
{
    public function startSeed()
    {
        echo("Migrate brigdes table".PHP_EOL);
        Artisan::call('migrate', ['--path' => 
            'database/migrations/bridge/2020_05_14_052411_create_bridges_table.php'
        ]);
        echo("Getting data from database".PHP_EOL);
        \App\Bridge::truncate();
        $this->bridge();
    }

    public function bridge()
    {
        $values = collect(config('query.values'));
        $qid = $values->pluck('id')->flatten(1);
        $answers = Answer::whereIn('question_id', $qid)
            ->orderBy('form_instance_id','ASC')
            ->orderBy('repeat_index','ASC')
            ->get();
        $answers = $answers->groupBy('form_instance_id')->map(function($answer){
            return $answer->groupBy('repeat_index');
        });
        $datapoints = collect();
        $answers = $answers->map(function($data, $key) use ($values, $datapoints) {
            $fill = collect([
                'form_instance_id' => $key
            ]);
            foreach($values as $value) {
                foreach($data->first() as $dt){
                    $match = collect($value['id'])->contains((int) $dt['question_id']);
                    if ($match && !$value['repeat']){
                        $fill[$value['name']] = $this->getValue($value, $dt);
                    }
                }
            }
            $datapoints->push(['fill' => $fill,'repeats' => $data]);
        });
        $answers = $datapoints->map(function($data) use ($values) {
           return collect($data['repeats'])->map(function($dt) use ($values, $data) {
                $repeats = collect($data['fill']);
                foreach($values as $value) {
                    foreach($dt as $d) {
                        $match = collect($value['id'])->contains((int) $d['question_id']);
                        if ($match && $value['repeat']){
                            $repeats[$value['name']] = $this->getValue($value, $d);
                        }
                    }
                }
                // if (isset($repeats['new'])){
                if (isset($repeats['form_instance_id'])){
                    // there was option answer with no value, what should we do? nullable for now
                    // if (!$repeats->contains(null)) {
                        $bridge = new Bridge($repeats->toArray());
                        return $bridge->save();
                    // };
                }
            });
        });
        return $answers->flatten(1);
    }

    private function getValue($value, $answer)
    {
        switch ($value['on']) {
        case 'options':
            $id = $value['bridge']::select('option_id')
                ->where('answer_id',$answer['id'])->first()['option_id'];
            return $id;
        case 'cascades':
            $cascade_id = $value['bridge']::select('cascade_id')
                ->where('answer_id', $answer['id'])->first()['cascade_id'];
            $cascade = $value['value']::select('id','parent_id','level','name')->where('id',$cascade_id);
            $i = $cascade->first()['level'];
            $p = $cascade->first()['level'];
            $with = 'parents';
            for ($i; $i > $value['lv']; $i--) {
                $with .= '.parents';
            }
            $result = $cascade->with($with)->first();
            for ($p; $p >= $value['lv']; $p--) {
                $result = $result['parents'];
            }
            return $result['id'];
        default:
            if ($value['type'] === 'date'){
                return new \Carbon\Carbon($answer['name']);
            }
            return $answer['value'] === null ? $answer['name'] : $answer['value'];
        }

    }

    public function truncateTable()
    {
        return \App\Bridge::truncate();
    }
}
