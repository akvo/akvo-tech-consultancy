<?php

$INSTANCE = env('AKVO_INSTANCE', '');
$API_FLOW = env('FLOW_API_URL', '').'/flow/orgs/'.$INSTANCE.'/folders?parentId=0';

return [
    'instance' => $INSTANCE,
    'endpoints' => [
        'fetch_flow' => $API_FLOW,
    ],
];
