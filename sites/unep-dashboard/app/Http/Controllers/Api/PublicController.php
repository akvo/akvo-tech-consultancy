<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function questions() {
        return \App\Question::select(['code', 'name'])->get();
    }

    public function values() {
        return \App\Value::select(['code', 'name'])->get();
    }

    public function countries() {
        return \App\Country::select(['code', 'name'])->get();
    }

    public function regions() {
        return \App\Group::select(['code', 'name'])->get();
    }

    public function actions() {
        $actions = \App\Datapoint::select(['uuid', 'id'])->with('title')->get();
        $actions = $actions->transform(function($q) {
            return [
                'uuid' => $q->uuid,
                'name' => $q->title->value,
            ];
        });
        return $actions;
    }


    /**
     * ---------------------------------------------
     * Public API & Documentation
     * ---------------------------------------------
     */

    
    /**
        @OA\Get(
            path="/api/public/questions",
            operationId="getPublicQuestions",
            summary="Question list.",
            description="Show all questions.<br/>
                <ul>
                    <li>
                        <i>parent_id</i>, define a relation of parent and children between question.
                    </li>
                    <li>
                        <i>value_id</i>, define a relation between question and value/option.
                    </li>
                    <li>
                        <i>type</i>, define question type.
                    </li>
                </ul>
            ",
            tags={"Question"},
            @OA\Response(
                response="200",
                description="OK",
                content={
                    @OA\MediaType(
                        mediaType="application/json",
                        example={
                            {
                                "id": 1,
                                "parent_id": null,
                                "value_id": null,
                                "code": "43374797",
                                "name": "Your name",
                                "type": "FreeText"
                            },
                            {
                                "id": 2,
                                "parent_id": 1,
                                "value_id": null,
                                "code": "43374799",
                                "name": "Your role",
                                "type": "FreeText"
                            },
                        }
                    )
                }
            )
        )
    */
    public function getPublicQuestions()
    {
        return \App\Question::get();
    }

    /**
        @OA\Get(
            path="/api/public/groups",
            operationId="getPublicGroups",
            tags={"Country Group"},
            summary="Country group list.",
            description="Show all country group with countries.<br/>
                <ul>
                    <li>
                        <i>parent_id</i>, define a relation of parent and children between country group.
                    </li>
                </ul>
            ",
            @OA\Response(
                response="200",
                description="OK",
                content={
                    @OA\MediaType(
                        mediaType="application/json",
                        example={
                            {
                                "id": 1,
                                "parent_id": null,
                                "name": "COBSEA",
                                "code": "COBSEA",
                                "countries": {
                                    {
                                        "id": 1,
                                        "group_id": 1,
                                        "country": {
                                            "id": 77,
                                            "name": "Indonesia",
                                            "code": "IDN"
                                        }
                                    },
                                    {
                                        "id": 2,
                                        "group_id": 1,
                                        "country": {
                                            "id": 124,
                                            "name": "Malaysia",
                                            "code": "MYS"
                                        }
                                    },
                                },
                            },
                        }
                    )
                }
            )
        )
    */
    public function getPublicGroups()
    {
        return \App\Group::with('countries.country')->get();
    }

    /**
        @OA\Get(
            path="/api/public/countries",
            operationId="getPublicCountries",
            tags={"Country"},
            summary="Country list.",
            description="Show all country with group.",
            @OA\Response(
                response="200",
                description="OK",
                content={
                    @OA\MediaType(
                        mediaType="application/json",
                        example={
                            {
                                "id": 1,
                                "name": "Afghanistan",
                                "code": "AFG",
                                "groups": {
                                    {
                                        "id": 12,
                                        "parent_id": null,
                                        "name": "South Asia Seas",
                                        "code": "SAS",
                                        "pivot": {
                                            "country_id": 1,
                                            "group_id": 12
                                        }
                                    },
                                    {
                                        "id": 20,
                                        "parent_id": null,
                                        "name": "Least Developed Countries",
                                        "code": "LDC",
                                        "pivot": {
                                            "country_id": 1,
                                            "group_id": 20
                                        }
                                    }
                                }
                            },
                        }
                    )
                }
            )
        )
    */
    public function getPublicCountries()
    {
        return \App\Country::with('groups')->get();
    }

    /**
        @OA\Get(
            path="/api/public/filters",
            operationId="getPublicFilters",
            tags={"Filter"},
            summary="Filter list.",
            description="Show all filters.<br/>
                <ul>
                    <li>
                        <i>parent_id</i>, define a relation of parent and children between filter/indicator.
                    </li>
                </ul>
            ",
            @OA\Response(
                response="200",
                description="OK",
                content={
                    @OA\MediaType(
                        mediaType="application/json",
                        example={
                            {
                                "id": 1,
                                "parent_id": null,
                                "code": "43375025",
                                "name": "Reporting",
                                "childrens": {
                                    {
                                        "id": 2,
                                        "parent_id": 1,
                                        "code": "105885247",
                                        "name": "As an individual",
                                        "childrens": {},
                                        "locale": {},
                                    },
                                    {
                                        "id": 3,
                                        "parent_id": 1,
                                        "code": "105885313",
                                        "name": "On behalf of an organisation",
                                        "childrens": {},
                                        "locale": {},
                                    },
                                    {
                                        "id": 4,
                                        "parent_id": 1,
                                        "code": "106054616",
                                        "name": "Other",
                                        "childrens": {},
                                        "locale": {},
                                    },
                                },
                                "locale": {},
                            },
                        }   
                    )
                }
            )
        )
    */
    public function getPublicFilters()
    {
        return \App\Value::whereNull('parent_id')
            ->has('childrens')
            ->with('childrens')
            ->with('locale')
            ->get();
    }

    /**
        @OA\Get(
            path="/api/public/datapoints",
            operationId="getPublicDatapoints",
            tags={"Datapoint"},
            summary="Datapoint list.",
            description="Show all datapoints.<br/>
                <ul>
                    <li>
                        <i>countries</i>, define this project implemented in some countries.
                    </li>
                    <li>
                        <i>values</i>, define filter/indicator used by this project.
                    </li>
                </ul>
            ",
            @OA\Response(
                response="200",
                description="OK",
                content={
                    @OA\MediaType(
                        mediaType="application/json",
                        example={
                            "current_page": 1,
                            "data": {
                                {
                                    "id": 1,
                                    "uuid": "545728-545719-63613403",
                                    "phase": 2,
                                    "funds": 0,
                                    "contribution": 0,
                                    "countries": {
                                        {
                                            "country_id": 12,
                                            "country": {
                                                "id": 12,
                                                "name": "Burundi",
                                                "code": "BDI"
                                            },
                                        },
                                    },
                                    "values": {
                                        {
                                            "value_id": 3,
                                            "value": {
                                                "id": 3,
                                                "parent_id": 1,
                                                "code": "105885313",
                                                "name": "On behalf of an organisation"
                                            },
                                        },
                                        {
                                            "value_id": 6,
                                            "value": {
                                                "id": 6,
                                                "parent_id": 5,
                                                "code": "105885205",
                                                "name": "LEGISLATION, STANDARDS, RULES: e.g. agreeing new or changing rules or standards that others should comply with, new regulation, agreements, policies, economic instruments etc. including voluntary commitments."
                                            },
                                        },
                                    }
                                }
                            },
                            "first_page_url": "http://localhost:8000/api/public/datapoints?page=1",
                            "from": 1,
                            "last_page": 15,
                            "last_page_url": "http://localhost:8000/api/public/datapoints?page=15",
                            "next_page_url": "http://localhost:8000/api/public/datapoints?page=2",
                            "path": "http://localhost:8000/api/public/datapoints",
                            "per_page": 15,
                            "prev_page_url": null,
                            "to": 15,
                            "total": 220,
                        }   
                    )
                }
            )
        )
    */
    public function getPublicDatapoints()
    {
        return \App\Datapoint::with([
            'countries.country', 
            'values.value'
        ])->paginate();
    }

    /**
        @OA\Get(
            path="/api/public/datapoint/{uuid}",
            operationId="getPublicDatapointByUuid",
            tags={"Datapoint"},
            summary="Get datapoint by uuid.",
            description="Show datapoint details by uuid.<br/>
                <ul>
                    <li>
                        <i>countries</i>, define this project implemented in some countries.
                    </li>
                    <li>
                        <i>values</i>, define filter/indicator used by this project.
                    </li>
                </ul>
            ",
            @OA\Parameter(
                name="uuid",
                in="path",
                required=true,
                description="uuid for datapoint.",
                @OA\Schema(type="string"),
            ),
            @OA\Response(
                response="200",
                description="OK",
                content={
                    @OA\MediaType(
                        mediaType="application/json",
                        example={
                            {
                                "id": 1,
                                "uuid": "545728-545719-63613403",
                                "phase": 2,
                                "funds": 0,
                                "contribution": 0,
                                "title": {
                                    "id": 4,
                                    "datapoint_id": 1,
                                    "question_id": 8,
                                    "value": "Gestion des déchets plastiques",
                                },
                                "keywords": {
                                    "id": 5,
                                    "datapoint_id": 1,
                                    "question_id": 9,
                                    "value": "La mise en place des textes et lois interdisant l'utilisation des objets non biodégradables ,  La collecte des déchets en plastiques au bord des lacs et rivières",
                                },
                                "info": {
                                    "id": 53,
                                    "datapoint_id": 1,
                                    "question_id": 57,
                                    "value": "L'utilisation des feuilles de bananiers pour l'aménagement des pépinières à la place des sachets .",
                                },
                                "answers": {},
                                "countries": {},
                                "values": {},
                            }
                        }   
                    )
                }
            )
        )
    */
    public function getPublicDatapointByUuid(Request $request)
    {
        $datapoint = \App\Datapoint::where('uuid', $request->uuid)
            ->with([
                'title',
                'keywords',
                'info',
                'answers',
                'countries.country', 
                'values.value'
            ])->get();
        return $datapoint;
    }
}
