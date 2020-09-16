<?php

$ROOT_API = env('RSR_API_ROOT', '');

return [
    'token' => env('RSR_TOKEN', ''),
    'endpoints' => [
        'projects' => $ROOT_API . '/project', # /param
        'updates' => $ROOT_API . '/project_update', # /param
        'results' => $ROOT_API . '/results_framework_lite', # /param
    ],
    'projects' => [
        'parent' => 8759, # 2scale program
        'childs' => [
            'NG' => 8808, # Nigeria
            'GH' => 8761, # Ghana
            'ET' => 8804, # Ethiopia
            'CI' => 8805, # Cote d'Ivoire
            'KE' => 8806, # Kenya
            'ML' => 8807, # Mali
            'NE' => 8809, # Niger
            'BF' => null, # Burkina Faso
        ],
    ],
];