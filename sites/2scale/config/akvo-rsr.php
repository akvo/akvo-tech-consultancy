<?php

$ROOT_API = env('RSR_API_ROOT', '');

return [
    'token' => env('RSR_TOKEN', ''),
    'endpoints' => [
        'projects' => $ROOT_API . '/project', # /param
        'updates' => $ROOT_API . '/project_update', # /param
        'results' => $ROOT_API . '/results_framework', # /param
        'rsr_page' => 'https://rsr.akvo.org/en/project/', # project_id
    ],
    'home_charts' => [
        # using program rsr result id
        'investment_tracking' => [
            'amount_of_co_financing' => [
                'id' => 48191,
                'name' => 'Private contribution',
            ], # title_id 148, # title id based on result, indicator title id 157 # parent result of this value 48191
            '2scale_contribution' => [
                'id' => 48259,
                'name' => '2SCALE contribution',
            ], # title_id 149, # title id based on result, indicator title id 158 # parent result of this value 48259
        ],
    ],
    'impact_react_charts' => [
        # using program rsr result id
        'food_nutrition_security' => [
            'uii1' => [
                'id' => 42401,
                'name' => 'UII1 - BoP',
            ],
            'uii2' => [
                'id' => 42865,
                'name' => 'UII2 - SHF',
            ],
            'uii3' => [
                'id' => 42698,
                'name' => 'UII3 - EEP',
            ],
        ],
        'private_sector_development' => [
            'uii4' => [
                'id' => 42804,
                'name' => 'UII4 - SME',
            ],
            'uii5' => [
                'id' => 42825,
                'name' => 'UII5 - NONFE',
            ],
            'uii6' => [
                'id' => 42835,
                'name' => 'UII6 - MSME',
            ],
            'uii7' => [
                'id' => 42845,
                'name' => 'UII7 - INNO',
            ],
        ],
        'input_adittionality' => [
            'uii8' => [
                'id' => 42855,
                'name' => 'UII8 - FSERV',
            ],
            'amount_of_co_financing' => [
                'id' => 48191,
                'name' => 'Private contribution',
            ],
            '2scale_contribution' => [
                'id' => 48259,
                'name' => '2SCALE contribution',
            ],
        ],
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
    'organization_form' => [
        'abc_names' => [
            'fid' => 30160001,
            'qids' => [
                'partnership_qid' => 20150001,
                'cluster_qid' => 14180001,
            ],
        ],
        'other_main_partners' => [ // Enterprise Information Form
            'fid' => 30200004,
            'qids' => [
                'partnership_qid' => 36120005,
                'enterprise_qid' => 38120005,
            ],
        ],
        'producer_organization' => [
            'fid' => 14170009,
            'qids' => [
                'partnership_qid' => 36100005,
                'producer_organization_qid' => 38140006,
            ],
        ],
    ],
    'datatables' => [
        // uii 8 & IP-A (Immediate outcome) - ET06_Indigenous Oilseeds_Tsehay MFCU
        'uii8_results_ids' => [42855, 44813, 44856, 43825, 4286, 42861, 42862, 42859, 42856, 42857, 42860, 43951],
        'ui8_dimension_ids' => [2832, 2832, 3005, 2837, 2838, 2839, 2836, 2833, 2834, 2837, 3038],
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