<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ApiController extends Controller
{
    //
    public function getConfig(Request $request)
    {
        $surveyId = $request->survey_id;
        return config("$surveyId");
    }

    public function getSurveys(Request $request)
    {
        return config("surveys");
    }

    /*
		Verify Download Function (NOT LOGIN)
	*/
	public function getVerification(Request $request)
	{
        $code = 401;
        $message = 'Wrong Code'; 
		if ($request->security_code === 'wins12345'){
            $code = 200;
            $message = 'Granted';
		}
        $resp = array(
            'code'=>$code,
            'message'=>$message
        );
        return response()->json($resp, $code);
	}
}
