<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Organization;
use App\Models\User;

class ApiController extends Controller
{
    public function getOrganizations()
    {
        $orgs = Organization::where('level', 1)->with('parents')->get();
        $orgs = $orgs->transform(function ($org) {
            if ($org['parents'] !== null) {
                $org['name'] = $org['name'] . " ("  .$org['parents']['name'] .")";
            }
            $org = collect($org)->except(['code', 'parents', 'parent_id', 'level']);
            return $org;
        });

        return $orgs;
    }

}
