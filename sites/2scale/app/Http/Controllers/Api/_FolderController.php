<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Libraries\Akvo;

class FolderController extends Controller
{
    public function getFolders(Request $request)
    {
        $result = Akvo::get(config('akvo.endpoints.folders'));

        if ($result) {
            return response()->json([
                'status' => 'success',
                'data' => $result
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Folder error'
            ]);
        }
    }
}
