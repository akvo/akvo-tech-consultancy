<?php

$INSTANCE = env('AKVO_INSTANCE', '');
$BASE_AUTH_URL = 'https://login.akvo.org';
$BASE_API_URL = 'https://api.akvo.org/flow/orgs' . '/' . $INSTANCE;

return [
    'instance' => env('AKVO_INSTANCE', ''),
    'keycloak_user' => env('KEYCLOAK_USER', ''),
    'keycloak_pwd' => env('KEYCLOAK_PWD', ''),

    'endpoints' => [
        'login' => $BASE_AUTH_URL . '/auth/realms/akvo/protocol/openid-connect/token',
        'surveys' => $BASE_API_URL . '/surveys',
        'folders' => $BASE_API_URL . '/folders',
        'datapoints' => $BASE_API_URL . '/form_instances/'
    ]
];