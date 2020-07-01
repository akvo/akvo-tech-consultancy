<?php

return [
    "survey_detail" => [
        "instance" => "seap",
        "geolocation" => "75790913|House Hold Location",  //questionId|question  string
        "center_map" => [0.7893, 113.9213],
    ], 

    "sources" => [
        [
            "id" => 79470912,
            "type" => "survey",
            "name" => "DHIS2",
            "parent_id" => null,
        ],
        [
            "id" => 71690912,
            "type" => "registration",
            "name" => "Registration",
            "parent_id" => 79470912,
            "selected_category" => "Gender",  //question string
            "popup_name" => "Patient Name", //question string
            "search" => ["Patient Name"],
            "list" => [
                [
                    "question_id" => 83510912,
                    "name" => "Gender",
                    "type" => "option",
                ],
                [
                    "question_id" => 87910915,
                    "name" => "Patient Name",
                    "type" => "text",
                ],
                [
                    "question_id" => 81510912,
                    "name" => "Age",
                    "type" => "number",
                ],
                [
                    "question_id" => 98920913,
                    "name" => "Status",
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
                    "css" => "dhis",
                    "js" => "dhis",
                ],
            ],
        ],
    ],
];
