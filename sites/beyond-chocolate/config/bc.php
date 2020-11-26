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
];
