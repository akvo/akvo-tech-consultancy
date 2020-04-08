<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class GatewayController extends Controller
{
    function incoming(Request $request)
    {
        $data = $request;
        $text= $data->text;
        $number = explode("*", $text);
        $count = count($number);
        $response = "CON ";
        Log::info($data);
        if($text === NULL){
            $response .= "What can we help you with?\n";
            $response .= "1. I have a technical problem?\n";
            $response .= "2. I have a request about how a feature works?";
            return $response;
        }
        if ($count === 2){
            $response .= "Please choose your survey\n";
            $response .= "1. Household Survey\n";
            $response .= "2. Waterpoint Survey";
            return $response;
        }
        if ($count === 3){
            $response .= "Please choose locations\n";
            $response .= "1. India\n";
            $response .= "2. Kenya\n";
            $response .= "3. Uganda";
            return $response;
        }
        if ($count === 4){
            $response = "END ";
            $loc = "Uganda";
            if ($number[3] === "1") {
                $loc = "India";
            }
            if ($number[3] === "2") {
                $loc = "Kenya";
            }
            $response .= "Thanks for you participation on ".$loc." Survey,\n";
            $response .= "We will send you the survey shortly";
            return $response;
        }
        $response .= "What is the name of your organisation ?\n";
        $response .= "1. Akvo\n";
        $response .= "2. Watershed";
        return $response;
    }
}
