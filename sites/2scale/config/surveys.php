<?php

$INSTANCE = env('AKVO_INSTANCE', '');
$FORM_URL = env('FORM_URL', 'http://localhost:3000') . '/' . $INSTANCE;

return [
    "url" => $FORM_URL,
    "cascade" => "cascade-30100013-v13.sqlite",
    "forms" => array(
        [
        "name" => "M&E Tools",
        "list" => array(
                [
                    "form_id" => 28150013,
                    "name" => "D&D Baseline Forms",
                    "survey_id" => 22120008,
                    "partner_qid"=> 30200015
                ],
                [
                    "form_id" => 20020001,
                    "name" => "Reach and Reaction Form",
                    "survey_id" => 24020001,
                    "partner_qid" => 80001
                ]
            )
        ],
        [
        "name" => "Organisation Forms",
        "list" => array(
            [
                "form_id" => 30160001,
                "name" => "Agri-Business Cluster Form",
                "survey_id" => 20130001,
                "partner_qid" => 20150001
            ],
            [
                "form_id" => 4100001,
                "name" => "Business Support Service",
                "survey_id" => 32110004,
                "partner_qid" => 4100002
            ],
            [
                "form_id" => 30200004,
                "name" => "Enterprise Information Form",
                "survey_id" => 34120004,
                "partner_qid" => 36120005
            ],
            [
                "form_id" => 14170009,
                "name" => "Producer Organization Information Form",
                "survey_id" => 6120005,
                "partner_qid"=> 36100005
            ]
            )
        ],

        // test repeat group -- to delete
        // [
        // "name" => "UII Forms",
        // "list" => array(
        //     [
        //         "form_id" => 27870030,
        //         "name" => "UII-1 BoP",
        //         "survey_id" => 13510021,
        //         "partner_qid" => 20150001
        //     ]
        //     )
        // ],
    ),
    "country_cascade" => "cascade-30100013-v13.sqlite",
    "countries" => array(
        [
            "id" => 1,
            "name" => "burkina faso",
        ],
        [
            "id" => 2,
            "name" => "cote d'ivoire",
        ],
        [
            "id" => 3,
            "name" => "ethiopia",
        ],
        [
            "id" => 4,
            "name" => "ghana",
        ],
        [
            "id" => 5,
            "name" => "kenya",
        ],
        [
            "id" => 6,
            "name" => "mali",
        ],
        [
            "id" => 7,
            "name" => "niger",
        ],
        [
            "id" => 8,
            "name" => "nigeria",
        ],
    ),
];
