<?php

return [
  // Source from XLS
  // Need to reconfig, column with label R is Registration, and column with label M is monitoring, so make the config like sible, but data is get from .xls
  "survey_detail" => [
    "instance" => null,
    "geolocation" => [
      "R-GPS location of water point  - Longitude",
      "R-GPS location of water point  - Latitude", 
    ], // GEO loc column name'
    "shapefile" => null, // config
    "shapename" => [
      "sources" => null, // nama kolom data nya
      "match" => null // nama object di geoshape
    ], // data
    "center_map" => [1.3733, 32.2903], // center lat lng of location
    "dataset" => "waterpoints_merged_nonduplicated_nopersonaldata.xlsx", // filename .xls
  ],

  "sources" => [
    [
      "id" => 100000001,
      "type" => "survey",
      "name" => "Waterpoint Uganda",
      "parent_id" => null,
    ],

    [
      "id" => 100000002,
      "type" => "registration",
      "name" => "Registration",
      "parent_id" => 100000001,
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
          "type" => "option",
          "default" => 0,
        ],
        [
          "question_id" => null,
          "question" => "M-Is the water point currently functional?",
          "text" => "Water point functionality",
          "type" => "option",
          "default" => 1,
        ],
        [
          "question_id" => null,
          "question" => "M-Please rate the level of functionality",
          "text" => "Level of functionality",
          "type" => "option",
          "default" => 0,
        ],
        [
          "question_id" => null,
          "question" => "M-What is the status of the filtration system?",
          "text" => "Status of filtration system",
          "type" => "option",
          "default" => 0,
        ],
        [
          "question_id" => null,
          "question" => "M-What is the main purpose for which people use water from this water point?",
          "text" => "Main purpose to use water",
          "type" => "option",
          "default" => 0,
        ],
        [
          "question_id" => null,
          "question" => "M-When were the last water quality tests done?",
          "text" => "Last water quality test",
          "type" => "option",
          "default" => 0,
        ],
        [
          "question_id" => null,
          "question" => "R 2017-Is the water point delivering water?",
          "text" => "Water point deliver water",
          "type" => "option",
          "default" => 0,
        ],
        [
          "question_id" => null,
          "question" => "R 2017-How many households use this water facility ?",
          "text" => "Number of households use this water facility",
          "type" => "number",
          "default" => 0,
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