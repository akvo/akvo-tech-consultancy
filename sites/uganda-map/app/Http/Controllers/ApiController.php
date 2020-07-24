<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Storage;

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
    
    public function getGeoShape(Request $request)
    {
        // $json = Storage::disk('local')->get('json/uganda_administrative_level_0'.$request->level.'_small.json');
        $json = Storage::disk('local')->get('json/kabarole_geoshape_level_0'.$request->level.'.json');
        $json = json_decode($json, true);
        return $json;
    }
}
