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
    "center_map" => [0.5897, 30.2549], // center lat lng of location kabarole
    "dataset" => "waterpoints_merged_nonduplicated_nopersonaldata.xlsx", // filename .xls
    "join_column" => null,
  ],

  "sources" => [
    [
      "id" => 100000001,
      "type" => "survey",
      "name" => "Waterpoint Kabarole",
      "parent_id" => null,
    ],

    [
      "id" => 100000002,
      "type" => "registration",
      "name" => "Waterpoint 2017-2019",
      "parent_id" => 100000001,
      "popup_name" => "R-Water point Name", // column name will shown on pop up
      "search" => [ // column name for search by
        "R-Water point Name",
        "R-Type of water source",
        // "R-Type of lifting device?",
        // "M-Type of water point",
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
          "question" => "R-Type of water source",
          "text" => "Water source type",
          "type" => "option",
          "default" => 1,
          "order" => 1,
        ],
        [
          "question_id" => null,
          "question" => "M-Is the water point currently functional?",
          "text" => "Waterpoint functionality",
          "type" => "option",
          "default" => 0,
          "order" => 2,
        ],
        [
          "question_id" => null,
          "question" => "M-Please rate the level of functionality",
          "text" => "Level of functionality",
          "type" => "option",
          "default" => 0,
          "order" => 3,
        ],
        [
          "question_id" => null,
          "question" => "M-When were the last water quality tests done?",
          "text" => "Last water quality test",
          "type" => "option",
          "default" => 0,
          "order" => 4,
        ],
        [
          "question_id" => null,
          "question" => "R 2017-Is the water point delivering water?",
          "text" => "Waterpoint delivers water",
          "type" => "option",
          "default" => 0,
          "order" => 5,
        ],
        [
          "question_id" => null,
          "question" => "R-Year of water point construction",
          "text" => "Construction year",
          "type" => "number",
          "default" => 0,
          "order" => 6,
        ],
      ],
      "color" => [
        // M-Is the water point currently functional?
        [
          "question_id" =>  null,
          "question" => "M-Is the water point currently functional?",
          "code" => "Functional in use",
          "text" => null,
          "color" => "#28a745",
          "order" => 1,
        ],
        [
          "question_id" =>  null,
          "question" => "M-Is the water point currently functional?",
          "code" => "Functional and not in use",
          "text" => null,
          "color" => "#FA0",
          "order" => 2,
        ],
        [
          "question_id" =>  null,
          "question" => "M-Is the water point currently functional?",
          "code" => "Non-Functional",
          "text" => null,
          "color" => "#dc3545",
          "order" => 3,
        ],
        [
          "question_id" =>  null,
          "question" => "M-Is the water point currently functional?",
          "code" => "Decommissioned",
          "text" => null,
          "color" => "#666",
          "order" => 4,
        ],
        // EOL M-Is the water point currently functional?

        // M-Please rate the level of functionality
        [
          "question_id" =>  null,
          "question" => "M-Please rate the level of functionality",
          "code" => "Fully functioning at 100%",
          "text" => null,
          "color" => "#28a745",
          "order" => 1,
        ],
        [
          "question_id" =>  null,
          "question" => "M-Please rate the level of functionality",
          "code" => "Partially functioning - works with some issues/difficulties",
          "text" => "Partially functioning",
          "color" => "#FA0",
          "order" => 2,
        ],
        [
          "question_id" =>  null,
          "question" => "M-Please rate the level of functionality",
          "code" => "Barely functioning",
          "text" => null,
          "color" => "#dc3545",
          "order" => 3,
        ],
        [
          "question_id" =>  null,
          "question" => "M-Please rate the level of functionality",
          "code" => "Unknown",
          "text" => null,
          "color" => "#666",
          "order" => 4,
        ],
        // EOL M-Please rate the level of functionality

        // M-When were the last water quality tests done?
        [
          "question_id" =>  null,
          "question" => "M-When were the last water quality tests done?",
          "code" => "Less than 3 months ago",
          "text" => null,
          "color" => "#28a745",
          "order" => 1,
        ],
        [
          "question_id" =>  null,
          "question" => "M-When were the last water quality tests done?",
          "code" => "3 months to 1 year ago",
          "text" => null,
          "color" => "#0288d1",
          "order" => 2,
        ],
        [
          "question_id" =>  null,
          "question" => "M-When were the last water quality tests done?",
          "code" => "1 to 5 years ago",
          "text" => null,
          "color" => "#FA0",
          "order" => 3,
        ],
        [
          "question_id" =>  null,
          "question" => "M-When were the last water quality tests done?",
          "code" => "During construction of the water source",
          "text" => null,
          "color" => "#ab47bc",
          "order" => 4,
        ],
        [
          "question_id" =>  null,
          "question" => "M-When were the last water quality tests done?",
          "code" => "Never",
          "text" => null,
          "color" => "#dc3545",
          "order" => 5,
        ],
        [
          "question_id" =>  null,
          "question" => "M-When were the last water quality tests done?",
          "code" => "Unknown",
          "text" => null,
          "color" => "#666",
          "order" => 6,
        ],
        // EOL M-When were the last water quality tests done?

        // R 2017-Is the water point delivering water?
        [
          "question_id" =>  null,
          "question" => "R 2017-Is the water point delivering water?",
          "code" => "Yes",
          "text" => null,
          "color" => "#28a745",
          "order" => 1,
        ],
        [
          "question_id" =>  null,
          "question" => "R 2017-Is the water point delivering water?",
          "code" => "No",
          "text" => null,
          "color" => "#dc3545",
          "order" => 2,
        ],
        [
          "question_id" =>  null,
          "question" => "R 2017-Is the water point delivering water?",
          "code" => "Unknown",
          "text" => null,
          "color" => "#666",
          "order" => 3,
        ],
        // EOL R 2017-Is the water point delivering water?
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
