<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FrameController extends Controller
{
	public function blank()
	{
		return view('frames.blank');
	}

	public function datatable()
	{
		return view('frames.datatable');
	}

}
