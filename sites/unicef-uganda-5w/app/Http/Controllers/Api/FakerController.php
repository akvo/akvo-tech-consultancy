<?php

namespace App\Http\Controllers\Api;

use Grimzy\LaravelMysqlSpatial\Types\Point;
use function GuzzleHttp\json_decode;
use Storage;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Faker;
use App\DataPoint;
use App\FormInstance;
use App\Question;
use App\QuestionGroup;
use App\Answer;
use App\Option;
use App\Cascade;
use App\AnswerOption;
use App\AnswerCascade;
use App\Form;
use App\Libraries\FlowScale;

class FakerController extends Controller
{
    function __construct($total, $repeat)
    { 
        $this->locations = collect(json_decode(Storage::disk('local')->get('ke.json')));
        $this->faker = Faker\Factory::create();
        $this->total = $total;
        $this->repeat = $repeat;
        $this->questions = collect();
    }

    public function seed()
    {
        $i = 1;
        $survey_id = (int) config('surveys.surveyId')[0];
        do {
            $dataPointId = $this->faker->unique()->randomNumber($nbDigits = 9, $strict = true);
            $location = $this->locations->random();
            $position =  $location->lat.','.$location->lng;
            $dataPoint = DataPoint::create([
                'id' => $dataPointId,
                'survey_id' => $survey_id,
                'display_name' => 'test',
                'position' => $position
            ]);
            $formInstances = $dataPoint->formInstance()->saveMany([
                new FormInstance([
                    'form_id' => Form::where('survey_id', $survey_id)->first()->id,
                    'identifier' => $this->faker->uuid,
                    'submitter' => $this->faker->name,
                    'device' => $this->faker->randomElement($array = ['AkvoFlow Web','AkvoFlow App']),
                    'submission_date' => $this->faker->dateTimeThisYear($max = 'now', $timezone = null),
                    'survey_time' => $this->faker->numberBetween($min = 10, $max = 300)
                ])
            ]);
            $randomRepeat = $this->faker->numberBetween($min=1, $max=$this->repeat);
            foreach ($formInstances as $formInstance) {
                $answerCollections = collect();
                $questionGroups = QuestionGroup::with('questions')->get();
                collect($questionGroups)->each(function($qg) 
                    use ($randomRepeat, $answerCollections) {
                        $qgn = collect($qg);
                        $questions = collect([collect($qg['questions'])->sortBy('dependency')]);
                        if ($qg['repeat'] === 1) {
                            $i = 1;
                            do {
                                $questions->push(collect($qg['questions'])->sortBy('dependency'));
                                $i++;
                            } while($i <= $randomRepeat);
                        }
                        $answerCollections->push($this->reindex($questions));
                    });
                $answerCollections->flatten(1)->pluck('answer')->each(function($answer) use ($formInstance) {
                    $answer['form_instance_id'] = $formInstance->id;
                    $savedAnswer = Answer::create(
                        $answer->toArray()
                    );
                    if ($answer['type'] == 'option'){
                        $savedAnswer->option()->save(
                            new AnswerOption($answer['option'])
                        );
                    }
                    if ($answer['type'] == 'cascade'){
                        $savedAnswer->cascade()->save(
                            new AnswerCascade($answer['cascade'])
                        );
                    }
                });
                echo($i.' FormInstance Generated | with '.$randomRepeat.' Repeat Groups'.PHP_EOL);
            }
            $i++;
        } while($i <= $this->total);
        $results = FormInstance::with('answers')->first();
        return collect($results->answers)->groupBy('repeat_index');
    }

    private function reindex($questions)
    {
        return collect($questions)->map(function($qg, $i) {
            $this->questions = collect();
            return $qg->map(function($q) use ($i){
                $nq = collect($q);
                $nq['repeat_index'] = $i;
                $this->questions->push($nq);
                return $this->answer($nq);
            });
        })->flatten(1)
          ->where('take')->values();
    }

    private function randomcascade($parentId)
    {
        $child = Cascade::where('parent_id',$parentId)->withCount('childrens')->get()->random(1)->first();
        if ($child->childrens_count > 0){
            return $this->randomcascade($child->id);
        }
        return $child;
    }

    private function answer($question)
    {
        $question['take'] = true;
        $question['answer'] = collect([
            'question_id' => $question['id'],
            'type' => $question['type'],
            'name' => NULL,
            'value' => NULL,
            'repeat_index' => $question['repeat_index']
        ]);
        switch ($question['type']) {
        case "cascade":
            $cascade = Cascade::where('id', $question['cascade_id'])->first();
            $cascade = $this->randomcascade($cascade->id);
            $question['answer']['name'] = $cascade->name;
            $question['answer']['cascade'] = ['cascade_id' => $cascade->id];
            break;
        case "numeric":
            $question['answer']['value'] = $this->faker->numberBetween($min=10, $max=100);
            break;
        case "date":
            $date = $this->faker->dateTimeBetween($startDate = '-1 day', $endDate = 'now', $timezone = null);
            $question['answer']['name'] = $date;
            break;
        case "option":
            $option = $this->faker->randomElement(Option::where('question_id', $question['id'])->get());
            $question['answer']['option'] = ['option_id' => $option->id];
            $question['answer']['name'] = $option->name;
            break;
        case "photo":
            $question['answer']['name'] = $this->faker->imageUrl($width=640, $height=480);
            break;
        case "geo":
            $location = $this->locations->random();
            $question['answer']['name'] =  $location->lat.','.$location->lng;
            break;
        default:
            $question['answer']['name'] = Str::title($this->faker->word());
            break;
        }
        if ($question['dependency']) {
            $dependency_answer = collect(explode('|',Str::title($question['dependency_answer'])));
            $dependent = Str::title($this
                ->questions->where('id', $question['dependency'])
                ->where('repeat_index', $question['repeat_index'])
                ->values()->first()['answer']['name']);
            $question['take'] = $dependency_answer->contains($dependent);
        }
        return $question;
    }
}
