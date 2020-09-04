<?php

namespace Akvo\Api;

use Illuminate\Support\Str;
use App\Http\Controllers\Controller;

class FlowApi extends Controller
{
    public function __construct($auth)
    {
        $this->headers = $auth->getHeaders();
        $this->baseurl = env("AKVOFLOW_API_URL") . '/' . env("AKVOFLOW_INSTANCE");
    }

    public function get($endpoint, $surveyId = false, $formId = false, $dataPoint = false)
    {
        if ($endpoint === 'folders') {
            $path = '/folders';
        }
        if ($surveyId) {
            $path = '/' . $surveyId;
        }
        if ($formId) {
            $path = '?survey_id=' . $surveyId . '&form_id=' . $formId;
        }

        if ($dataPoint) {
            $path = '?survey_id=' . $surveyId;
        }

        $url = $this->baseurl . $path;
        return $this->fetch($url);
    }

    public function sync($endpoint)
    {

        $url = $this->baseurl.$endpoint;
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
