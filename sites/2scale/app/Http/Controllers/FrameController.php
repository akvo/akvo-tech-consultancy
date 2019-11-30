<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FrameController extends Controller
{
	public function blank()
	{
		return view('frames.frame-blank');
	}

	public function database(Request $request)
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
		return view('frames.frame-database', ['url' => $url]);
	}

    public function home(Request $request)
    {
		return view('frames.frame-home');
    }

    public function reachreact(Request $request)
    {
		return view('frames.frame-reachreact');
    }

    public function organisation(Request $request)
    {
		return view('frames.frame-organisation', ['surveys' => config('surveys')]);
    }

    public function partnership(Request $request)
    {
		return view('frames.frame-partnership', ['surveys' => config('surveys')]);
    }

}
