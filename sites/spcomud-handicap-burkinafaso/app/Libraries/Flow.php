<?php

namespace App\Libraries;
use GuzzleHttp\Exception\RequestException;
use App\Libraries\Auth;

class Flow
{
    public function __construct(Auth $auth)
    {
        $this->headers = $auth->getHeaders(); 
    }

    public function get($endpoint, $surveyId, $formId = false, $dataPoint = false)
    {
        $path = '/' . $surveyId;
        if ($formId) {
            $path = '?survey_id=' . $surveyId . '&form_id=' . $formId;
        } 

        if ($dataPoint) {
            $path = '?survey_id=' . $surveyId;
        }

        $url = config('akvo.endpoints.' . $endpoint) . $path;
        return $this->fetch($url);
    }

    public function sync($endpoint)
    {

        $url = config('akvo.endpoints.' . $endpoint);
        return $this->fetch($url);
    }

    public function fetch($url)
    {
        $client = new \GuzzleHttp\Client();
        try {
            $response = $client->get($url, $this->headers);
            if ($response->getStatusCode() === 200) {
                return json_decode($response->getBody(), true);
            }
            return $response->getStatusCode();

        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
            }
        }
        return false;
    }
}

