<?php

$path = '/database/sources/';

return [
    'sources' => [
        [
            'fid' => 70650001,
            'file' => $path . '23092020_DD_UI_Input-92080291.csv',
            'kind' => 'Rice',
            'country' => 'Kenya',
            'cascade' => [
                'name' => 'pi_location_cascade_county',
            ]
        ],
        [
            'fid' => 66630001,
            'file' => $path . '23092020_DD_UI_Input_egranary-66630001.csv',
            'kind' => 'Maize',
            'country' => 'Kenya',
            'cascade' => [
                'name' => 'pi_location_cascade_county',
            ]
        ],
    ],
    'variable' =>  [
        'main_crop' => 'f_first_crop',
        'sample' => 'farmer_sample',
        'county' => 'pi_location_cascade_county'
    ]
];
