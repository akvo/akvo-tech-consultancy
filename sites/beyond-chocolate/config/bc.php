<?php
use App\Models\Role;

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
        '113130042' => 'Industry - GISCO',
        '111510043' => 'Projects - GISCO',
        '105640815' => 'C-Retail',
        '111890828' => 'D-Civil Society',
        '134210832' =>  'D-bis-Standard setters',
    ],

    'form_url' => 'https://tech-consultancy.akvotest.org/akvo-flow-web/idh/',

    'saved_form_endpoint' => 'https://tech-consultancy.akvotest.org/akvo-flow-web-api/saved-forms',
];
