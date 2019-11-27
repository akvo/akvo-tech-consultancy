<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FrameController extends Controller
{
	public function blank()
	{
		return view('frames.blank');
	}

	public function datatable(Request $request)
	{
        $url = '/' . $request->form_id;
        $country = '';
        $date = '';
        if(isset($request->country)) {
            $country = $request->country;
        }
        if(isset($request->date)) {
            $date = $request->country;
        }
        $url .= '/'.$country.'/'.$date;
		return view('frames.datatable', ['url' => $url]);
	}

    public function charts(Request $request)
    {
		return view('frames.charts');
    }

}
