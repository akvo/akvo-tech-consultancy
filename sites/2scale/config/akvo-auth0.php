<?php

$INSTANCE = env('AKVO_INSTANCE', '');
$BASE_AUTH_URL = 'https://akvo.eu.auth0.com/oauth/token';
$API_FLOW = 'https://api-auth0.akvotest.org/flow/orgs/'.$INSTANCE.'/folders?parentId=0';

return [
    'instance' => $INSTANCE,
    'endpoints' => [
        'login' => $BASE_AUTH_URL,
        'fetch_flow' => $API_FLOW,
    ],
];
