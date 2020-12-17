<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Organization;
use App\Models\WebForm;

class UserSavedFormsController
{
    public function __invoke(Request $request)
    {
        $config = config('bc');
        $qs = $config['questionnaires'];
        $url = $config['form_url_no_instance'];
        $user = $request->user();
        $webforms = WebForm::where([
            ['organization_id', $user->organization_id],
            ['submitted', false]
        ])->get();
        $webforms = $webforms->map(function ($wf) use ($qs, $url) {
            return [
                "date" => $wf->updated_at,
                "org_id" => $wf->organization_id,
                "org_name" => $wf->organization->name,
                "submission_name" => null,
                "submitter" => $wf->user->email,
                "survey_name" => $qs[$wf->form_id],
                "url" => $url . $wf->form_instance_url,
                "web_form_id" => $wf->id
            ];
        });
        return $webforms;
    }

    // public function __invoke(Request $request)
    // {
    //     $user = $request->user();
    //     $query = self::getFetchQuery($user);
    //     if (count($query) < 1) {
    //         return [];
    //     }
    //     $data = self::fetchData($query);
    //     if (!is_array($data) || count($data) < 1) {
    //         return [];
    //     }
    //     $result = self::formatData($data);
    //     usort($result, [self::class, 'compareData']);
    //     // filter saved form by organization
    //     $result = collect($result)->filter(function ($res) use ($user) {
    //         return $res['org_id'] === $user->organization_id;
    //     })->values();
    //     return $result; 
    // }

    private static function fetchData($query)
    {
        $response = Http::retry(3, 100)->get(config('bc.saved_form_endpoint'), $query);
        return $response->json();
    }

    private static function compareData($a,  $b)
    {
        $aPoint = stripos($a['survey_name'], 'project');
        $bPoint = stripos($b['survey_name'], 'project');
        if ($aPoint === $bPoint) {
            $cmp = strnatcmp($a['survey_name'], $b['survey_name']);
            if ($cmp === 0) {
                return (strtotime($a['date']) < strtotime($b['date'])) ? 1 : -1;
            }
            return $cmp;
        }
        if ($aPoint === false) {
            return -1;
        }
        if ($bPoint === false) {
            return 1;
        }
        return ($aPoint < $bPoint) ? -1 : 1;
    }

    private static function formatData($data)
    {
        return array_map(function ($it) {
            $rawMeta = array_key_exists('meta', $it) ? $it['meta']: [];
            $meta = array_merge(['formId' => '', 'dataPointName' => '', 'email' => '', 'formName' => '', 'org' => ''], $rawMeta);
            $org = Organization::find($meta['org']);
            if (is_null($org)) {
               $orgName = '';
            } else {
               $orgName = $org->name;
            }

            return [
                'url' => config('bc.form_url').$meta['formId'].'/'.$it['id'],
                'submission_name' => $meta['dataPointName'],
                'submitter' => $meta['email'],
                'survey_name' => $meta['formName'],
                'org_id' => $meta['org'],
                'org_name' => $orgName,
                'date' => $it['updated'],
            ];
        }, $data);
    }

    private static function getFetchQuery($user)
    {
        $query = [];
        if (! in_array('manage-surveys', $user->role->permissions)) {
            $forms = [];
            foreach ($user->questionnaires as $form) {
                $forms[] = $form->name;
            }
            if (count($forms) < 1) {
                return [];
            }
            $query['formId'] = implode(',', $forms);
            $query['org'] = $user->organization_id;
        } else {
            $query['formId'] = implode(',', array_keys(config('bc.questionnaires')));
        }
        $query['submitted'] = 'false';

        return $query;
    }
}
