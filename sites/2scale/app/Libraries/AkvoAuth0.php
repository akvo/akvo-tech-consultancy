<?php

namespace App\Libraries;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Cache;

class AkvoAuth0
{
    public function __construct()
    {
        $token = Cache::get('token');
        if ($token) {
            $this->token = Cache::get('token');
        }
        $this->token = self::getToken();
    }

    public function getHeaders()
    {
        return [
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/vnd.akvo.flow.v2+json',
                'Authorization' => 'Bearer ' . $this->token
            ]
        ];
    }

    public static function getToken()
    {
        $client = new \GuzzleHttp\Client();
        $auth = [
            'form_params' => [
                'client_id' => config('akvo-auth0.clientID'),
                'username' => config('akvo-auth0.username'),
                'password' => config('akvo-auth0.password'),
                'grant_type' => config('akvo-auth0.grantType'),
                'scope' => config('akvo-auth0.scope')
            ]
        ];

        try {
            $response = $client->post(config('akvo-auth0.endpoints.login'), $auth);
        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
            }
        }

        if($response->getStatusCode() === 200) {
            $result = json_decode($response->getBody(), true);
            Cache::put('token', $result['id_token'], 4);
            return $result['id_token'];
        }

        return null;
    }
}
