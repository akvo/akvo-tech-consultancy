<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Libraries\Akvo;

class SurveyController extends Controller
{
    public function getSurvey(Request $request, $id)
    {
        if ($id) {
            $result = Akvo::get(config('akvo.endpoints.surveys') . '/' . $id);

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

    public function getSurveys(Request $request)
    {

        if ($request->query('id')) {
            $folders = Akvo::get(config('akvo.endpoints.folders') . '?parent_id=' . $request->query('id'));
            $surveys = Akvo::get(config('akvo.endpoints.surveys') . '?folder_id=' . $request->query('id')); 

            $tmp = [];
            foreach($folders['folders'] as $item) {
                $tmp[] = [
                    'id' => $item['id'],
                    'type' => 'folder',
                    'name' => $item['name']
                ];
            }

            foreach($surveys['surveys'] as $item) {
                $tmp[] = [
                    'id' => $item['id'],
                    'type' => 'survey',
                    'name' => $item['name']
                ];
            }
        } else {
            $result = Akvo::get(config('akvo.endpoints.folders'));

            $tmp = [];
            foreach($result['folders'] as $item) {
                $tmp[] = [
                    'id' => $item['id'],
                    'type' => 'folder',
                    'name' => $item['name']
                ];
            }
        }
        

        if ($tmp) {
            return response()->json([
                'status' => 'success',
                'data' => $tmp
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Surveys error'
            ]);
        }
    }
}
