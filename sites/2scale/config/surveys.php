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
        [
        "name" => "Universal Impact Indicators",
        "list" => array(
                [
                    "form_id" => 27870030,
                    "name" => "UII-1 BoP Form",
                    "survey_id" => 13510021,
                    "partner_qid" => 27850027
                ],
                [
                    "form_id" => 40200005,
                    "name" => "UII-2 SHF Form",
                    "survey_id" => 11320004,
                    "partner_qid" => 13510004
                ],
                [
                    "form_id" => 9420001,
                    "name" => "UII-3 EEP Form",
                    "survey_id" => 46010002,
                    "partner_qid" => 9400081
                ],
                [
                    "form_id" => 23430004,
                    "name" => "UII-4 SME Form",
                    "survey_id" => 17800004,
                    "partner_qid" => 27830006
                ],
                [
                    "form_id" => 5940009,
                    "name" => "UII-5 NonFE Form",
                    "survey_id" => 13510014,
                    "partner_qid" => 40200020
                ],
                [
                    "form_id" => 44050108,
                    "name" => "UII-6 MSME Form",
                    "survey_id" => 27870022,
                    "partner_qid" => 27840013
                ],
                [
                    "form_id" => 39710036,
                    "name" => "UII-7 INNO Form",
                    "survey_id" => 27850023,
                    "partner_qid" => 39710037
                ],
                [
                    "form_id" => 33930043,
                    "name" => "UII-8 F-SERV Form",
                    "survey_id" => 58060038,
                    "partner_qid" => 56120027
                ]
        )]
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
