<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\ApiController;
use \Carbon\Carbon;
use League\Csv\Writer;
use Illuminate\Support\Facades\Storage;

class CsvController extends Controller
{
    public function __construct()
    {
        $this->init = false;
        $this->now = Carbon::now()->format('Y-m-d');
        $this->instance = env('AKVOFLOW_INSTANCE', '');
        $this->geoHeaders = ["GEO-Latitude", "GEO-Longitude", "GEO-Elevation"];
        $this->geoRows = ["lat", "long", "elev"];
        $this->headers = ["Identifier", "Display Name", "Device Identifier", "Instance", "Submission Date", "Submitter", "Duration", "Form Version"];
        $this->api = new ApiController();
        $this->flowApiForm = collect();
    }

    public function generate(Request $request)
    {
        if ($request->status !== 'init' && $request->status !== 'daily') {
            return \response('Not Found', 404);
        }

        if ($request->status === 'init') {
            $this->init = true;
        }

        $sources = $this->api->sources();
        // collect all surveys
        $surveys = $sources->map(function ($source) {
            return collect($this->api->getSurvey($this->instance, $source['sid']));
        });
        // collect data repeatable true and false
        $results = $surveys->map(function ($survey) {
            return $survey['forms'] = $survey['forms']->map(function ($form) use ($survey) {
                // collect form instances
                $formInstances = collect($this->api->getFormInstances($this->instance, $survey['id'], $form['id']));
                // check last submisstion date
                $lastSubmission = collect($formInstances->pluck('submissionDate')->sortDesc()->values()->all())->first();
                // if no response for today date & not initiall run ignore data
                if (!$this->checkDate($lastSubmission) && !$this->init) {
                    return 'No Submission';
                }
                // collect form from flow api
                $this->flowApiForm = $this->api->getFlowApiForm($this->instance, $form['id']);
                // repeatable groups
                $qgs = collect($form['questionGroups']);
                $repeatableTrue = collect($qgs->where('repeatable', 1))->values();
                $repeatableFalse = collect($qgs->where('repeatable', 0))->values();
                // collect repeatable records
                $repeatableTrueData = [];
                if ($repeatableTrue->count() > 0) {
                    $repeatableTrueData = $this->collectRecords($repeatableTrue, $form, $formInstances, true);
                }
                // collect non repeatable records
                $repeatableFalseData = [];
                if ($repeatableFalse->count() > 0) {
                    $repeatableFalseData = $this->collectRecords($repeatableFalse, $form, $formInstances, false);
                }

                return [
                    "repeat_groups_true" => $repeatableTrueData,
                    "repeat_groups_false" => $repeatableFalseData,
                ];
            });
        });

        return $results;
    }

    private function checkDate($date)
    {
        // parse submission date (string) here
        $date = new Carbon($date);
        $date = $date->format('Y-m-d');
        return $date === $this->now;
    }

    private function writeCsv($data)
    {
        $filename = $data['instance'].'-'.$data['fid'].'.csv';
        if ($data['repeatable']) {
            $filename = $data['instance'].'-'.$data['fid'].'-'.$data['questionGroupId'].'.csv';
        }

        if (count($data['records']) === 0) {
            return Storage::disk('public')->url($filename);
        }

        $writer = Writer::createFromPath('../public/uploads/'.$filename, 'w+');
        $writer->insertOne(collect($data['headers'])->toArray());
        $writer->insertAll(collect($data['records'])->toArray());

        return Storage::disk('public')->url($filename);
    }

    private function filterFlowApiForm($qId)
    {
        $result = $this->flowApiForm->filter(function ($form) use ($qId) {
            return (int) $form['id'] === (int) $qId;
        })->first();
        return $result;
    }

    private function collectRecords($data, $form, $formInstances, $repeatable=false)
    {
        // repeat false
        if (!$repeatable) {
            // create headers
            $headers = collect($this->headers);
            $data->pluck('questions')->flatten(1)->each(function ($q) use ($headers) {
                if ($q['type'] === "GEO") {
                    foreach ($this->geoHeaders as $key => $value) {
                        $text = $q['id'] . '|' . $value;
                        $headers->push($text);
                    }
                    return;
                }
                $text = $q['id'] . '|' . $q['name'];
                $headers->push($text);
                // check if question has other value
                $checkOther = $this->filterFlowApiForm($q['id'])['options']['allowOther'];
                if ($checkOther) {
                    $headers->push($q['id'] . '|' . '--Other');
                }
            });

            // create records
            $records = collect();
            $formInstances->each(function ($res, $key) use ($data, $records) {
                $row = collect([
                    $res['identifier'],
                    $res['displayName'],
                    $res['deviceIdentifier'],
                    $res['id'],
                    $res['submissionDate'],
                    $res['submitter'],
                    $res['surveyalTime'],
                    $res['formVersion'],
                ]);

                $data->each(function ($r) use ($res, $row) {
                    $qgId = $r['id'];
                    $questions = collect($r['questions']);
                    // skip if no response
                    if (collect($res['responses'])->has($qgId) === false) {
                        $questions->each(function ($q) use ($row) { $row->push(''); });
                        return;
                    }
                    // collect response
                    $responses = collect($res['responses'][$qgId]);
                    $responses->each(function ($response, $key) use ($res, $questions, $row) {
                        // transform response value
                        $questions->each(function ($q) use ($row, $response) {
                            // $answer = $this->transformResponse($q, $response);
                            // $row->push($answer);
                            $row = $this->transformResponse($q, $response, $row);
                        });
                    });
                });
                $records->push($row);
            });

            $data = [
                "instance" => $this->instance,
                "fid" => $form['id'],
                "questionGroupId" => false,
                "repeatable" => $repeatable,
                "headers" => $headers,
                "records" => $records,
            ];

            // create csv 
            return $this->writeCsv($data);
        }

        $data = $data->map(function ($r) use ($form, $formInstances, $repeatable) {
            $qgId = $r['id'];
            $questions = collect($r['questions']);

            // create headers
            $headers = collect($this->headers);
            $questions->each(function ($q) use ($headers) {
                $text = $q['id'] . '|' . $q['name'];
                $headers->push($text);
                // check if question has other value
                $checkOther = $this->filterFlowApiForm($q['id'])['options']['allowOther'];
                if ($checkOther) {
                    $headers->push($q['id'] . '|' . '--Other');
                }
            });
            
            // create records
            $records = collect();
            $formInstances->each(function ($res, $key) use ($records, $qgId, $questions) {
                // skip if no response
                if (collect($res['responses'])->has($qgId) === false) {
                    $row = collect([
                        $res['identifier'],
                        $res['displayName'],
                        $res['deviceIdentifier'],
                        $res['id'],
                        $res['submissionDate'],
                        $res['submitter'],
                        $res['surveyalTime'],
                        $res['formVersion'],
                    ]);
                    $questions->each(function ($q) use ($row) { $row->push(''); });
                    return;
                }
                // collect response
                $responses = collect($res['responses'][$qgId]);
                $responses->each(function ($response, $key) use ($res, $records, $questions) {
                    $row = collect([
                        $res['identifier'],
                        $res['displayName'],
                        $res['deviceIdentifier'],
                        $res['id'],
                        $res['submissionDate'],
                        $res['submitter'],
                        $res['surveyalTime'],
                        $res['formVersion'],
                    ]);
                    if ($key > 0) {
                        $row = collect(['','','','','','','','',]);
                    }
                    // transform response value
                    $questions->each(function ($q) use ($row, $response) {
                        // $answer = $this->transformResponse($q, $response);
                        // $row->push($answer);
                        $row = $this->transformResponse($q, $response, $row);
                    });
                    $records->push($row);
                });
            });

            $data = [
                "instance" => $this->instance,
                "fid" => $form['id'],
                "questionGroupId" => $qgId,
                "repeatable" => $repeatable,
                "headers" => $headers,
                "records" => $records,
            ];

            // create csv 
            return $this->writeCsv($data);
        });
        return $data;
    }

    private function transformResponse($q, $response, $row)
    {
        if (!isset($response[$q['id']])) {
            $row->push('');
            // check if question has other value
            $checkOther = $this->filterFlowApiForm($q['id'])['options']['allowOther'];
            if ($checkOther) {
                $row->push('');
            }
            return $row;
        }

        $val = $response[$q['id']];
        if ($q['type'] === "GEO") {
            foreach ($this->geoRows as $key => $value) {
                $row->push($val[$value]);
            }
            return $row;
        }

        $answer = '';
        if ($q['type'] === "NUMBER" || $q['type'] === "FREE_TEXT") {
            $answer = $val;
        }
        if ($q['type'] === "OPTION") {
            $val = collect($val);
            if (count($val) === 0) {
                $answer = '';
                $row->push($answer);
                $checkOther = $this->filterFlowApiForm($q['id'])['options']['allowOther'];
                if ($checkOther) {
                    $row->push('');
                }
                return $row;
            }
            if (count($val) > 1) {
                $answer = $val->implode("text", "|");
                if (isset($text['isOther'])) {
                    if (!isset($text['text'])) {
                        $answer = '';
                    } 
                    if (isset($text['text'])) {
                        $answer = $text['text'];
                    }
                    if ($text['isOther']) {
                        $row->push('');
                        $row->push($answer);
                        return $row;
                    }
                } else {
                    $row->push($answer);
                    $checkOther = $this->filterFlowApiForm($q['id'])['options']['allowOther'];
                    if ($checkOther) {
                        $row->push('');
                    }
                    return $row;
                }
            } 
            if (count($val) === 1) {
                $text = $val->first();
                if (!isset($text['text'])) {
                    $answer = '';
                } 
                if (isset($text['text'])) {
                    $answer = $text['text'];
                }
                if (isset($text['isOther'])) {
                    if ($text['isOther']) {
                        $row->push('');
                        $row->push($answer);
                        return $row;
                    }
                } else {
                    $row->push($answer);
                    $checkOther = $this->filterFlowApiForm($q['id'])['options']['allowOther'];
                    if ($checkOther) {
                        $row->push('');
                    }
                    return $row;
                }
            }
        }
        if ($q['type'] === "CASCADE") {
            $val = collect($val);
            if (count($val) === 0) {
                $answer = '';
            }
            if (count($val) > 1) {
                $answer = $val->implode("name", "|");
            } 
            if (count($val) === 1) {
                $answer = $val->first()['name'];
            }
        }

        $row->push($answer);
        return $row;
    }
}
