<?php

return [
    "survey_detail" => [
        "instance" => "seap",
        "survey_id" => 79470912,
        "form_id" => 71690912,
        "monitoring_id" => [],
        "survey_name" => "DHIS2",
        "geolocation" => "75790913|House Hold Location",  //questionId|question  string
        "center_map" => [0.7893, 113.9213],
    ], 

    "categories" => [
        71690912 => [
            "selected_category" => "Gender",  //question string
            "popup_name" => "Patient Name", //question string
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
