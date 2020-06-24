<?php

return [
    "survey_detail" => [
        "instance" => "seap",
        "survey_id" => 308090988,
        "form_id" => 308090989,
        "monitoring_id" => [322230993],
        "survey_name" => "Demo Flow Survey",
        "geolocation" => "312080978|Geolocation",  //questionId|question  string
        "center_map" => [9.6457, 160.1562],
    ], 

    "categories" => [
        308090989 => [
            "selected_category" => "Gender", //question string
            "popup_name" => "Gender", //question string
            "list" => [
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
                    "question_id" =>  287530944,
                    "code" => "",
                    "color" => "",
                ],
            ],
            "template" => [
                [ 
                    "html" => "",
                    "js" => "",
                ],
            ],
        ],
        322230993 => [
            "selected_category" => "Test Location", //question string
            "popup_name" => "Test Location", //question string
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
