<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Organization;

class SeedController extends Controller
{
    public function seedOrganizations()
    {
        $parents = collect(config('organizations.groups'));
        $childs = collect(config('organizations.members'));
        $parents->each(function ($parent) use ($childs) {
            $parent = collect($parent)->except('fullname');
            $insertParent = Organization::updateOrCreate(collect($parent)->toArray());
            $childs->each(function ($child) use ($parent, $insertParent) {
                if ($parent['code'] === $child['code']) {
                    $child = collect($child)->except('code');
                    $child['parent_id'] = $insertParent->id;
                    $insertChild = Organization::updateOrCreate(collect($child)->toArray());
                }
            });
        });

        return "Done";
    }
}
