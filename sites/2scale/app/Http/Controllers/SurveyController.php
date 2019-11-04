<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Libraries\Akvo;

class SurveyController extends Controller
{
    public function getSurvey(Request $request, $id)
    {
        if ($id) {
            $result = Akvo::get(config('akvo.endpoints.surveys') . $id);

            if ($result) {
                return response()->json([
                    'status' => 'success',
                    'data' => $result
                ]);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Survey error'
                ]);
            }
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Survey Id is mandatory'
            ]);
        }
    }
}
