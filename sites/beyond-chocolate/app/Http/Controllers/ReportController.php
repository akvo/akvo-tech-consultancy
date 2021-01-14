<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WebForm;
use League\Csv\Writer;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    public function generateSubmissionReport()
    {
        $forms = config('bc.questionnaires');
        $wfs = WebForm::with('organization')->get();
        $data = $wfs->map(function ($item) use ($forms) {
            $item['form_name'] = $forms[$item['form_id']];
            $item['org_name'] = $item['organization']['name'];
            return collect($item)->only('form_id', 'form_name', 'org_name', 'submitted');
        });
        $submitted = $this->transformSubmissionData($data, true);
        $saved = $this->transformSubmissionData($data, false);
        $results = [];
        $results['headers'] = ["Form Name", "Organization", "Count", "Submission Status"];
        $results['records'] = $saved->concat($submitted)->sortBy('org_name')->values();
        return ["link" => $this->writeCsv($results, "GISCO-Submission-Report")];
    }

    private function transformSubmissionData($data, $submitted)
    {
        $filter = $data->where('submitted', $submitted)->values();
        $results = $filter->groupBy(['org_name', 'form_name'])
            ->map(function ($item, $key) use ($submitted) {
                $orgName = $key;
                $forms = $item->map(function ($form, $key) use ($orgName, $submitted) {
                    $count = $form->count();
                    $form['form_name'] = $key;
                    $form['org_name'] = $orgName;
                    $form['count'] = $count;
                    $form['status'] = ($submitted) ? 'Submitted' : 'Saved';
                    return collect($form)->only('form_name', 'org_name', 'count', 'status');
                })->values();
                return $forms;
            })->values()->flatten(1);
        return $results;
    }

    private function writeCsv($data, $filename)
    {
        $filename .= ".csv";
        if (count($data) === 0) {
            return Storage::disk('public')->url($filename);
        }

        $writer = Writer::createFromPath('../public/uploads/'.$filename, 'w+');
        $writer->insertOne(collect($data['headers'])->toArray());
        $writer->insertAll(collect($data['records'])->toArray());

        return Storage::disk('public')->url($filename);
    }
}
