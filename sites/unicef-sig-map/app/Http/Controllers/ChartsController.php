<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;
use App\Database as DB;

class ChartsController extends Controller
{
    public function getTotalToilet(Request $request, DB $db)
    {
        $data = $db->toilets();
        $total = $data->sum('t_toilets');
        $girls = $data->sum('t_girls');
        $boys = $data->sum('t_boys');
        $shared = $total - ($girls + $boys);
        $schools = $db->count();
        $has_separated = $db->where('20510942', 'Yes')->count();
        $has_shared = $db->where('20510942', 'No')->count();
        $has_toilets = $db->where('22490945', 'No')->count();
        $no_toilets = $db->where('22490945', 'Yes')->count();
        $data = array(
            array( 
                'name' => 'Toilets',
                'data' => array(
                    array('score','total','name'),
                    array(100,$total,'Total'),
                    array(($boys + $girls) / $total * 100,$boys + $girls,'Private'),
                    array(($shared/$total) * 100,$shared,'Shared'),
                    array(($girls/$total) * 100,$girls,'Girls'),
                    array(($boys/$total) * 100,$boys,'Boys'),
                )
            ),
            array(
                'name' => 'Schools',
                'data' => array(
                    array('score','total','name'),
                    array(100,$schools,'Total'),
                    array(($has_separated/$schools) * 100,$has_separated,'Private'),
                    array(($has_shared/$schools) * 100,$shared,'Shared'),
                    array(($has_toilets/$total) * 100,$has_toilets,'Has Toilets'),
                    array(($no_toilets/$total) * 100,$no_toilets,'No Toilets'),
                )
            ),

        );
        return $data;
    }
}
