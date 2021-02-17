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
        if(isset($request->country)) {
            $url .= '/' . $request->country;
        }
        return view('frames.frame-database', [
            'url' => $url . '/' . $request->start . '/' . $request->end,
            'start' => $request->start,
            'end' => $request->end,
        ]);
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
        $start = '2018-01-01';
        $end = date("Y-m-d");
		return view('frames.frame-dashboard', [
            'country_id' => 0,
            'partnership_id' => 0,
            'start' => $start,
            'end' => $end
        ]);
    }

    public function reachreact(Request $request)
    {
        $start = '2018-01-01';
        $end = date("Y-m-d");
        if (isset($request->start)) {
            $start = $request->start;
            $end = $request->end;
        }
        return view('frames.frame-reachreact',
            [
                'country_id' => $request->country_id,
                'partnership_id' => $request->partnership_id,
                'start' => $start,
                'end' => $end
            ]
        );
    }

    public function organisation(Request $request)
    {
		return view('frames.frame-organisation', ['surveys' => config('surveys')]);
    }

    public function partnership(Request $request)
    {
        $start = '2018-01-01';
        $end = date("Y-m-d");
        if (isset($request->start)) {
            $start = $request->start;
            $end = $request->end;
        }
        return view('frames.frame-partnership',
            [
                'country_id' => $request->country_id,
                'partnership_id' => $request->partnership_id,
                'form_id' => $request->form_id,
                'start' => $start,
                'end' => $end
            ]
        );
    }

    public function support()
    {
        return view('frames.frame-support');
    }

    public function report()
    {
        return view('frames.frame-report');
    }

}
