<?php

return [
    "forms" => [
        "project" => [
            "fids" => ["120190025", "122170164"
                       //, "111510043", "143215090"
            ],
            "max_submission" => null,
        ],
        "industry" => [
            "fids" => [
                "113130042", "105640815", "111890828", "134210832",
                "130990814", "143340791", "150700609", "148430590",
                "150981538",
            ],
            "max_submission" => 1,
        ],
    ],
    "exception" => [
        "organization" => [
            "name" => ["staff akvo", "staff gisco secretariat"],
            // "ids" => [78, 74],
            "ids" => [],
        ],
    ],
    "surveys" => [
        "project" => [
            [
                "survey_id" => 116680069,
                "form_id" => 111510043,
                "question" => [
                    "dependency_to" => 124260137,
                    "group" => 95530076,
                    "repeatable" => true,
                    "member" => 89980334,
                    "contact_name" => 124680005,
                    "contact_email" => 81610060,
                    "comment" => 124750055
                ]
            ],
        ]
    ]
];
