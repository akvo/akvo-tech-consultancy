<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Partnership;

class ConfigController extends Controller
{
    public function getPartnership(Request $request, Partnership $partnerships)
    {
        if ($request->parent_id === "0") {
            return $partnerships->has('parents')->get();
        }
        return $partnerships->where('parent_id',$request->parent_id)->get();
    }
}
