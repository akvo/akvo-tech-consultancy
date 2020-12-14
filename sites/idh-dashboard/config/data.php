<?php

$path = '/database/sources/';

return [
    'notes' => 'https://docs.google.com/spreadsheets/d/1pk8GW-u6KGvTy7RFRtIGzRqIdvroazGJkF0CpYitSl0/edit#gid=0',
    'sources' => [
        [
            'sid' => 84400281,
            'fid' => 92080291,
            'file' => $path . '2020-11-17_DD_UI_Input_mwea.csv',
            'kind' => 'Rice',
            'country' => 'Kenya',
            'company' => 'Mwea Rice',
            'cascade' => [
                'name' => 'pi_location_cascade_county',
            ]
        ],
        [
            'sid' => 66630001,
            'fid' => 70650001,
            'file' => $path . '2020-11-17_DD_UI_Input_egranary.csv',
            'kind' => 'Maize',
            'country' => 'Kenya',
            'company' => 'E-granary',
            'cascade' => [
                'name' => 'pi_location_cascade_county',
            ]
        ],
        [
            'sid' => 110530001,
            'fid' => 88820001,
            'file' => $path . '2020-11-17_DD_UI_Input_egranary.csv', // need to change this path later
            'kind' => 'Rice',
            'country' => 'Tanzania',
            'company' => 'Rubutco Tea',
            'cascade' => [
                'name' => 'pi_location_cascade_county',
            ]
        ],
    ],
    'relations' => [
        [
            'name' => 'f_first_crop',
            'level' => 1,
            'children' => 'f_ownership'
        ],
        [
            'name' => 'f_ownership',
            'level' => 2,
            'children' => 'f_sdm_size'
        ],
    ]
];
