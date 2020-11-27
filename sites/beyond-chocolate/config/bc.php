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
        '113130042' => 'IDH - B-Industry v8.0',
        '111510043' => 'IDH - Projects v8.0',
    ],

    'form_url' => 'https://tech-consultancy.akvo.org/akvo-flow-web/idh/',
];
