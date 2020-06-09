<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use ResponseCache;
use App\Partnership;
use App\Libraries\Flow;

class PageController extends Controller
{
	/**
	*
	* Create a new controller instance.
	* 
	* 
	* @return void
	**/
	public function __construct() {
	}

	/**
	* 
	* Show the application dashboard.
	* 
	* @return \Illuminate\Http\Response
	*
	*/
	public function home()
	{
		return view('pages.home');
	}

	public function dashboard()
	{
		return view('pages.dashboard');
	}

    public function database()
    {
		return view('pages.database', ['surveys' => config('surveys')]);
    }

	public function surveys()
	{
		return view('pages.survey', ['surveys' => config('surveys')]);
	}

	public function survey(Request $request, Flow $flow)
	{
        $survey = $flow->forminstance($request->id);
        $survey = json_decode($survey['state']);
        $url = config('surveys.url') . '/' . $survey->_formId . '/' . $request->id;
        return view('pages.survey', 
            ['surveys' => config('surveys'), 'saved_survey' => $url]
        );
	}

	public function organisation()
	{
		return view('pages.organisation');
	}

	public function reachreact()
	{
		return view('pages.reachreact', ['surveys' => config('surveys')]);
	}

	public function partnership(Partnership $partnerships, Request $request)
	{
        $countries = $partnerships->has('childrens')->get();
        return view('pages.partnership', [ 'countries' => $countries]);
	}
}

