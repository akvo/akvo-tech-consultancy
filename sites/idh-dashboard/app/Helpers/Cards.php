<?php

namespace App\Helpers;
use Illuminate\Support\Collection;

class Cards {

    public static function create(
        $data, 
        $kind, 
        $title=false,
        $width=12,
        $first_title=false
    ) {
        return [
            'first_title' => $first_title,
            'title' => $title,
            'data' => $data,
            'kind' => $kind,
            'width' => $width,
        ];
    }

    public static function setId($id, $data)
    {
        return collect($data)->map(function($d) use ($id){
            $d['id'] = $id;
            return $d;
        });
    }

}
