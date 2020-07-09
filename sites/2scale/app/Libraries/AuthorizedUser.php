<?php

namespace App\Libraries;
use GuzzleHttp\Exception\RequestException;

class AuthorizedUser
{
    public function __construct($token)
    {
        $this->token = $token;
    }

    private function getHeaders()
    {
        return [
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/vnd.akvo.flow.v2+json',
                'Authorization' => 'Bearer ' . $this->token
            ]
        ];
    }

    public function fetchFlow()
    {
        $path = config('akvo-auth0.endpoints.fetch_flow');
        $results = $this->fetch($path);
        return is_null($results);
    }

    private function fetch($url)
    {
        $client = new \GuzzleHttp\Client();
        $headers = $this->getHeaders();

        try {
            $response = $client->get($url, $headers);
            if ($response->getStatusCode() === 200) {
                return json_decode($response->getBody(), true);
            }

            return $response->getStatusCode();

        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
            }
        }

        return null;
    }
}
