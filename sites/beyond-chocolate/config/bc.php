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

    'questionnaires' => [
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

    'form_url' => 'https://tech-consultancy.akvotest.org/akvo-flow-web/'.env('AKVOFLOW_INSTANCE').'/',

    'saved_form_endpoint' => 'https://tech-consultancy.akvotest.org/akvo-flow-web-api/saved-forms',

    'form_url_no_instance' => 'https://tech-consultancy.akvotest.org/akvo-flow-web/',

    
    ## CONFIG for submission uuid scripts
    'forms' => [
        [
            "surveyGroupId" => "116680069",
            "surveyId" => "111510043",
            "name" => "Projects"
        ],
        [
            "surveyGroupId" => "104950081",
            "surveyId" => "113130042",
            "name" => "B Industry"
        ],
        [
            "surveyGroupId" => "93050763",
            "surveyId" => "105640815",
            "name" => "C Retail"
        ],
        [
            "surveyGroupId" => "108870348",
            "surveyId" => "111890828",
            "name" => "D-Civil Society"
        ],
        [
            "surveyGroupId" => "93050740",
            "surveyId" => "134210832",
            "name" => "D-bis-Standard setters"
        ],
        //
        [
            "surveyGroupId" => "144631860",
            "surveyId" => "143215090",
            "name" => "Projects BC"
        ],
        [
            "surveyGroupId" => "143340765",
            "surveyId" => "130990814",
            "name" => "B Industry BC"
        ],
        [
            "surveyGroupId" => "135240618",
            "surveyId" => "143340791",
            "name" => "C Retail BC"
        ],
        [
            "surveyGroupId" => "133020766",
            "surveyId" => "150700609",
            "name" => "D-Civil Society BC"
        ],
        [
            "surveyGroupId" => "146740652",
            "surveyId" => "148430590",
            "name" => "D-bis-Standard setters BC"
        ],
        [
            "surveyGroupId" => "137180055",
            "surveyId" => "150981538",
            "name" => "Pilot-Monitoring des Forum Nachhaltiger Kakao"
        ],

    ],
    'flow_survey_group_id' => env('AKVOFLOW_SURVEY_GROUP_ID'),
    'flow_data_form_instance_url' => $flowDataURL.'form-instances/'.env('AKVOFLOW_INSTANCE').'/' # survey_group_id / survey_id
    ## END OF CONFIG for submission uuid scripts

];
