<?php

return [
  // Source from XLS
  // Need to reconfig, column with label R is Registration, and column with label M is monitoring, so make the config like sible, but data is get from .xls
  "survey_detail" => [
    "instance" => "seap",
    "geolocation" => null, // No GEO loc column name
    "shapefile" => null, // config
    "shapename" => [
      "sources" => "Sub County", // nama kolom data nya
      "match" => "ADM4_EN" // nama object di geoshape
    ], // data
    "center_map" => [1.3733, 32.2903], // center lat lng of location
    "dataset" => "kabarole_households_2017_clean.csv", // filename .xls
  ],

  "sources" => [
    [
      "id" => 200000001,
      "type" => "survey",
      "name" => "Sanitation Uganda",
      "parent_id" => null,
    ],

    [
      "id" => 200000002,
      "type" => "registration",
      "name" => "Registration",
      "parent_id" => 200000001,
      // continue setup from here
      "popup_name" => "R-Water point Name", // column name will shown on pop up
      "search" => [ // column name for search by
        "R-Water point Name",
        "R-Type of water source",
        "R-Type of lifting device?",
        "M-Type of water point",
      ], 
      "secondary_filter" => [ // column name for second filter
        [
          "question_id" => null,
          "question_text" => "R-Type of water source",
          "name" => "Water Source Type",
          "type" => "option",
        ],
        [
          "question_id" => null,
          "question_text" => "R-Location of water point - S.C./T.C.",
          "name" => "Water Point Location",
          "type" => "option",
        ]
      ],
      "list" => [ // column name will show on map
        [
          "question_id" => null,
          "question" => "R-Has this water point had a major rehabilitation since the initial construction?",
          "text" => "Major rehabilitation",
        ],
        [
          "question_id" => null,
          "question" => "M-Is the water point currently functional?",
          "text" => "Water point functionality",
        ],
        [
          "question_id" => null,
          "question" => "M-Please rate the level of functionality",
          "text" => "Level of functionality",
        ],
        [
          "question_id" => null,
          "question" => "M-What is the status of the filtration system?",
          "text" => "Status of filtration system",
        ],
        [
          "question_id" => null,
          "question" => "M-What is the main purpose for which people use water from this water point?",
          "text" => "Main purpose to use water",
        ],
        [
          "question_id" => null,
          "question" => "M-When were the last water quality tests done?",
          "text" => "Last water quality test",
        ],
        [
          "question_id" => null,
          "question" => "R 2017-Is the water point delivering water?",
          "text" => "Water point deliver water",
        ],
      ],
      "color" => [
        [
          "question_id" =>  null,
          "question" => "R-Has this water point had a major rehabilitation since the initial construction?",
          "code" => "No",
          "text" => null,
          "color" => "#dc3545",
        ],
        [
          "question_id" =>  null,
          "question" => "R-Has this water point had a major rehabilitation since the initial construction?",
          "code" => "Yes",
          "text" => null,
          "color" => "#28a745",
        ],
        [
          "question_id" =>  null,
          "question" => "R-Has this water point had a major rehabilitation since the initial construction?",
          "code" => "Unknown", // must be complete option text
          "text" => "Not Defined", // new option text 
          "color" => "#ab47bc",
        ],
      ],
      "template" => [
        [ 
          "css" => "wpuganda",
          "js" => "wpuganda",
        ],
      ],
    ],
  ],
];