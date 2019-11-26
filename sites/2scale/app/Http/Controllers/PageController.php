<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use ResponseCache;

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

    public function data()
    {
		return view('pages.data', ['surveys' => config('surveys')]);
    }

	public function survey()
	{
		return view('pages.index', ['surveys' => config('surveys')]);
	}

}

