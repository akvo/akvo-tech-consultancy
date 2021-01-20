<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Organization;
use App\Models\User;

class SeedController extends Controller
{
    public function seedOrganizations()
    {
        $parents = collect(config('organizations.groups'));
        $childs = collect(config('organizations.members'));
        $parents->each(function ($parent) use ($childs) {
            $parent = collect($parent)->except('fullname');
            $insertParent = Organization::updateOrCreate(collect($parent)->toArray());
            $childrens = $childs->where('code', $parent['code']);
            $childrens->each(function ($child) use ($insertParent) {
                $child = collect($child)->except('code');
                $child['parent_id'] = $insertParent->id;
                $child['level'] = 1;
                $insertChild = Organization::updateOrCreate(
                    ['name' => $child['name'], 'parent_id' => $insertParent->id], 
                    collect($child)->toArray()
                );
            });
        });
        // seed child with null code
        $childs->each(function ($child) {
            if ($child['code'] === null) {
                $child = collect($child)->except('code');
                $child['parent_id'] = null;
                $child['level'] = 1;
                $insertChild = Organization::updateOrCreate(
                    ['name' => $child['name'], 'parent_id' => null], 
                    collect($child)->toArray()
                );
            }
        });

        return "Done";
    }

    public function seedDatabase()
    {
        $this->seedOrganizations();
        // $users = User::all();
        // $orgs = Organization::where('level', 1)->pluck('id');
        // $users->each(function ($user) use ($orgs) {
        //     $user->update(['organization_id' => $orgs->random()]);
        // });

        return "Done";
    }
}
