<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use App\Libraries\AkvoRsr;
use App\Partnership;

class AkvoRsrController extends Controller
{
    public function __construct()
    {
        $this->code = null;
        $this->collection = collect();
    }

    public function generateReport(Request $r, AkvoRsr $rsr, Partnership $pr)
    {
        if ($r->partnership_id === "0") {
            return [];
        }

        $partnership = $pr->find($r->partnership_id);
        if ($partnership['parent_id'] !== null) {
            $this->code = Str::lower($partnership['name']);
            $partnership = $pr->find($partnership['parent_id']);
        }

        $projectId = config('akvo-rsr.projects.childs.'.$partnership['code']);
        if ($projectId === null) {
            return [];
        }

        # TO DELETE
        $this->code = null; # testing
        $projectId = 400; # testing
        # EOL TO DELETEs

        $data = [
            "project" => $this->getProjects($rsr, $projectId),
            "updates" => $this->getUpdates($rsr, $projectId),
            "results" => $this->getResults($rsr, $projectId),
        ];
        // return $data;
        return view('reports.template', ['data' => $data]);
    }

    private function getProjects($rsr, $projectId)
    {
        $projects = $rsr->get('projects', 'id', $projectId);
        if ($projects['count'] == 0) {
            return [];
        }
        return $projects['results'][0];
    }

    private function getUpdates($rsr, $projectId)
    {
        $this->collection = collect();
        $updates = $rsr->get('updates', 'project', $projectId);
        if ($updates['count'] == 0) {
            return [];
        }
        $this->collectUpdates(collect($updates['results']));
        // fetch next page
        while($updates['next'] !== null){
            $updates = $rsr->fetch($updates['next']);
            if ($updates['count'] !== 0) {
                $this->collectUpdates(collect($updates['results']));
            }
        }
        return $this->collection;
    }

    private function getResults($rsr, $projectId)
    {
        $this->collection = collect();
        $results = $rsr->get('results', 'project', $projectId);
        if ($results['count'] == 0) {
            return [];
        }
        $this->collectResults(collect($results['results']));
        // fetch next page
        while($results['next'] !== null){
            $results = $rsr->fetch($results['next']);
            if ($results['count'] !== 0) {
                $this->collectResults(collect($results['results']));
            }
        }
        return $this->collection;
    }
    
    private function collectUpdates($data)
    {
        $data->map(function ($item) {
            $this->collection->push($item);
        });
        return;
    }

    private function collectResults($data)
    {
        $data->map(function ($item) {
            $item['parent_project'] = Arr::flatten($item['parent_project']);
            $item['child_projects'] = Arr::flatten($item['child_projects']);
            if ($this->code === null) {
                $this->collection->push($item);
            }
            if ($this->code !== null && collect(array_map('strtolower', $item['child_projects']))->contains($this->code)) {
                $this->collection->push($item);
            }
        });
        return;
    }
}
