<?php

return [
  // Source from XLS
  // Need to reconfig, column with label R is Registration, and column with label M is monitoring, so make the config like sible, but data is get from .xls
  "survey_detail" => [
    "instance" => null,
    "geolocation" => null, // No GEO loc column name
    "shapefile" => "kabarole_geoshape_level_04.json", // config
    "shapename" => [
      "sources" => "Sub County", // nama kolom data nya
      "match" => "ADM4_EN" // nama object di geoshape
    ], // data
    "center_map" => [1.3733, 32.2903], // center lat lng of location
    "dataset" => "kabarole_households_2017_clean_v2.csv", // filename .xls
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
      "name" => "Households Sanitation",
      "parent_id" => 200000001,
      // continue setup from here
      "popup_name" => "Sub County", // column name will shown on pop up
      "search" => [ // column name for search by
        "Sub County",
        "Parish",
        "Village of the Household",
        "What is the primary source you get your drinking water from",
      ], 
      "secondary_filter" => [ // column name for second filter
        [
          "question_id" => null,
          "question_text" => "What is the primary source you get your drinking water from",
          "name" => "Water Source Type",
          "type" => "option",
        ],
        [
          "question_id" => null,
          "question_text" => "Sub County",
          "name" => "Households Location",
          "type" => "option",
        ]
      ],
      "list" => [ // column name will show on map
        [
          "question_id" => null,
          "question" => "What type of sanitation facility does household have access to",
          "text" => "Type of sanitation facility",
          "type" => "option",
          "default" => 1,
          "order" => 1,
        ],
        [
          "question_id" => null,
          "question" => "Gender of the Household Head",
          "text" => "Gender of the Household Head",
          "type" => "option",
          "default" => 0,
          "order" => 2,
        ],
        [
          "question_id" => null,
          "question" => "On average how  much time do you use to collect water",
          "text" => "Time to collect Water",
          "type" => "option",
          "default" => 0,
          "order" => 3,
        ],
        [
          "question_id" => null,
          "question" => "Satisf of distance-quality-manag w water service in your area",
          "text" => "Distance quality manage water service",
          "type" => "option",
          "default" => 0,
          "order" => 4,
        ],
        [
          "question_id" => null,
          "question" => "Does the household have access to a sanitation facility",
          "text" => "Access to sanitation facility",
          "type" => "option",
          "default" => 0,
          "order" => 5,
        ],
        // [
        //   "question_id" => null,
        //   "question" => "Approximately how much does water cost you per month",
        //   "text" => "Water cost per month",
        //   "type" => "number",
        //   "default" => 0,
        //   "order" => 6,
        // ],
        // [
        //   "question_id" => null,
        //   "question" => "Number of People in the household",
        //   "text" => "Family numbers",
        //   "type" => "number",
        //   "default" => 0,
        //   "order" => 7,
        // ],
      ],
      "color" => [
        // Type of sanitation
        [
          "question_id" =>  null,
          "question" => "What type of sanitation facility does household have access to",
          "code" => "Conventional Pit Latrine",
          "text" => null,
          "color" => "#F3722C",
          "order" => 1,
        ],
        [
          "question_id" =>  null,
          "question" => "What type of sanitation facility does household have access to",
          "code" => "No Answer",
          "text" => null,
          "color" => "#F94144",
          "order" => 2,
        ],
        [
          "question_id" =>  null,
          "question" => "What type of sanitation facility does household have access to",
          "code" => "Pour flush",
          "text" => null,
          "color" => "#F9C74F",
          "order" => 3,
        ],
        [
          "question_id" =>  null,
          "question" => "What type of sanitation facility does household have access to",
          "code" => "Traditional pit latrine",
          "text" => null,
          "color" => "#90BE6D",
          "order" => 4,
        ],
        [
          "question_id" =>  null,
          "question" => "What type of sanitation facility does household have access to",
          "code" => "VIP latrine",
          "text" => null,
          "color" => "#577590",
          "order" => 5,
        ],
        [
          "question_id" =>  null,
          "question" => "What type of sanitation facility does household have access to",
          "code" => "Waterborne toilet",
          "text" => null,
          "color" => "#43AA8B",
          "order" => 6,
        ],
        // eol Type of sanitation
      ],
      "template" => [
        [ 
          "css" => "stuganda",
          "js" => "stuganda",
        ],
      ],
    ],
  ],
];