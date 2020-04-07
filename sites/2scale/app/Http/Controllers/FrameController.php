<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FrameController extends Controller
{
	public function blank()
	{
		return view('frames.frame-blank');
	}

	public function undermaintenance()
	{
		return view('frames.frame-undermaintenance');
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
        $data = [
            [
                'width'=>'4',
                'icon' => 'tachometer-alt',
                'color' => 'purple-gradient',
                'text' => 'A multi-country dashboard for a selection of KPIs',
                'button' => 'Impact',
                'link' => '/dashboard'
            ],
            [
                'width'=>'4',
                'icon' => 'handshake',
                'color' => 'aqua-gradient',
                'text' => 'A dashboard for Project Facilitator\'s to view select partnership indicators',
                'button' => 'Partnership',
                'link' => '/dashboard'
            ],
            [
                'width'=>'4',
                'icon' => 'briefcase',
                'color' => 'peach-gradient',
                'text' => 'A dashboard for select indicators of the Reach and React forms',
                'button' => 'Reach & Reaction',
                'link' => '/reach-and-react'
            ],
            [
                'width'=>'4',
                'icon' => 'sitemap',
                'color' => 'green-gradient',
                'text' => 'A tree chart showing the participating organisations of all the partnerships',
                'button' => 'Organisation',
                'link' => '/organisation'
            ],
            [
                'width'=>'4',
                'icon' => 'database',
                'color' => 'blue-gradient',
                'text' => 'A section to view and download data',
                'button' => 'Database',
                'link' => '/database'
            ],
            [
                'width'=>'4',
                'icon' => 'tasks',
                'color' => 'red-gradient',
                'text' => 'A data entry section for Project Facilitators',
                'button' => 'Survey',
                'link' => '/survey'
            ],
        ];
		return view('frames.frame-home', ['cards' => $data]);
    }

    public function dashboard(Request $request)
    {
		return view('frames.frame-dashboard');
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
        return view('frames.frame-partnership', 
            [
                'country_id' => $request->country_id,
                'partnership_id' => $request->partnership_id,
                'form_id' => $request->form_id,
            ]
        );
    }

}
