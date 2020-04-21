<?php

namespace App\Http\Middleware\Services;

use Symfony\Component\HttpFoundation\ParameterBag;
use Closure;

class AfricastalkingMiddleware
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
        $record = $survey_sessions->check(
            $request->phoneNumber,
            $request->instance_name,
            $request->form_id,
        );
        if ($request->isJson()) {
            $this->clean($request->json(), $request, $record);
        } else {
            $this->clean($request->request, $request, $record);
        }
        return $next($request);
    }

    /**
    * Clean the request's data by removing mask from phonenumber.
    *
    * @param  \Symfony\Component\HttpFoundation\ParameterBag  $bag
    * @return void
    */
    private function clean(ParameterBag $bag, $request, $record)
    {
        $uniform = $this->unify($bag->all(), $request, $record);
        $bag->replace($uniform);
    }

    /**
    * Check the parameters and clean the number
    *
    * @param  array  $data
    * @return array
    */
    private function unify(array $data, $request, $record)
    {
        $data = collect($data)->mapWithKeys(function ($value, $key) {
            if ($key === 'sessionId') {
                return ['session_id' => $value];
            }
            if ($key === 'text') {
                return ['answer' => $value];
            }
            if ($key === 'phoneNumber') {
                return ['phone_number' => (int) $value];
            }
            return [$key => $value];
        })->forget(['serviceCode','networkCode']);
        $data->put('type', $request->type);
        $data->put('instance_name', $request->instance_name);
        $data->put('form_id', (int) $request->form_id);
        $data->put('service','africastalking');
        $data->put('record', $record);
        return $data->all();
    }
}
