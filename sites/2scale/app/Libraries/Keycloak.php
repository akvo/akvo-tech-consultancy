<?php
namespace App\Libraries;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Data;
use App\Question;
use App\Form;
use App\Option;

class Keycloak
{
    public function __construct() {
        $token = Cache::get('access_token');
        if ($token) {
            $this->token = Cache::get('access_token');
        }
        $this->token = self::getToken();
    }

    public function getHeaders()
    {
        return array('headers' =>
            array(
                'Authorization' => 'Bearer ' . $this->token,
                'Accept' => 'application/vnd.akvo.flow.v2+json',
                'User-Agent' => 'PHP Laravel'
            )
        );
    }

    public static function getToken()
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
        }
        return null;
    }

}
