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
        '111510043' => 'Projects - GISCO',
        '113130042' => 'B - Industry',
        '105640815' => 'C - Retail',
        '111890828' => 'D - Civil Society (NGOs)',
        '134210832' => 'D - Standard setting organisations',
    ],

    'form_url' => 'https://tech-consultancy.akvotest.org/akvo-flow-web/idh/',

    'saved_form_endpoint' => 'https://tech-consultancy.akvotest.org/akvo-flow-web-api/saved-forms',
];
