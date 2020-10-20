<?php

$ROOT_API = env('RSR_API_ROOT', '');

return [
    'token' => env('RSR_TOKEN', ''),
    'endpoints' => [
        'projects' => $ROOT_API . '/project', # /param
        'updates' => $ROOT_API . '/project_update', # /param
        'results' => $ROOT_API . '/results_framework', # /param
    ],
    'charts' => [
        'reachreact' => [
            'form_id' => 20020001,
            'title' => 'Number of Activities Reported'
        ],
        'workstream' => [
            'question_id' => 30120028,
            'title' => 'Link to Work Stream'
        ],
        'program-theme' => [
            'question_id' => 30100022,
            'title' => 'Which program theme(s) is the activity linked to?'
        ],
        'target-audience' => [
            'question_id' => 16050004,
            'title' => 'Target Audience(s)'
        ],
    ],
    'projects' => [
        'parent' => 8759, # 2scale program
        'childs' => [

            'NG' => [ # Nigeria
                'parent' => 8808,
                'childs' => [
                    'NG01' => 9264,
                    'NG09' => 9030,
                    'NG11' => null,
                    'NG12' => 9268,
                    'NG21' => 9351,
                    'NG22' => 9350,
                    'NG23' => 9342,
                    'NG24' => 9360,
                ],
            ], # Nigeria

            'GH' => [ # Ghana
                'parent' => 8761,
                'childs' => [
                    'GH09' => 8833,
                    'GH21' => 9334,
                    'GH22' => 9336,
                ],
            ], # Ghana

            'ET' => [ # Ethiopia
                'parent' => 8804,
                'childs' => [
                    'ET06' => 9009,
                    'ET10' => 9258,
                    'ET21' => 9259,
                    'ET22' => 9281,
                    'ET23' => 9282,
                    'ET24' => 9324,
                    'ET25' => 9326,
                    'ET26' => 9328,
                ],
            ], # Ethiopia

            'CI' => [ # Cote d'Ivoire
                'parent' => 8805,
                'childs' => [
                    'CI21' => 9333,
                    'CI22' => 9335,
                    'CI23' => 9337,
                ],
            ], # Cote d'Ivoire

            'KE' => [ # Kenya
                'parent' => 8806,
                'childs' => [
                    'KE11' => 9206,
                    'KE21' => 9230,
                    'KE22' => 9254,
                    'KE23' => 9255,
                    'KE24' => 9257,
                    'KE25' => 9256,
                    'KE26' => 9329,
                    'KE27' => 9330,
                    'KE28' => 9331,
                    'KE29' => 9332,
                ],
            ], # Kenya
            
            'ML' => [ # Mali
                'parent' => 8807,
                'childs' => [
                    'ML05' => 9227,
                    'ML21' => 9243,
                    'ML22' => 9251,
                    'ML23' => 9325,
                    'ML24' => 9346,
                ],
            ], # Mali
            
            'NE' => [ # Niger
                'parent' => 8809,
                'childs' => [
                    'NE21' => null,
                    'NE22' => 9276,
                    'NE23' => 9277,
                    'NE24' => null,
                    'NE25' => 9353,
                    'NE26' => 9355,
                    'NE27' => 9356,
                ],
            ], # Niger
            
            'BF' => [ # Burkina Faso
                'parent' => 8760,
                'childs' => [
                    'BF21' => 9266,
                    'BF22' => 9269,
                    'BF23' => null,
                    'BF24' => 9340,
                    'BF25' => 9348,
                ],
            ], # Burkina Faso
        ],
    ],
];