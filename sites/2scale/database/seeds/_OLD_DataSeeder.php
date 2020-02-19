<?php

use Illuminate\Database\Seeder;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Collection;
use Faker\Generator as Faker;
use App\Form;
use App\Data;


class DataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(Form $forms, Faker $faker)
    {
        $formId = $forms->select('form_id')->get();
		$formId = collect($formId)->map(function($x){ return $x->form_id; });
        $all_submissions = collect();
		$i = 1;
        do{
            $i++;
			$randomForm = $faker->randomElement($formId);
			try {
	        	$all_submissions->push( $this->seedData($randomForm, $faker) );
            } catch (Exception $e) {
				print_r($e);
			}
		}
        while($i <= 100);
		$submissions = $all_submissions->flatten(1);
		forEach($submissions as $submission) {
            $data = new Data(); 
        	$data->fill($submission);
			$data->save();
		}
		return $submissions;
    }

    private function seedData($formId, $faker)
    {
        $formDetail = \App\Form::where('form_id', $formId)->first();
        $client = new \GuzzleHttp\Client();
        $country_id = $formDetail->country_id;
        try {
            $response = $client->get(config('akvo.endpoints.xmlform') . $formId . '/fetch');
        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
            }
        }
        $form = json_decode($response->getBody());
		$qGroup = $form->questionGroup;
		if(isset($form->questionGroup->question)) {
			$qGroup = array($form->questionGroup);
		}
        $collections = collect();
        $country = collect();
        $form = collect($qGroup)->each(function($data) use ($collections, $faker, $country_id, $country, $formId) {
            $identifier = $faker->randomNumber($nbDigits = 8); 
            $submission_date = $faker->dateTimeThisYear($max='now')->format('Y-m-d');
            $questions = collect($data->question)->each(
                function($question) 
                use ( $identifier, $collections, $faker, $submission_date, $country_id, $country, $formId) {
                $question->datapoint_id = $identifier;
                $question->question_id = $question->id;
                $isOption = false;
                $isMultiple = false;
                $isNumber = false;
                $isText = false;
                $answer = NULL;
                if ($question->type === "option") {
                    $isOption = true;
                }
                if (isset($question->allowMultiple)) {
                    $isMultiple = true;
                }
                if ($question->type === "free") {
                    $isText = true;
                }
                if (isset($question->validationRule->validationType)) {
                    $isNumber = true;
                    $isText = false;
                }
                if ($isText) {
                    $answer = $faker->sentence($nbWords = 6, $variableNbWords = true);
                }
                if ($isNumber) {
                    $answer = $faker->randomNumber($nbDigits=2);
                }
                if ($isOption) {
                    $options = collect($question->options->option)->map(function($option) {
                        if (isset($option->code)) {
                            return $option->code . ':' . $option->value;
                        }
                        return $option->value;
                    });
                    $answer = $faker->randomElement($array = $options);
                }
                if ($question->type === "date") {
                    $date = $faker->dateTimeThisYear(
                        $max = 'now'
                    );
                    $answer = $date->format('Y-m-d') . 'T' . $faker->time($format= 'H:i.s') .'Z';
                }
                if ($question->type === "photo") {
                    $answer = "https://picsum.photos/200";
                }
                if ($question->type === "cascade") {
                    $cascade = $question->cascadeResource;
                    $first_level = $this->randomCascade($cascade); 
                    $name = $first_level->name;
                	if ((int) $question->question_id === $country_id) {
                    	$country->push($name); 
					}
                    if (isset($first_level->code) && !empty($first_level->code)) {
                        $name = $first_level->code .':'. $first_level->name;
                    }
                    $i = 2;
                    do{
                        $i++;
                        $next_level = $this->randomCascade($cascade, $first_level->id);
                        $next_name = $next_level->name;
                        if (isset($next_level->code) && !empty($next_level->code)) {
                            $next_name = $next_level->code .':'. $next_level->name;
                        }
                        $name .= '|' .$next_name;
                    }
                    while($i <= count($question->levels->level));
                    $answer = $name;
                }
                $input = array(
                    "question_id" => (int) $question->question_id, 
                    "datapoint_id" => $identifier, 
                    "form_id" => $formId, 
                    "answer" => $answer,
                    "submission_date" => $submission_date,
                );
                $collections->push($input);
            });
        });
        $collections = $collections->map(function($data) use ($country){
            $data['country'] = $country[0];
            return $data; 
        })->toArray();
        return $collections;
    }

    private function randomCascade($source, $id = 0) {
        $client = new \GuzzleHttp\Client();
        try { $response = $client->get(config('akvo.endpoints.cascade') . $source . '/' . $id);
        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
            }
        }
        $data = json_decode($response->getBody());
        return collect($data)->random();
    }


}
