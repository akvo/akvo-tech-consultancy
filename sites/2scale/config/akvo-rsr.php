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

            'NG' => [ # Nigeria
                'parent' => 8808,
                'childs' => [
                    'NG01' => null,
                    'NG09' => null,
                    'NG11' => null,
                    'NG12' => null,
                    'NG21' => null,
                    'NG22' => null,
                    'NG23' => null,
                    'NG24' => null,
                ],
            ], # Nigeria

            'GH' => [ # Ghana
                'parent' => 8761,
                'childs' => [
                    'GH09' => null,
                    'GH21' => null,
                    'GH22' => null,
                ],
            ], # Ghana

            'ET' => [ # Ethiopia
                'parent' => 8804,
                'childs' => [
                    'ET06' => 9009,
                    'ET10' => 9258,
                    'ET21' => 9259,
                    'ET22' => null,
                    'ET23' => null,
                    'ET24' => null,
                    'ET25' => null,
                    'ET26' => null,
                ],
            ], # Ethiopia

            'CI' => [ # Cote d'Ivoire
                'parent' => 8805,
                'childs' => [
                    'CI21' => null,
                    'CI22' => null,
                    'CI23' => null,
                ],
            ], # Cote d'Ivoire

            'KE' => [ # Kenya
                'parent' => 8806,
                'childs' => [
                    'KE11' => null,
                    'KE21' => 9230,
                    'KE22' => 9254,
                    'KE23' => 9255,
                    'KE24' => null,
                    'KE25' => 9256,
                    'KE26' => null,
                    'KE27' => null,
                    'KE28' => null,
                    'KE29' => null,
                ],
            ], # Kenya
            
            'ML' => [ # Mali
                'parent' => 8807,
                'childs' => [
                    'ML05' => 9227,
                    'ML21' => 9243,
                    'ML22' => 9251,
                    'ML23' => null,
                    'ML24' => null,
                ],
            ], # Mali
            
            'NE' => [ # Niger
                'parent' => 8809,
                'childs' => [
                    'NE21' => null,
                    'NE22' => null,
                    'NE23' => null,
                    'NE24' => null,
                    'NE25' => null,
                    'NE26' => null,
                    'NE27' => null,
                ],
            ], # Niger
            
            'BF' => [ # Burkina Faso
                'parent' => 8760,
                'childs' => [
                    'BF21' => null,
                    'BF22' => null,
                    'BF23' => null,
                    'BF24' => null,
                    'BF25' => null,
                ],
            ], # Burkina Faso
        ],
    ],
];