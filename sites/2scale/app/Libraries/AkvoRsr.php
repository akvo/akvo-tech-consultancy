<?php

namespace App\Libraries;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Cache;

class AkvoRsr
{
    public function __construct()
    {
        $this->token = config('akvo-rsr.token');
        $this->limit = "/?format=json&limit=1";
        $this->limit100 = "/?format=json&limit=100";
    }

    public function getHeaders()
    {
        return [
            'content-type' => 'application/json',
            'Authorization' => $this->token,
        ];
    }

    public function get($endpoint, $param=false, $value=false)
    {
        $path = '';
        if ($param) {
            $path = '&'.$param.'='.$value;
        }
        $url = config('akvo-rsr.endpoints.'.$endpoint).$this->limit100.$path;
        return $this->fetch($url);
    }

    public function fetch($url)
    {
        $client = new \GuzzleHttp\Client();
        try {
            $responses = $client->get($url, $this->getHeaders());
            if ($responses->getStatusCode() === 200) {
                return json_decode($responses->getBody(), true);
            }
            return $responses->getStatusCode();
        } catch (RequestException $e) {
            $responses = null;
            if ($e->hasResponse()) {
                $responses = $e->getResponse();
            }
        }
        return $responses;
    }
}