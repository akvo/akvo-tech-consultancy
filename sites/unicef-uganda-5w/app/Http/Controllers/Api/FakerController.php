<?php

namespace App\Http\Controllers\Api;

use Grimzy\LaravelMysqlSpatial\Types\Point;
use function GuzzleHttp\json_decode;
use Storage;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\DataPoint;
use App\FormInstance;
use App\Question;
use App\Answer;
use App\Option;
use App\Cascade;
use App\AnswerOption;
use App\AnswerCascade;
use App\Form;
use App\Libraries\FlowScale;

class FakerController extends Controller
{
    public function __construct()
    {
        $this->location = collect();
    }

    public function seedFakeSurveyData($faker, $total)
    {
        $surveys = collect(config('surveys.surveyId'))->each(function ($surveyId) use ($faker, $total) {
            $postDataPoints = $this->seedFakeDataPoints($faker, $total, $surveyId);

            $forms = Form::where('survey_id', (int) $surveyId)->get();
            $forms->each(function ($form) use ($faker) {
                $postFormInstances = $this->seedFakeFormInstances($faker, $form);
            });

            return $postDataPoints;
        });

        return $surveys;
    }

    private function seedFakeDataPoints($faker, $total, $surveyId)
    {
        $count = 0;
        do {
            echo("Seeding Data Point...".PHP_EOL);
            $fakeId = $faker->unique()->randomNumber($nbDigits = 9, $strict = true);
            $displayName = $faker->state.' - '.$faker->stateAbbr.' - '.$faker->city.' - '.$faker->company;
            //$position = new Point($location->lat, $location->lng);
            $postDataPoint = new DataPoint([
                'id' => $fakeId,
                'survey_id' => (int) $surveyId,
                'display_name' => $displayName,
                'position' => null
            ]);
            $postDataPoint->save();
            $count++;
        } while ($count < $total);

        return $postDataPoint->id;
    }

    private function seedFakeFormInstances($faker, $form)
    {
        $dataPoints = DataPoint::where('survey_id', $form->survey_id)->get();
        $postFormInstances = collect($dataPoints)->each(function ($dataPoint) use ($faker, $form) {
            echo("Seeding Form Instance...".PHP_EOL);
            $postFormInstance = new FormInstance([
                'form_id' => $form->id,
                'data_point_id' => $dataPoint->id,
                'identifier' => $faker->uuid,
                'submitter' => $faker->name,
                'device' => $faker->randomElement($array = ['AkvoFlow Web', 'AkvoFlow App']),
                'submission_date' => $faker->dateTimeThisYear($max = 'now', $timezone = null),
                'survey_time' => $faker->numberBetween($min = 10, $max = 300)
            ]);
            $postFormInstance->save();
            return $postFormInstance->id;
        });

        return $postFormInstances;
    }

    public function seedFakeAnswers($faker)
    {
        $formInstances = new FormInstance();
        $washDomainId = config('query.wash_domain.id');
        $formInstancesData = $formInstances->doesntHave('answers')->get();

        $postAnswers = $formInstancesData->each(function ($formInstance) use ($faker, $washDomainId) {
            $questions = Question::where('form_id',$formInstance->form_id)->get();
            $questions->each(function ($question) use ($faker, $formInstance, $washDomainId) {
                if ($question->id === $washDomainId) {
                    // seed wash domain --> waiting for confirmation
                    // $this->seedWashDomainAnswers($faker, $formInstance, $washDomainId);
                }

                if ($question->id !== $washDomainId && $question->dependency !== $washDomainId) {
                    $this->seedNotWashDomainAnswers($faker, $formInstance, $question);
                }
            });

            return $questions;
        });

        return $postAnswers;
    }

    private function seedWashDomainAnswers($faker, $formInstance, $washDomainId)
    {
        echo("======> Preparing Seeding Wash Domain...".PHP_EOL);
        $flowScale = new FlowScale();
        $questionScale = collect($flowScale->getQuestions($formInstance->form_id));
        $questionGroups = collect($questionScale->get('questionGroup'));
        $domainQuestion = $questionGroups->where('heading', 'What');

        echo("Seeding Answer...".PHP_EOL);
        $question = Question::find($washDomainId);
        $name = NULL;
        $value = NULL;
        if ($question->type === 'option') {
            $options = Option::where('question_id', $question->id)->get();
            echo("Selecting Option...".PHP_EOL);
            do {
                $stop = true;
                $option = $options->random();
                if (collect($option)->contains('other')) {
                    $stop = false;
                }
            } while($stop);
            $name = $option->name;
        }

        $postAnswer = new Answer([
            'form_instance_id' => $formInstance->id,
            'question_id' => $question->id,
            'name' => $name,
            'value' => $value,
            'repeat_index' => 0
        ]);
        $postAnswer->save();

        if ($question->type === 'option') {
            $postOption= new AnswerOption([
                'answer_id' => $postAnswer->id,
                'option_id' => $option->id
            ]);
            $postOption->save();
        }

        echo("Check Dependency...".PHP_EOL);
        $domainQuestion->map(function ($question) use ($option, $faker, $formInstance, $value, $name) {
            $questions = collect($question['question']);
            $questions->map(function ($item) use ($option, $faker, $formInstance, $value, $name) {
                if (isset($item['dependency'])) {
                    $dependencies = collect($item['dependency']);
                    $dependency = $dependencies->map(function ($val) {
                        return Str::lower($val);
                    });

                    if ($dependency->contains($option->name)) {
                        $question = Question::find((int) $item['id']);
                        $text = $question->name;
                        $answerValue = $option->name;

                        $coordinationMeeting = Str::contains($answerValue, 'coordination - meetings');
                        if ($coordinationMeeting) {
                            $value = $this->setValues($text, $faker, 15, 25);
                        }

                        $coordinationTraining = Str::contains($answerValue, 'coordination - capacity');
                        if ($coordinationTraining) {
                            $value = $this->setValues($text, $faker, 50, 200);
                        }

                        $hygiene = Str::contains($answerValue, 'hygiene');
                        if ($hygiene) {
                            $value = $this->setValues($text, $faker, 100, 500);
                        }

                        $water = Str::contains($answerValue, 'water');
                        if ($water) {
                            $value = $this->setValues($text, $faker, 100, 500);
                        }

                        $health = Str::contains($answerValue, 'health');
                        if ($health) {
                            $value = $this->setValues($text, $faker, 100, 500);
                        }

                        $sanitation = Str::contains($answerValue, 'sanitation');
                        $other = Str::contains($answerValue, 'other');

                        $name = $faker->word;
                        if ($question->type === 'free') {
                            $value = NULL;
                        }

                        if ($question->type === 'numeric') {
                            $name = NULl;
                        }

                        $postAnswer = new Answer([
                            'form_instance_id' => $formInstance->id,
                            'question_id' => (int) $item['id'],
                            'name' => $name,
                            'value' => $value,
                            'repeat_index' => 0
                        ]);
                        $postAnswer->save();
                    };
                }
            });
        });

        return $domainQuestion;
    }

    private function setValues($text, $faker, $start, $end)
    {
        $value = 0;
        $planned = Str::contains($text, '- Quantity Planned');
        $achived = Str::contains($text, '- Quantity Archived');
        if ($planned) {
            $value = $faker->numberBetween($min = $start, $max = $end);
        }

        if ($achived) {
            $value = $faker->numberBetween($min = 1, $max = $start);
        }
        return $value;
    }

    private function seedNotWashDomainAnswers($faker, $formInstance, $question) {
        echo("======> Preparing Seeding Answers...".PHP_EOL);
        echo("Check Question Type...".PHP_EOL);

        // if type === 'free'
        $name = $faker->sentence($nbWords = 6, $variableNbWords = true);
        $value = NULL;

        if ($question->type === 'photo') {
            $name = $faker->imageUrl($width = 640, $height = 480);
        }

        if ($question->type === 'date') {
            $date = $faker->dateTimeThisYear($max = 'now', $timezone = null);
            if (Str::contains($question->name, 'end date')) {
                $date = $faker->dateTimeBetween($startDate = '-1 day', $endDate = 'now', $timezone = null);
            }
            $name = $date;
        }

        if ($question->type === 'numeric') {
            $name = NULL;
            $value = $faker->numberBetween($min = 50, $max = 150);
        }

        if ($question->type === 'geo') {
            $client = new \GuzzleHttp\Client();
            $googleMapsApi = Str::of(config('akvo.google_apis'))->replace('##*##', $this->location[0]);

            $responses = $client->get(strval($googleMapsApi));
            $response = collect(json_decode($responses->getBody(), true));
            if ($response->get('status') === 'OK') {
                $results = $response->get('results')[0];
                $geo = $results['geometry'];
                $loc = $geo['location'];
                $name =  $loc['lat'].','.$loc['lng'];
                $this->location->pop();
            } else {
                $name = null;
            }
        }

        if ($question->type === 'cascade') {
            $questionLocationId = config('query.cascade.location_qid');
            $parentId = $question->cascade_id;
            $tempLoc = collect();
            echo("Selecting Cascade...".PHP_EOL);
            do {
                $stop = false;
                $cascades = Cascade::where('parent_id', $parentId)->get();
                if ($cascades->count() === 0) {
                    $stop = true;
                } else {
                    $tempCascades = $cascades;
                    $randomCascades = $cascades->random();
                    $parentId = $randomCascades->id;
                }
                // create location name for google maps api
                if ($question->id === $questionLocationId) {
                    $tempLoc->push($randomCascades->name);
                }
            } while(!$stop);
            $cascade = $tempCascades->random();
            $name = $cascade->name;
            // create location name for google maps api
            if ($question->id === $questionLocationId) {
                $this->location->pop();
                $tempLoc->push($name);
            }
            $this->location->push($tempLoc->join(' - '));
        }

        if ($question->type === 'option') {
            $options = Option::where('question_id', $question->id)->get();
            echo("Selecting Option...".PHP_EOL);
            do {
                $stop = true;
                $option = $options->random();
                if (collect($option)->contains('other')) {
                    $stop = false;
                }
            } while($stop);
            $name = $option->name;
        }

        echo("Seeding Answer...".PHP_EOL);
        $postAnswer = new Answer([
            'form_instance_id' => $formInstance->id,
            'question_id' => $question->id,
            'name' => $name,
            'value' => $value,
            'repeat_index' => 0
        ]);
        $postAnswer->save();

        // updating DataPoint location
        if ($question->type === 'geo') {
            $formInstance = FormInstance::find($postAnswer->form_instance_id);
            $updateDataPoint = DataPoint::find($formInstance->data_point_id);
            if($updateDataPoint) {
                $updateDataPoint->position = $name;
                $updateDataPoint->save();
            }
        }

        if ($question->type === 'cascade') {
            $postCascade = new AnswerCascade([
                'answer_id' => $postAnswer->id,
                'cascade_id' => $cascade->id
            ]);
            $postCascade->save();
        }

        if ($question->type === 'option') {
            $postOption= new AnswerOption([
                'answer_id' => $postAnswer->id,
                'option_id' => $option->id
            ]);
            $postOption->save();
        }
    }
}
