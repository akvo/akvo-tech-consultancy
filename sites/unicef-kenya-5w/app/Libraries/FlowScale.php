<?php

namespace App\Libraries;
use GuzzleHttp\Exception\RequestException;

class FlowScale
{
    public function getQuestions($formId) 
    {
        $client = new \GuzzleHttp\Client();
        $path = '/' . $formId . '/' . config('akvo.cascadeMethod');
        $url = config('akvo.endpoints.questions') . $path;

        try {
            $response = $client->get($url);
            if ($response->getStatusCode() === 200) {
                return json_decode($response->getBody(), true);
            }
        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
            }
        }

        return null;
    }

    public function getCascades($resource, $parent = 0)
    {
        $client = new \GuzzleHttp\Client();
        $path = '/' . $resource . '/' . $parent;
        $url = config('akvo.endpoints.cascades') . $path;

        try {
            $response = $client->get($url);
            if ($response->getStatusCode() === 200) {
                return json_decode($response->getBody(), true);
            }
        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
            }
        }

        return null;
    }
}
