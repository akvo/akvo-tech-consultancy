<?php
namespace App\Libraries;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use App\Libraries\Keycloak;
use App\Data;
use App\Question;
use App\Form;
use App\Option;

class Flow
{
    public function __construct(Keycloak $keycloak)
    {
        $this->headers = $keycloak->getHeaders();
    }

    public function get($endpoint, $surveyId, $formId = false)
    {
        $payload = '/' . $surveyId;
        if ($formId) {
            $payload = '?survey_id=' . $surveyId . '&form_id=' . $formId;
        }
        $url = config('akvo.endpoints.'.$endpoint) . $payload;
        return $this->fetch($url);
    }

    public function fetch($url)
    {
        $client = new \GuzzleHttp\Client();
        $data = null;
        try {
            $response = $client->get($url, $this->headers);
            if ($response->getStatusCode() === 200) {
                $data = json_decode($response->getBody(), true);
            }

            if (isset($data["error"])) {
                Cache::remove('access_token');
                return $this->fetch($url);
            }
        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
            }
        }
        return $data;
    }

    public function cascade($id){
        $client = new \GuzzleHttp\Client();
        $url = config('akvo.endpoints.cascade') . config('surveys.cascade') . '/' . $id;
        try {
            $response = $client->get($url);
        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
            }
        }
        if ($response->getStatusCode() === 200) {
            $data = json_decode($response->getBody(), true);
        }

        if (empty($data)) {
            return null;
        }


        return $data;
    }

    public function questions($form_id) {
        $client = new \GuzzleHttp\Client();
        $url = config('akvo.endpoints.xmlform') . $form_id . '/fetch';
        $data = null;
        try {
            $response = $client->get($url);
        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
            }
        }
        if ($response->getStatusCode() === 200) {
            $data = json_decode($response->getBody(), true);
        }

        if (empty($data)) {
            return null;
        }

        return $data;
    }

    public function forminstance($id) {
        $client = new \GuzzleHttp\Client();
        $url = config('akvo.form_instance') . '/' . $id;
        try {
            $response = $client->get($url);
        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
            }
        }
        if ($response->getStatusCode() === 200) {
            $data = json_decode($response->getBody(), true);
        }
        if (empty($data)) {
            return null;
        }
        return $data;
    }

}
