<?php

$INSTANCE = env('AKVO_INSTANCE', '');
$API_FLOW = env('FLOW_API_URL', '').'/flow/orgs/'.$INSTANCE.'/folders?parentId=0';
$API_BRIDGE = "https://tech-consultancy.akvo.org/2scale-login/login";
$BASE_AUTH_URL = 'https://akvo.eu.auth0.com/oauth/token';
$BASE_API_URL = env('FLOW_API_URL', '').'/flow/orgs/' . $INSTANCE;
$BASE_API_FLOW_WEB = env('XML_FORM_URL');
$APP_STATUS = env('APP_STATUS', 'test'); 

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
        'questions' => $BASE_API_FLOW_WEB . '/' . $INSTANCE  . '/', /* /surveyID/fetch */
        'cascades' => $BASE_API_FLOW_WEB . '/cascade/' .$INSTANCE . '/', /* /sqlite/{parentId} */
        'form_instances' => $BASE_API_FLOW_WEB . '/form-instance',
        'fetch_flow' => ($APP_STATUS === 'test') ? $API_FLOW : $API_BRIDGE, // TODO:: change to $API_FLOW
    ],
    'cascadeMethod' => env('AKVO_CASCADE_METHOD', 'update')
];
