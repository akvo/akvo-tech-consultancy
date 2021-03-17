<?php

$path = '/database/sources/';

return [
    'notes' => 'https://docs.google.com/spreadsheets/d/1pk8GW-u6KGvTy7RFRtIGzRqIdvroazGJkF0CpYitSl0/edit#gid=0',
    'sources' => [
        [
            'sid' => 84400281,
            'fid' => 92080291,
            'file' => $path . '23092020_DD_UI_Input-92080291_v2.csv',
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
            'file' => $path . '23092020_DD_UI_Input_egranary-66630001_v2.csv',
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
            'file' => $path . 'file.csv', // need to change this path later
            'kind' => 'Tea',
            'country' => 'Tanzania',
            'company' => 'Rubutco Tea',
            'cascade' => [
                'name' => 'pi_location_cascade_county',
            ]
        ],
        [
            'sid' => 147070008,
            'fid' => 143920001,
            'file' => $path . 'file.csv', // need to change this path later
            'kind' => 'Beans',
            'country' => 'Kenya',
            'company' => 'Smart Logistics',
            'cascade' => [
                'name' => 'pi_location_cascade_county',
            ]
        ],
    ]
];
