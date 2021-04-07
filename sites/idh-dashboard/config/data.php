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
            'case_number' => 86,
            'cascade' => [
                'name' => 'pi_location_cascade_county',
            ],
            'files' => [
                ["type" => "raw", "text" => "Analyzed Mwea Rice Data", "to" => ".xlsx" ],
            ],
            'report_url' => '/files/Data-delivery-Mwea.html',
        ],
        [
            'sid' => 66630001,
            'fid' => 70650001,
            'file' => $path . '2020-11-17_DD_UI_Input_egranary.csv',
            'kind' => 'Maize',
            'country' => 'Kenya',
            'company' => 'E-granary',
            'case_number' => 81,
            'cascade' => [
                'name' => 'pi_location_cascade_county',
            ],
            'files' => [
                ["type" => "raw", "text" => "Analyzed E-granary Data", "to" => ".xlsx" ],
            ],
            'report_url' => '/files/Data-delivery-Egranary.html',
        ],
        [
            'sid' => 147070008,
            'fid' => 143920001,
            'file' => $path . '2021-03-23_smart logistics_anom.csv',
            'kind' => 'Beans',
            'country' => 'Kenya',
            'company' => 'Smart Logistics',
            'case_number' => null,
            'cascade' => [
                'name' => 'pi_location_cascade_county',
            ],
            'files' => [
                ["type" => "raw", "text" => "Analyzed Smart Logistics Data", "to" => ".xlsx" ],
            ],
            'report_url' => '',
        ],
        [
            'sid' => 158095822,
            'fid' => 145035285,
            'file' => $path . '2021-04-06_syngenta_potatoes_anom.csv',
            'kind' => 'Potatoes',
            'country' => 'Kenya',
            'company' => 'Syngenta Potatoes',
            'case_number' => null,
            'cascade' => [
                'name' => 'pi_location_cascade_county',
            ],
            'files' => [
                ["type" => "raw", "text" => "Analyzed Syngenta Potatoes Data", "to" => ".xlsx" ],
            ],
            'report_url' => '',
        ],
        [
            'sid' => 131442923,
            'fid' => 139002776,
            'file' => $path . '2021-04-06_syngenta_tomatoes_anom.csv',
            'kind' => 'Tomatoes',
            'country' => 'Kenya',
            'company' => 'Syngenta Tomatoes',
            'case_number' => null,
            'cascade' => [
                'name' => 'pi_location_cascade_county',
            ],
            'files' => [
                ["type" => "raw", "text" => "Analyzed Syngenta Tomatoes Data", "to" => ".xlsx" ],
            ],
            'report_url' => '',
        ],

        // Not Onboard
        // [
        //     'sid' => 110530001,
        //     'fid' => 88820001,
        //     'file' => $path . '2020-11-17_DD_UI_Input_egranary.csv', // need to change this path later
        //     'kind' => 'Tea',
        //     'country' => 'Tanzania',
        //     'company' => 'Rubutco Tea',
        //     'case_number' => null,
        //     'cascade' => [
        //         'name' => 'pi_location_cascade_county',
        //     ],
        //     'files' => [
        //         ["type" => "raw", "text" => "Analyzed Farmer Data", "to" => ".xlsx" ],
        //     ],
        //     'report_url' => '/files/Data-delivery-Rubutco.html',
        // ],
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
