<?php

return [
  // Source from XLS
  "survey_detail" => [
    "instance" => null,
    "geolocation" => [
      "--GEOLON--|Longitude",
      "275700981|Latitude", 
    ], // GEO loc column name'
    "shapefile" => null, // config
    "shapename" => [
      "sources" => null, // nama kolom data nya
      "match" => null // nama object di geoshape
    ], // data
    "center_map" => [9.6457, 160.1562], // center lat lng of location
    "dataset" => "DATA_CLEANING-281751019.xlsx", // filename .xls
    "join_column" => null,
  ],

  "sources" => [
    [
      "id" => 271861011,
      "type" => "survey",
      "name" => "WASH in HCF",
      "parent_id" => null,
    ],

    [
      "id" => 281751019,
      "type" => "registration",
      "name" => "WASH in Health Care Facilities_Covid-19",
      "parent_id" => 271861011,
      "popup_name" => "Type of Hospital / Health Facility", // column name will shown on pop up
      "search" => [ // column name for search by
        "Type of Hospital / Health Facility",
      ], 
      "secondary_filter" => [ // column name for second filter
        [
          "question_id" => 265670992,
          "question_text" => "Type of Hospital / Health Facility",
          "name" => "Type of Facility",
          "type" => "option",
        ],
        [
          "question_id" => 260210917,
          // change the excel column name to this value for that question id
          "question_text" => "HCF: Province - Area - Type - Name - NOTE: leave question blank if the answer options do not include the HCF you are currently examining.",
          "name" => "Province",
          "type" => "cascade",
        ]
      ],
      "list" => [ // column name will show on map
        // [
        //   "question_id" => 265670992,
        //   "question" => "Type of Hospital / Health Facility",
        //   "text" => "Type of Facility",
        //   "type" => "option",
        //   "default" => 1,
        //   "order" => 1,
        // ],
        [
          "question_id" => 289810981,
          "question" => "Who is the Managing Authority for this Health facility?",
          "text" => "Facility Author",
          "type" => "option",
          "default" => 1,
          "order" => 2,
        ],
        [
          "question_id" => 275690982,
          "question" => "Does this Health Facility provide child delivery services / conduct the deliveries?",
          "text" => "HCF  provide child delivery services/conduct the deliveries",
          "type" => "option",
          "default" => 0,
          "order" => 3,
        ],
        [
          "question_id" => 265690919,
          "question" => "Does the health facility have a designated labour room/delivery room?",
          "text" => "HCF have a designated labour room/delivery room",
          "type" => "option",
          "default" => 0,
          "order" => 4,
        ],
        [
          "question_id" => 265690920,
          "question" => "Does this facility provide inpatient or outpatient services; or both?",
          "text" => "HCF provide inpatient or outpatient services",
          "type" => "option",
          "default" => 0,
          "order" => 5,
        ],
        [
          "question_id" => 285750980,
          "question" => "What is the main drinking water source in the facility?",
          "text" => "HCF main drinking water source",
          "type" => "option",
          "default" => 0,
          "order" => 6,
        ],
      ],
      "color" => [
        // M-Is the water point currently functional?
        // [
        //   "question_id" =>  null,
        //   "question" => "M-Is the water point currently functional?",
        //   "code" => "Functional in use",
        //   "text" => null,
        //   "color" => "#28a745",
        //   "order" => 1,
        // ],
        // [
        //   "question_id" =>  null,
        //   "question" => "M-Is the water point currently functional?",
        //   "code" => "Functional and not in use",
        //   "text" => null,
        //   "color" => "#FA0",
        //   "order" => 2,
        // ],
        // [
        //   "question_id" =>  null,
        //   "question" => "M-Is the water point currently functional?",
        //   "code" => "Non-Functional",
        //   "text" => null,
        //   "color" => "#dc3545",
        //   "order" => 3,
        // ],
        // [
        //   "question_id" =>  null,
        //   "question" => "M-Is the water point currently functional?",
        //   "code" => "Decommissioned",
        //   "text" => null,
        //   "color" => "#666",
        //   "order" => 4,
        // ],
        // EOL M-Is the water point currently functional?
      ],
      "template" => [
        [ 
          "css" => "sigwashcovid",
          "js" => "sigwashcovid",
        ],
      ],
    ],
  ],
];
