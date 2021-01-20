<?php
use App\Models\Role;

$flowDataURL = 'https://flow-data.tc.akvo.org/api/';

return [
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
    ],

    'form_url' => 'https://tech-consultancy.akvotest.org/akvo-flow-web/idh/',

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
    ],

    'flow_data_form_instance_url' => $flowDataURL.'form-instances/idh/' # survey_group_id / survey_id
    ## END OF CONFIG for submission uuid scripts

];
