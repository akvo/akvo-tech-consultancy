<?php
namespace App\Libraries;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Cache;

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

        return $tmp;
    }
}
