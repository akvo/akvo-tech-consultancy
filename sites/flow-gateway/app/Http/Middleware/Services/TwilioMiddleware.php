<?php

namespace App\Http\Middleware\Services;

use Symfony\Component\HttpFoundation\ParameterBag;
use Closure;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class TwilioMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $survey_sessions = new \App\SurveySession();
        if ($request->isJson()) {
            $this->clean($request->json(), $request);
        } else {
            $this->clean($request->request, $request);
        }
        return $next($request);
    }

    /**
    * Clean the request's data by removing mask from phonenumber.
    *
    * @param  \Symfony\Component\HttpFoundation\ParameterBag  $bag
    * @return void
    */
    private function clean(ParameterBag $bag, $request)
    {
        $uniform = $this->unify($bag->all(), $request);
        $bag->replace($uniform);
    }

    /**
    * Check the parameters and clean the number
    *
    * @param  array  $data
    * @return array
    */
    private function unify(array $data, $request)
    {
        $forgets = [
            'SmsMessageSid',
            'NumMedia',
            'SmsSid',
            'SmsStatus',
            'Label',
            'Body',
            'To',
            'NumSegments',
            'MessageSid',
            'AccountSid',
            'From',
            'ApiVersion'
        ];
        $data = collect($data)->mapWithKeys(function ($value, $key) {
            if ($key === 'SmsMessageSid') {
                return ['session_id' => $value];
            }
            if ($key === 'Body') {
                return ['answer' => $value];
            }
            if ($key === 'NumMedia') {
                return ['media' => (int) $value];
            }
            if ($key === 'From') {
                $phone = Str::afterLast($value, '+');
                return ['phone_number' => (int) $phone];
            }
            return [$key => $value];
        })->forget($forgets);
        if ($data['media'] !== 0) {
            $i = 0;
            do{
                $data->forget('answer');
                $mediaType = Str::afterLast($data['MediaContentType'.$i], '/');
                $mediaUrl = $data['MediaUrl'.$i];
                $filePath = "files/";
                $fileName = Str::afterLast($data['MediaUrl'.$i], '/');
                $fileName .= '.'.$mediaType;
                $filePath .= $fileName;
                $data->forget(['MediaContentType'.$i, 'MediaUrl'.$i]);
                $i++;
            } while ($i < $data['media']);
            $execution = exec("/usr/local/bin/wget -O ".$filePath." ".$mediaUrl);
            $file = fopen($filePath, 'r');
            $response = Http::attach('attachment',
                $file, $fileName)
                ->withHeaders([
					'Origin' => config('akvoflow.upload_image'),
					'Accept' => "*/*",
					'Accept-Encoding' => 'gzip'
				])
                ->post(config('akvoflow.upload_image'));
            $data->put('answer', $response);
        }
        if (Arr::has($data,'Latitude')) {
            $data->forget('answer');
            $data->put('answer',$data['Latitude'].'|'.$data['Longitude'].'|0');
            $data->forget(['Latitude','Longitude','Address']);
        }
        $data->put('type', $request->type);
        $data->put('service','twilio');
        return $data->all();
    }

}
