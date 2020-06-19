<?php

$INSTANCE = env('AKVO_INSTANCE', '');
$BASE_AUTH_URL = 'https://akvo.eu.auth0.com/oauth/token';
$BASE_API_URL = 'https://api-auth0.akvo.org/flow/orgs' . '/' . $INSTANCE;
$BASE_API_FLOW_WEB = env('AKVO_FLOW_WEB_API');

return [
    'instance' => $INSTANCE,
    'clientID' => env('AKVO_CLIENT_ID', ''),
    'username' => env('AKVO_USERNAME'),
    'password' => env('AKVO_PASSWORD'),
    'grantType' => 'password',
    'scope' => 'openid email',
    'endpoints' => [
        'login' => $BASE_AUTH_URL,
        'surveys' => $BASE_API_URL . '/surveys',
        'datapoints' => $BASE_API_URL . '/data_points',
        'forminstances' => $BASE_API_URL . '/form_instances',
        'sync' => $BASE_API_URL . '/sync?initial=true',
        'questions' => $BASE_API_FLOW_WEB . '/' . $INSTANCE, /* /surveyID/update */
        'cascades' => $BASE_API_FLOW_WEB . '/cascade/' .$INSTANCE, /* /sqlite/{parentId} */
    ],
    'cascadeMethod' => env('AKVO_CASCADE_METHOD', 'update'),
    'google_apis' => env('MAPS_GOOGLE_APIS'),
];
