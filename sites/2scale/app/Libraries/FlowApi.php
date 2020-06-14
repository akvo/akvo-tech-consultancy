<?php
namespace App\Libraries;
use GuzzleHttp\Exception\RequestException;

class FlowApi
{
    public function cascade($id){
        $client = new \GuzzleHttp\Client();
        $url = config('akvo-auth0.endpoints.cascades') . config('surveys.cascade') . '/' . $id;
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
        $url = config('akvo-auth0.endpoints.questions') . $form_id . '/'. config('akvo-auth0.cascadeMethod');
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
        $url = config('akvo-auth0.endpoints.form_instances') . '/' . $id;
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
