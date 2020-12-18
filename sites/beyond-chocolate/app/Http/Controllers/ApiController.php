<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Organization;
use App\Models\User;
use App\Models\WebForm;
use App\Models\Collaborator;
use App\Helpers\Mails;

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

    public function getCollaboratorAssignments(Request $request)
    {
        $webForm = WebForm::find($request->web_form_id);
        if (is_null($webForm)) {
            return [];
        }
        $collaborators = Collaborator::where(['web_form_id' => $webForm->id])->get();
        $orgs = $collaborators->map(function($collaborator){
            $org = [
                "organization_id" => $collaborator->organization_id,
                "primary"=> false,
                "organization_name" => Organization::where(['id' => $collaborator->organization_id])->first()->name
            ];
            return $org;
        })->push([
            "organization_id" => $webForm->organization_id,
            "primary"=> true,
            "organization_name" => Organization::where(['id' => $webForm->organization_id])->first()->name
        ]);
        return $orgs;
    }

    public function addCollaboratorAssignment(Request $request)
    {
        $orgId = $request->organization_id;
        $webFormId = $request->web_form_id;
        $user = $request->user();
        $form = WebForm::find($webFormId);
        if (is_null($form) or $form->organization_id != $user->organization_id) {
            return \response('Only primary organization users can add/remove collaborators', 403);
        }
        $collaborator = Collaborator::updateOrCreate(['web_form_id' => $webFormId, 'organization_id' => $orgId]);
        if (!is_null($collaborator)) {
        }
        $mails = new Mails();
        self::notifyCollaborators($request, $user, $mails);
        return $collaborator;
    }

    // email all users of a collaborator organization
    public function notifyCollaborators(Request $request, User $assigningUser, Mails $mails)
    {
        $users = User::select(['name', 'organization_id', 'email'])
               ->where('organization_id', $request->organization_id)
               ->get();
        $subject = "Organisation added as collaborator";
        $project_title = $request['projectTitle'];
        $assigningOrg = $assigningUser->organization()->first();
        $users->map(function($user) use ($assigningUser, $assigningOrg, $subject, $project_title, $mails){
            $recipients = [['Email' => $user->email, 'Name' => $user->name]];
            $subject = config('app.name').": ".$subject;
            $body = "Dear Mr./Ms. $user->name<br/><br/>

                <p> $assigningUser->name from $assigningOrg->name has added your
                organisation as a collaborator for Project: $project_title.
                </p>

                <p> You can now view and data to the saved project in your
                \"previously saved forms\" section in the GISCO portal.
                </p>

                <p>Please contact us via the feedback form in case you face any issues.</p>";

            $text = "$assigningUser->name from $assigningOrg->name has added your organisation as a collaborator for Project: $project_title.";
            error_log($body);
            $mails->sendEmail($recipients, false, $subject, $body, $text);
        });

        return response([
            'message' => 'The user has been informed!', 'mails' => []
        ]);
    }

    public function deleteCollaboratorAssignment(Request $request)
    {
        $orgId = $request->organization_id;
        $webFormId = $request->web_form_id;
        $user = $request->user();
        $form = WebForm::find($webFormId);
        if (is_null($form) or $form->organization_id != $user->organization_id) {
            return \response('Only primary organization users can add/remove collaborators', 403);
        }
        $collaborator = Collaborator::where(['web_form_id' => $webFormId, 'organization_id' => $orgId])->first();
        if (!is_null($collaborator)) {
            $collaborator->delete();
        }
        return \response('Collaborator deleted', 204);
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
        // update user last activity
        $user = User::find($input['id']);
        $user->last_activity = now();
        $user->save();
        // because the rule is 1 submission for each organization
        // $check = collect($input)->except(['submitted']);
        // $check = collect($input)->only(['user_id', 'organization_id', 'form_id']); 
        $input['updated'] =  now();
        if (isset($request->display_name)) {
            $input['display_name'] = (strtolower($request->display_name) !== 'untitled') ? $request->display_name : null;
        }
        $update = WebForm::where('form_instance_url', $input['form_instance_url'])->first();
        if ($update) {
            $res = $update->update($input);
            return $res;
        }
        $post = WebForm::create($input);
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
