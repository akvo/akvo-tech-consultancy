<?php

return [
    "survey_detail" => [
        "instance" => "sig",
        "survey_id" => 22510943,
        "form_id" => 24520921,
        "monitoring_id" => [],
        "survey_name" => "SIBLE Baseline",
        "geolocation" => "26390930|Please take the geo-location of the school",  //questionId|question  string
        "center_map" => [9.6457, 160.1562],
    ], 

    "categories" => [
        24520921 => [
            "selected_category" => "Type of School?",  //question string
            "popup_name" => "Name of School?", //question string
            "list" => [
                [
                    "question_id" => 23430921,
                    "name" => "Type of School?",
                    "type" => "option",
                ],
                [
                    "question_id" => 26380944,
                    "name" => "Does the school have a water source?",
                    "type" => "option",
                ],
                [
                    "question_id" => 22490945,
                    "name" => "Does the school have toilets?",
                    "type" => "option",
                ],
                [
                    "question_id" => 29370948,
                    "name" => "Are there hand washing facilities at the school?",
                    "type" => "option",
                ],
                [
                    "question_id" => 26380948,
                    "name" => "Does the school have parent/teachers meeting?",
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
                    "css" => "sible",
                    "js" => "sible",
                ],
            ],
        ],
    ],
];
