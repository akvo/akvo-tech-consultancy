<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\ApiController;
use \Carbon\Carbon;

class CsvController extends Controller
{
    public function __construct()
    {
        $this->now = Carbon::now()->format('Y-m-d');
        $this->geoHeaders = ["GEO-Latitude", "GEO-Longitude", "GEO-Elevation"];
        $this->geoRows = ["lat", "long", "elev"];
        $this->headers = ["Identifier", "Display Name", "Device Identifier", "Instance", "Submission Date", "Submitter", "Duration", "Form Version"];
        $this->api = new ApiController();
    }

    public function generate()
    {
        $sources = $this->api->sources();
        // collect all surveys
        $surveys = $sources->map(function ($source) {
            return collect($this->api->getSurvey('idh', $source['sid']));
        });
        // collect data repeatable true and false
        $results = $surveys->map(function ($survey) {
            return $survey['forms'] = $survey['forms']->map(function ($form) use ($survey) {
                // collect form instances
                $formInstances = collect($this->api->getFormInstances('idh', $survey['id'], $form['id']));

                // repeatable groups
                $qgs = collect($form['questionGroups']);
                $repeatableTrue = collect($qgs->where('repeatable', 1))->values();
                $repeatableFalse = collect($qgs->where('repeatable', 0))->values();
                // collect repeatable records
                if ($repeatableTrue->count() > 0) {
                    $repeatableTrueData = $this->collectRecords($repeatableTrue, $form, $formInstances, true);
                }
                // collect non repeatable records
                if ($repeatableFalse->count() > 0) {
                    $repeatableFalseData = $this->collectRecords($repeatableFalse, $form, $formInstances, false);
                }

                return [
                    "true" => $repeatableTrueData,
                    "false" => $repeatableFalseData,
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
        return $this->now === $date;
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

            return [
                "instance" => 'idh',
                "fid" => $form['id'],
                "questionGroupId" => false,
                "repeatable" => $repeatable,
                "headers" => $headers,
                "records" => $records,
            ];
        }

        $data = $data->map(function ($r) use ($form, $formInstances, $repeatable) {
            $qgId = $r['id'];
            $questions = collect($r['questions']);

            // create headers
            $headers = collect($this->headers);
            $questions->each(function ($q) use ($headers) {
                $text = $q['id'] . '|' . $q['name'];
                $headers->push($text);
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

            return [
                "instance" => 'idh',
                "fid" => $form['id'],
                "questionGroupId" => $qgId,
                "repeatable" => $repeatable,
                "headers" => $headers,
                "records" => $records,
            ];
        });
        return $data;
    }

    private function transformResponse($q, $response, $row)
    {
        if (!isset($response[$q['id']])) {
            $row->push('');
            return $row;
        }

        $val = $response[$q['id']];
        if ($q['type'] === "GEO") {
            // $answer = "lat: ".$val['lat']." long: ".$val['long']." elev: ".$val['elev'];
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
            if (count($val) > 1) {
                $answer = $val->implode("text", "|");
            } 
            if (count($val) === 1) {
                $text = $val->first();
                if (!isset($text['text'])) {
                    // isOther
                    $answer = '';
                } 
                if (isset($text['text'])) {
                    $answer = $text['text'];
                }
            }
            if (count($val) === 0) {
                $answer = '';
            }
        }
        if ($q['type'] === "CASCADE") {
            $val = collect($val);
            if (count($val) > 1) {
                $answer = $val->implode("name", "|");
            } 
            if (count($val) === 1) {
                $answer = $val->first()['name'];
            }
            if (count($val) === 0) {
                $answer = '';
            }
        }

        // if (!isset($answer)) {
        //     dd($q, $val);
        // }

        // return $answer;
        $row->push($answer);
        return $row;
    }
}
