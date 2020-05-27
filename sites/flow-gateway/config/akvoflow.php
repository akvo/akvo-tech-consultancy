<?php

$endpoint = env('FLOW_API',"https://tech-consultancy.akvotest.org/akvo-flow-web-api");

return [
    'instances' => ['2scale','seap', 'watershed'],
    'upload_image' => $endpoint.'/upload-image',
    'submit' => $endpoint.'/submit-form',
    'form_api' => $endpoint.'/#instance_name/#form_id/fetch',
    'cascade_api' => $endpoint.'/cascade/seap/#cascade/#level'
];
