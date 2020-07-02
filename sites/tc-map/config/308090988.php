<?php

return [
    "survey_detail" => [
        "instance" => "seap",
        "geolocation" => "312080978|Geolocation",  //questionId|question  string
        "center_map" => [9.6457, 160.1562],
    ], 

    "sources" => [
        [
            "id" => 308090988,
            "type" => "survey",
            "name" => "Demo Flow Survey",
            "parent_id" => null,
        ],
        [
            "id" => 308090989,
            "type" => "registration",
            "name" => "Registration",
            "parent_id" => 308090988,
            "selected_category" => "Gender", //question string
            "popup_name" => "Name", //question string
            "search" => ["Name", "Job Title"], // question array of string
            "secondary_filter" => [
                [
                  "question_id" => 322230986,
                  "question_text" => "Address",
                  "name" => "Province",
                  "type" => "cascade",
                ],
                [
                    "question_id" => 310440982,
                    "question_text" => "Gender",
                    "name" => "Gender Type",
                    "type" => "option",
                ],
              ],
            "list" => [
                [
                    "question_id" => 310430991,
                    "name" => "Name",
                    "type" => "text",
                ],
                [
                    "question_id" => 310440982,
                    "name" => "Gender",
                    "type" => "option",
                ],
                [
                    "question_id" => 323960999,
                    "name" => "Job Title",
                    "type" => "option",
                ],
            ],
            "color" => [
                [
                    "question_id" =>  310440982,
                    "code" => "Yes",
                    "color" => "",
                ],
            ],
            "template" => [
                [ 
                    "css" => "",
                    "js" => "",
                ],
            ],
        ],
        [
            "id" => 322230993,
            "type" => "monitoring",
            "name" => "COVID Test",
            "parent_id" => 308090989,
            "selected_category" => "Test Location", //question string
            "popup_name" => "Test Location", //question string
            "search" => ["Test location"], // question array of string
            "secondary_filter" => [],
            "list" => [
                [
                    "question_id" => 286420988,
                    "name" => "Test Location",
                    "type" => "option",
                ],
                [
                    "question_id" => 294141015,
                    "name" => "Test Result",
                    "type" => "option",
                ],
            ],
            "color" => [
                [
                    "question_id" =>  287530944,
                    "code" => "",
                    "color" => "",
                ],
            ],
            "template" => [
                [ 
                    "css" => "",
                    "js" => "",
                ],
            ],
        ],
    ],
];
