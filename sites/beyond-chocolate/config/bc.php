<?php
use App\Models\Role;

$flowDataURL = 'https://flow-data.tc.akvo.org/api/';

return [
    'credentials' => [
        'user' => env('USER_PWD'),
        'api' => env('API_PWD'),
    ],

    'permissions' => [
        'submit-survey',
        'manage-users',
        'manage-surveys'
    ],

    'roles' => [
        'submitter' => [
            'name' => 'Submitter',
            'permissions' => [
                'submit-survey',
            ]
        ],
        'admin' => [
            'name' => 'Admin',
            'permissions' => [
                'submit-survey',
                'manage-surveys',
                'manage-users',
            ]
        ],
    ],

    'idh_questionnaires' => [
        '111510043' => 'Projects - GISCO',
        '113130042' => 'B - Industry',
        '105640815' => 'C - Retail',
        '111890828' => 'D - Civil Society (NGOs)',
        '134210832' => 'D - Standard setting organisations',
        //
        '143215090' => 'Projects - Beyond Chocolate',
        '130990814' => 'B - Industry - Beyond Chocolate',
        '143340791' => 'C - Retail - Beyond Chocolate',
        '150700609' => 'D - Civil Society (NGOs) - Beyond Chocolate',
        '148430590' => 'D - Standard setting organisations - Beyond Chocolate',
        '150981538' => 'Pilot-Monitoring des Forum Nachhaltiger Kakao',
    ],

    'questionnaires' => [
        '102420261' => 'Projects',
        '114380434' => 'Master Beyond Chocolate Standard setting organisations',
        '122170164' => 'Member Beyond Chocolate Industry including Brands',
        '114380235' => 'Member Beyond Chocolate Retail',
        '110440021' => 'Member GISCO Industry including Brands',
        '118270247' => 'Member GISCO NGOs and other member types',
        '110470073' => 'Member GISCO Retail',
        '104340413' => 'Member GISCO Standard setting organisation',
        '120260091' => 'Member GISCO Beyond Chocolate Industry including Brands',
        '126180526' => 'Member GISCO Beyond Chocolate Retail',
        '108490561' => 'Member GISCO Beyond Chocolate Standard setting organisation',
    ],

    'form_url' => 'https://tech-consultancy.akvotest.org/akvo-flow-web/'.env('AKVOFLOW_INSTANCE').'/',

    'saved_form_endpoint' => 'https://tech-consultancy.akvotest.org/akvo-flow-web-api/saved-forms',

    'form_url_no_instance' => 'https://tech-consultancy.akvotest.org/akvo-flow-web/',

    'idh_forms' => [111510043,
                    113130042,
                    105640815,
                    111890828,
                    134210832,
                    143215090,
                    130990814,
                    143340791,
                    150700609,
                    148430590,
                    150981538],

    'forms' => [
        // PROJECTS
        [
            "surveyGroupId" => "112160321",
            "surveyId" => "102420261",
            "name" => "Projects"
        ],

        // BEYOND CHOCOLATE
        [
            "surveyGroupId" => "120270432",
            "surveyId" => "114380434",
            "name" => "Member Beyond Chocolate Standard setting organisations"
        ],
        [
            "surveyGroupId" => "130170212",
            "surveyId" => "122170164",
            "name" => "Member Beyond Chocolate Industry including Brands"
        ],
        [
            "surveyGroupId" => "124330225",
            "surveyId" => "114380235",
            "name" => "Member Beyond Chocolate Retail"
        ],
        // GISCO
        [
            "surveyGroupId" => "106130008",
            "surveyId" => "110440021",
            "name" => "Member GISCO Industry including Brands"
        ],
        [
            "surveyGroupId" => "118310283",
            "surveyId" => "118270247",
            "name" => "Member GISCO NGOs and other member types"
        ],
        [
            "surveyGroupId" => "124320060",
            "surveyId" => "110470073",
            "name" => "Member GISCO Retail"
        ],
        [
            "surveyGroupId" => "118300316",
            "surveyId" => "104340413",
            "name" => "Member GISCO Standard setting organisation"
        ],

        // GISCO && BC
        [
            "surveyGroupId" => "118290120",
            "surveyId" => "120260091",
            "name" => "Member GISCO Beyond Chocolate Industry including Brands"
        ],
        [
            "surveyGroupId" => "104350552",
            "surveyId" => "126180526",
            "name" => "Member GISCO Beyond Chocolate Retail"
        ],
        [
            "surveyGroupId" => "124310405",
            "surveyId" => "108490561",
            "name" => "Member GISCO Beyond Chocolate Standard setting organisation"
        ],

        // [
        //     "surveyGroupId" => "116680069",
        //     "surveyId" => "111510043",
        //     "name" => "Projects"
        // ],
        // [
        //     "surveyGroupId" => "104950081",
        //     "surveyId" => "113130042",
        //     "name" => "B Industry"
        // ],
        // [
        //     "surveyGroupId" => "93050763",
        //     "surveyId" => "105640815",
        //     "name" => "C Retail"
        // ],
        // [
        //     "surveyGroupId" => "108870348",
        //     "surveyId" => "111890828",
        //     "name" => "D-Civil Society"
        // ],
        // [
        //     "surveyGroupId" => "93050740",
        //     "surveyId" => "134210832",
        //     "name" => "D-bis-Standard setters"
        // ],
        // //
        // [
        //     "surveyGroupId" => "144631860",
        //     "surveyId" => "143215090",
        //     "name" => "Projects BC"
        // ],
        // [
        //     "surveyGroupId" => "143340765",
        //     "surveyId" => "130990814",
        //     "name" => "B Industry BC"
        // ],
        // [
        //     "surveyGroupId" => "135240618",
        //     "surveyId" => "143340791",
        //     "name" => "C Retail BC"
        // ],
        // [
        //     "surveyGroupId" => "133020766",
        //     "surveyId" => "150700609",
        //     "name" => "D-Civil Society BC"
        // ],
        // [
        //     "surveyGroupId" => "146740652",
        //     "surveyId" => "148430590",
        //     "name" => "D-bis-Standard setters BC"
        // ],
        // [
        //     "surveyGroupId" => "137180055",
        //     "surveyId" => "150981538",
        //     "name" => "Pilot-Monitoring des Forum Nachhaltiger Kakao"
        // ],

    ],
    'flow_projects_survey_group_id' => env('AKVOFLOW_PROJECTS_SURVEY_GROUP_ID'),
    'flow_data_form_instance_url' => $flowDataURL.'form-instances/'.env('AKVOFLOW_INSTANCE').'/' # survey_group_id / survey_id
    ## END OF CONFIG for submission uuid scripts

];
