<?php

namespace App\Http\Controllers;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Http\Request;
use App\Models\Organization;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Str;

class SeedController extends Controller
{
    public function seedOrganizations()
    {
        $org = config('organizations');
        $parents = collect($org['groups']);
        $childs = collect($org['members']);
        # Seed Gisco
        $this->OrganizationSeeder($parents, $childs);

        # Seed BC
        $bc_childs = collect($org['bc_members']);
        $this->OrganizationSeeder($parents, $bc_childs);

        return "Done";
    }

    public function seedDatabase()
    {
        $this->seedOrganizations();
        $users = User::all();
        $orgs = Organization::where('level', 1)->pluck('id');
        $users->each(function ($user) use ($orgs) {
            $user->update(['organization_id' => $orgs->random()]);
        });

        return "Done";
    }

    /**
     * Seed user (BC)
     */
    public function seedUser(Request $request)
    {
        $credentials = config('bc.credentials');
        if ($request->password !== $credentials['api']) {
            throw new NotFoundHttpException();
        }

        # TODO :: loop this foreach organization list
        $org = config('organizations');
        $bc_childs = collect($org['bc_members']);
        $bc_childs = $bc_childs->where('active', true)->values();
        $organizations = Organization::whereIn('name', $bc_childs->pluck('name'))->get();
        $results = $organizations->map(function ($org) use ($credentials) {
            $string = Str::before($org['name'], ' - Beyond Chocolate');
            $string = Str::lower($string);
            $string = str_replace(['/', '.'], '', $string);
            $string = preg_split("/[\s,-]+/", $string);
            $orgname = (count($string) > 1) ? implode('-', [preg_replace('/[^\p{L}\p{N}]/u', '',$string[0]), preg_replace('/[^\p{L}\p{N}]/u', '',$string[1])]) : $string[0];
            $orgname = rtrim($orgname, "- ");
            $user = User::factory()->create([
                'organization_id' => $org['id'],
                'name' => 'IDH - '.$orgname,
                'email' => 'idh@'.$orgname.'.org',
                'email_verified_at' => now(),
                'password' => bcrypt($credentials['user']),
                'role' => Role::get('submitter'),
                'questionnaires' => '[]',
            ]);
            return $user;
        });

        return $results;
    }

    private function OrganizationSeeder($parents, $childs)
    {
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
        // seed child with null code (no parent)
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
}
