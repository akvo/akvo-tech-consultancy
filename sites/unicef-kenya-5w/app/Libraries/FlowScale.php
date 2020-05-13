<?php

namespace App\Libraries;
use GuzzleHttp\Exception\RequestException;

class FlowScale
{
    public function getQuestions($formId) 
    {
        $client = new \GuzzleHttp\Client();
        $path = '/' . $formId . '/update';
        $url = config('akvo.endpoints.questions') . $path;

        try {
            $response = $client->get($url);
        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
            }
        }

        if ($response->getStatusCode() === 200) {
            return json_decode($response->getBody(), true);
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
        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
            }
        }

        if ($response->getStatusCode() === 200) {
            return json_decode($response->getBody(), true);
        }

        return null;
    }
}
