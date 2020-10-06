<?php

$path = '/database/sources/';

return [
    'notes' => 'https://docs.google.com/spreadsheets/d/1pk8GW-u6KGvTy7RFRtIGzRqIdvroazGJkF0CpYitSl0/edit#gid=0',
    'sources' => [
        [
            'fid' => 70650001,
            'file' => $path . '23092020_DD_UI_Input-92080291_v2.csv',
            'kind' => 'Rice',
            'country' => 'Kenya',
            'company' => 'Mwea Rice',
            'cascade' => [
                'name' => 'pi_location_cascade_county',
            ]
        ],
        [
            'fid' => 66630001,
            'file' => $path . '23092020_DD_UI_Input_egranary-66630001_v2.csv',
            'kind' => 'Maize',
            'country' => 'Kenya',
            'company' => 'E-granary',
            'cascade' => [
                'name' => 'pi_location_cascade_county',
            ]
        ],
    ]
];
