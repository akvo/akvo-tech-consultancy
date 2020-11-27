<?php
use App\Models\Role;

return [
    'permissions' => [
        'submit-survey',
        'manage-user',
        'manage-survey'
    ],

    'roles' => [
        'admin' => [
            'name' => 'Admin',
            'permissions' => [
                'submit-survey',
                'manage-survey',
                'manage-user',
            ]
        ],
        'submitter' => [
            'name' => 'Submitter',
            'permissions' => [
                'submit-survey',
            ]
        ],
    ],

    'questionnaires' => [
        '113130042' => 'Industry - GISCO',
        '111510043' => 'Projects - GISCO',
    ],

    'form_url' => 'https://tech-consultancy.akvo.org/akvo-flow-web/idh/',
];
