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
	public function index()
	{
		return view('pages.index');
	}
}

