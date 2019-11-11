<?php
namespace App\Libraries;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Data;
use App\Question;

class Akvo
{
    public static function login()
    {
        $client = new \GuzzleHttp\Client();

        try {
            $response = $client->post(config('akvo.endpoints.login'), [
                'form_params' => [
                    'client_id' => 'curl',
                    'username' => config('akvo.keycloak_user'),
                    'password' => config('akvo.keycloak_pwd'),
                    'grant_type' => 'password',
                    'scope' => 'openid offline_access'
                ]
            ]);
        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
            }
        }

        if ($response->getStatusCode() == 200) {
            $result = json_decode($response->getBody(), true);
            Cache::put('access_token', $result['access_token'], 4);

            return $result['access_token'];
        } else {
            return null;
        }
    }

    public static function get($url)
    {
        $client = new \GuzzleHttp\Client();
        $token = Cache::get('access_token');

        if (!$token) {
            $token = self::login();
        }

        try {
            $response = $client->get($url, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $token,
                    'Accept' => 'application/vnd.akvo.flow.v2+json',
                    'User-Agent' => 'PHP Laravel'
                ]
            ]);
        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
            }
        }

        if ($response->getStatusCode() == 200) {
            return json_decode($response->getBody(), true);
        } else {
            return null;
        }
    }

    public static function getSurveyData($surveyId, $formId) {
        $instanceRslt = self::get(
            config('akvo.endpoints.forminstances') 
            . '?survey_id=' 
            . $surveyId
            . '&form_id=' 
            . $formId
        );

        $tmp = [];
        if (isset($instanceRslt['formInstances']) && is_array($instanceRslt['formInstances'])) {
            foreach($instanceRslt['formInstances'] as $item) {
                $tmp[] = $item;
            }
    
            $isNotFinished = true;
            while($isNotFinished) {
                if (isset($result['nextPageUrl'])) {
                    $result = Akvo::get($result['nextPageUrl']);
                    foreach($result['formInstances'] as $item) {
                        $tmp[] = $item;
                    }
                } else {
                    $isNotFinished = false;
                }
            }
        }
        
        return $tmp;
    }

    public static function getValue($value) {
        $tmp = [];
        if (isset($value['code'])) {
            $tmp[] = $value['code'];
        }

        if (isset($value['name'])) {
            $tmp[] = $value['name'];
        } else if (isset($value['text'])) {
            $tmp[] = $value['text'];
        }

        return implode(':', $tmp);
    }

    public static function updateDataSurvey() {
        $countries = [];
        foreach (config('surveys.countries') as $item) {
            $countries[] = $item['name'];
        }

        $forms = config('surveys.forms');
        foreach ($forms as $item) {
            foreach ($item['list'] as $survey) {
                $surveys[] = $survey['survey_id'];
            }
        }

        foreach ($surveys as $surveyId) {
            $result = Akvo::get(config('akvo.endpoints.surveys') . '/' . $surveyId);

            if (is_array($result)) {
                foreach ($result['forms'] as $form) {
                    Question::where('form_id', $form['id'])->delete();
                    $countryQID = '';
                    foreach ($form['questionGroups'] as $qgitem) {
                        foreach ($qgitem['questions'] as $qdata) {
                            $question = new Question;
                            $question->question_id = $qdata['id'];
                            $question->type = $qdata['type'];
                            $question->text = $qdata['name'];
                            $question->form_id = $form['id'];
                            $question->survey_id = $surveyId;
                            $question->save();

                            if ($qdata['type'] == 'CASCADE') {
                                $countryQID = $qdata['id'];
                            }
                        }
                    }

                    // DATA 
                    $dataResult = self::getSurveyData(
                        $surveyId,
                        $form['id']
                    );

                    $counter = 0;
                    if (is_array($dataResult)) {
                        foreach ($dataResult as $ditem) {
                            $counter++;
                            Data::where('datapoint_id', $ditem['dataPointId'])->delete();
                            $country = '';
                            foreach ($ditem['responses'] as $dresponse) {
                                foreach ($dresponse[0] as $qid => $qanswer) {
                                    $datam = new Data;
                                    $datam->question_id = $qid;
                                    $datam->datapoint_id = $ditem['dataPointId'];
                                    $datam->submission_date = date('Y-m-d', strtotime($ditem['submissionDate']));

                                    if (is_array($qanswer)) {
                                        $tmp = [];
                                        foreach ($qanswer as $qitem) {
                                            $tmp[] = self::getValue($qitem);
                                        }

                                        $datam->answer = implode('|', $tmp);
                                    } else {
                                        $datam->answer = $qanswer;
                                    }

                                    if ($countryQID == $qid) {
                                        $datam->country = isset($qanswer[0]['name']) ? strtolower($qanswer[0]['name']) : '';
                                        $datam->country = in_array($datam->country, $countries) ? $datam->country : '';
                                        $country = $datam->country;
                                    } else {
                                        $datam->country = '';
                                    }
                                    
                                    $datam->save();
                                }
                            }

                            Data::where('datapoint_id', $ditem['dataPointId'])->update([
                                'country' => $country
                            ]);
                        }
                    }
                }
            }
        }

        Log::channel('akvodata')->info('Update Data: ' . $counter . ' datapoint');
    }
}
