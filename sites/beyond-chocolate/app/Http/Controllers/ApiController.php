<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Organization;
use App\Models\User;

class ApiController extends Controller
{
    public function getOrganizations()
    {
        $orgs = Organization::whereNotNull('parent_id')->with('parents')->get();
        $orgs = $orgs->transform(function ($org) {
            $org['name'] = $org['name'] . " ("  .$org['parents']['name'] .")";
            $org = collect($org)->except(['code', 'parents', 'parent_id']);
            return $org;
        });

        return $orgs;
    }

}
