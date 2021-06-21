<?php

$endpoint = env('FLOW_API',"https://tech-consultancy.akvotest.org/akvo-flow-web-api");
$method = env('FLOW_API_METHOD', 'update');

return [
    'instances' => ['2scale','seap', 'watershed', 'ssh4a'],
    'upload_image' => $endpoint.'/upload-image',
    'submit' => $endpoint.'/submit-form',
    'form_api' => $endpoint.'/#instance_name/#form_id/'.$method,
    'cascade_api' => $endpoint.'/cascade/seap/#cascade/#level'
];
