<?php

return [
    "forms" => [
        "project" => [
            "fids" => ["102420261"
                       //, "111510043", "143215090"
            ],
            "max_submission" => null,
        ],
        "industry" => [
            "fids" => [
                "114380434", "122170164", "114380235", "110440021", "118270247", "110470073", "104340413", "120260091", "126180526", "108490561"
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
                "survey_id" => 112160321,
                "form_id" => 102420261,
                "question" => [
                    "dependency_to" => 120190033,
                    "group" => 106110313,
                    "repeatable" => true,
                    "member" => 120190029,
                    "contact_name" => 120190031,
                    "contact_email" => 120190030,
                    "comment" => 120190032                ]
            ],
        ]
    ]
];
