<?php

return [
    "survey_detail" => [
        "instance" => "watershed",
        "geolocation" => "13410011|GPS",  //questionId|question  string
        "center_map" => [1.3733, 32.2903],
    ], 

    "sources" => [
        [
            "id" => 13380007,
            "type" => "survey",
            "name" => "Water point and WUC",
            "parent_id" => null,
        ],
        [
            "id" => 15380043,
            "type" => "registration",
            "name" => "Water point and WUC",
            "parent_id" => 13380007,
            "selected_category" => "Type of Water Facility", //question string
            "popup_name" => "Name of Water point", //question string
            "search" => ["Type of Water Facility", "Name of Water point"], // question array of string
            "secondary_filter" => [
              [
                "question_id" => 13270842,
                "name" => "Province",
              ],
              [
                "question_id" => 14260395,
                "name" => "Water Facility Type",
              ],
            ],
            "list" => [
                // General Information
                [
                  "question_id" => 18230067,
                  "name" => "Estimated  Number of Households in the village",
                  "type" => "number",
                ],
                [
                  "question_id" => 13270842,
                  "name" => "Select Sub County /Town Council",
                  "type" => "option",
                ],
                [
                  "question_id" => 17410023,
                  "name" => "Is there an improved Water source for the village?",
                  "type" => "option",
                ],
                [
                  "question_id" => 13550404,
                  "name" => "Name of Water point",
                  "type" => "text",
                ],
                [
                  "question_id" => 18230069,
                  "name" => "What is the alternative source of water for the community?",
                  "type" => "option",
                ],

                // Water Point Data
                [
                    "question_id" => 14260395,
                    "name" => "Type of Water Facility",
                    "type" => "option",
                ],
                [
                  "question_id" => 10410201,
                  "name" => "Name of Piped scheme serving this tap",
                  "type" => "text",
                ],
                [
                  "question_id" => 19300046,
                  "name" => "How long ago was it constructed?",
                  "type" => "option",
                ],
                [
                  "question_id" => 15380048,
                  "name" => "In the last one year, was water facility ever been rehabilitated?",
                  "type" => "option",
                ],
                [
                  "question_id" => 18200092,
                  "name" => "Is the water point delivering water?",
                  "type" => "option",
                ],
                [
                  "question_id" => 15390046,
                  "name" => "In the last one year, was the water facility ever broken down for more than a day?",
                  "type" => "option",
                ],
                [
                  "question_id" => 18230054,
                  "name" => "How many times was the water facility out of service in the past one year.",
                  "type" => "option",
                ],
                [
                  "question_id" => 12450053,
                  "name" => "How many days did the last breakdown last?",
                  "type" => "option",
                ],
                [
                  "question_id" => 12460044,
                  "name" => "Does the quality of water change depending on the season or time of the day?",
                  "type" => "option",
                ],
                [
                  "question_id" => 14330049,
                  "name" => "What is the major reason for the breakdown?",
                  "type" => "option",
                ],
                [
                  "question_id" => 10440047,
                  "name" => "Does the yield of the water source change depending on the season?",
                  "type" => "option",
                ],
                [
                  "question_id" => 10440048,
                  "name" => "In the last year, was the water source affected by flooding or landslides?",
                  "type" => "option",
                ],
                [
                  "question_id" => 16340089,
                  "name" => "How long does it take to fill a 20 Litre Jerrycan",
                  "type" => "option",
                ],

                // Management of water facility
                [
                  "question_id" => 14260399,
                  "name" => "Is there a water and sanitation ( WSC/WUC) committee",
                  "type" => "option",
                ],
                [
                  "question_id" => 17360054,
                  "name" => "Number of Women on the WSC/WUC",
                  "type" => "number",
                ],
                [
                  "question_id" => 13390055,
                  "name" => "How many households use this water facility ?",
                  "type" => "number",
                ],
                [
                  "question_id" => 14330052,
                  "name" => "Do  users pay for water?",
                  "type" => "option",
                ],
                [
                  "question_id" => 10440051,
                  "name" => "What is the common mode of payment used?",
                  "type" => "option",
                ],
                [
                  "question_id" => 10290182,
                  "name" => "Does the WUC keep financial records on Income and Expenditure?",
                  "type" => "option",
                ],
            ],
            "color" => [
                [
                    "question_id" =>  14260395,
                    "code" => "1", // Protected Spring
                    "color" => "",
                ],
                [
                  "question_id" =>  14260395,
                  "code" => "2", // Deep Borehole
                  "color" => "",
                ],
                [
                  "question_id" =>  14260395,
                  "code" => "3", // Shallow Well
                  "color" => "",
                ],
                [
                  "question_id" =>  14260395,
                  "code" => "4", // Tap stand
                  "color" => "",
                ],
                [
                  "question_id" =>  14260395,
                  "code" => "5", // Rain Water Harvesting Tank
                  "color" => "",
                ],
            ],
            "template" => [
                [ 
                    "css" => "wpwuc",
                    "js" => "wpwuc",
                ],
            ],
        ],
    ],
];
