<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Organization;
use App\Models\User;
use App\Models\WebForm;

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

    public function getConfig()
    {
        return collect(config('webform'));
    }

    /**
     * Post the submission coming from webform endpoint
     */
    public function postWebForm(Request $request)
    {
        $input = $request->validate([
            'user_id' => 'required|integer',
            'organization_id' => 'required|integer',
            'form_id' => 'required|integer',
            'form_instance_id' => 'required|string',
            'form_instance_url' => 'required|string',
            'submitted' => 'required|boolean',
            // 'updated_at' => 'required'
        ]);
        // because the rule is 1 submission for each organization
        $check = collect($input)->except(['submitted']);
        // $check = collect($input)->only(['user_id', 'organization_id', 'form_id']); 
        $input['updated'] =  now();
        $post = WebForm::updateOrCreate($check->toArray(), $input);
        return $post;
    }

    /**
     * Update the submission submitted status
     */
    public function updateWebForm(Request $request)
    {
        // query by organization_id and form_id because the rule is 1 organization only have 1 submission
        // or by form instance url
        $update = WebForm::where([
            ['organization_id', '=' ,(int) $request->organization_id],
            ['form_id', '=', (int) $request->form_id]
        ])->first();
        if (!$update) {
            return \response('Submission not found', 204);
        }
        $update->submitted = $request->submitted;
        $update->updated_at = now();
        $update->save();
        return $update;
    }

    /**
     * Get the submission data ( all / by organization )
     */
    public function getWebForm(Request $request)
    {
        $orgId = $request->organization_id;
        if ($orgId === 'all') {
            return WebForm::all();
        }
        return WebForm::where('organization_id', $orgId)->get();
    }

    /**
     * Check submission data by organization and form
     */
    public function checkWebForm(Request $request)
    {
        $orgId = $request->organization_id;
        $formId = $request->form_id;
        $config = collect(config('webform'));
        $exception = $config['exception'];
        $industry = $config['forms']['industry'];
        $project = $config['forms']['project'];
        
        // if organization was on exception
        $falseValue = [
            "counts" => false,
            "max_submission" => false,
            "submissions" => [],
            "users" => [],
        ];
        if (collect($exception['organization']['ids'])->contains($orgId)) {
            return $falseValue;
        };
        if (collect($project['fids'])->contains($formId) && $project['max_submission'] === null) {
            return $falseValue;
        };

        $submissions = WebForm::where('organization_id', $orgId)->get();
        $submissions = collect($submissions->where('form_id', $formId)->all());
        if (!$submissions) {
            return $falseValue;
        }

        $counts = $submissions->countBy(['form_id'])->first();
        $users = User::select(['name', 'organization_id', 'email'])
                    ->whereIn('id', $submissions->pluck('user_id'))
                    ->get();
        
        if (collect($project['fids'])->contains($formId)) {
            return [
                "counts" => $counts,
                "max_submission" => ($counts >= $project['max_submission']) ? true : false,
                "submissions" => $submissions,
                "users" => $users,
            ];
        };
        
        if (collect($industry['fids'])->contains($formId)) {
            return [
                "counts" => $counts,
                "max_submission" => ($counts >= $industry['max_submission']) ? true : false,
                "submissions" => $submissions,
                "users" => $users,
            ];
        };
        return;
    }

    public function checkWebFormOnLoad(Request $request)
    {
        $orgId = $request->organization_id;
        $config = collect(config('webform'));
        $exception = $config['exception'];
        if (collect($exception['organization']['ids'])->contains($orgId)) {
            return [];
        };
        $projects = collect($config['forms']['project']['fids']);
        $submissions = WebForm::where('organization_id', $orgId)->get();
        $submissions = $submissions->filter(function ($x) use ($projects) {
            return !$projects->contains($x['form_id']);
        });
        return $submissions->pluck('form_id');
    }

}
