<?php

namespace Akvo\Api;

use Illuminate\Support\Facades\Cache;
use App\Http\Controllers\Controller;

class Auth extends Controller
{
    public function __construct()
    {
        $token = Cache::get('token');
        if ($token) {
            $this->token = Cache::get('token');
        }
        if (!$token) {
            $this->token = self::getToken();
        }
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
        $client = new \GuzzleHttp\Client(['http_errors' => false]);
        $url = env('AKVOFLOW_AUTH_URL');
        $auth = [
            'form_params' => [
                'client_id' => env('AKVOFLOW_CLIENT_ID'),
                'username' => env('AKVOFLOW_USERNAME'),
                'password' => env('AKVOFLOW_PASSWORD'),
                'grant_type' => 'password',
                'scope' => 'openid email'
            ]
        ];
        try {
            $response = $client->post($url, $auth);
            if ($response->getStatusCode() === 200) {
                $result = json_decode($response->getBody(), true);
                Cache::put('token', $result['id_token'], 4);
                return $result['id_token'];
            }
            return false;
        } catch(RequestException $e) {
            if ($e->hasResponse()) {
                $exception = (string) $e->getResponse()->getBody();
                $exception = json_decode($exception);
            }
            return false;
        }
        return false;
    }
}
