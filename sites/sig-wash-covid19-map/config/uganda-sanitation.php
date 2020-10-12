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
    "center_map" => [0.5897, 30.2549], // center lat lng of location
    "dataset" => "kabarole_households_2017_clean_v2.csv", // filename .xls
    "join_column" => [
      [
        "name" => "Status of handwash",
        "sources" => [
          "Is water available for hand washing near sanitation facility",
          "Is soap available for hand washing near sanitation facility",
        ],
        "conditions" => [
          [
            "Is water available for hand washing near sanitation facility" => "Yes", 
            "Is soap available for hand washing near sanitation facility" => "Yes",
            "result" => "Hand washing with soap",
          ],
          [
            "Is water available for hand washing near sanitation facility" => "Yes", 
            "Is soap available for hand washing near sanitation facility" => "No",
            "result" => "Hand washing without soap",
          ],
          [
            "Is water available for hand washing near sanitation facility" => "No", 
            "Is soap available for hand washing near sanitation facility" => null,
            "result" => "No hand washing",
          ],
        ],
      ],
    ],
  ],

  "sources" => [
    [
      "id" => 200000001,
      "type" => "survey",
      "name" => "Sanitation Kabarole",
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
          "question" => "What is the primary source you get your drinking water from",
          "text" => "Drinking water source",
          "type" => "option",
          "default" => 1,
          "order" => 1,
        ],
        [
          "question_id" => null,
          "question" => "Does the household have access to a sanitation facility",
          "text" => "Access to sanitation facility",
          "type" => "option",
          "default" => 0,
          "order" => 2,
        ],
        [
          "question_id" => null,
          "question" => "What type of sanitation facility does household have access to",
          "text" => "Type of sanitation facility",
          "type" => "option",
          "default" => 0,
          "order" => 3,
        ],
        [
          "question_id" => null,
          "question" => "Observe sanitation fac-compound if there is evidence of OD",
          "text" => "Evidence of OD",
          "type" => "option",
          "default" => 0,
          "order" => 4,
        ],
        [
          "question_id" => null,
          "question" => "How satisfied are you with your sanitation facility",
          "text" => "Satisfied with sanitation facility",
          "type" => "option",
          "default" => 0,
          "order" => 5,
        ],
        [
          "question_id" => null,
          "question" => "Status of handwash",
          "text" => "Status of handwash",
          "type" => "option",
          "default" => 0,
          "order" => 6,
        ],
      ],
      "color" => [
        // Status of handwash
        [
          "question_id" =>  null,
          "question" => "Status of handwash",
          "code" => "Hand washing with soap",
          "text" => null,
          "color" => "#28a745",
          "order" => 1,
        ],
        [
          "question_id" =>  null,
          "question" => "Status of handwash",
          "code" => "Hand washing without soap",
          "text" => null,
          "color" => "#FA0",
          "order" => 2,
        ],
        [
          "question_id" =>  null,
          "question" => "Status of handwash",
          "code" => "No hand washing",
          "text" => null,
          "color" => "#dc3545",
          "order" => 3,
        ],
        [
          "question_id" =>  null,
          "question" => "Status of handwash",
          "code" => "Unknown", // following the emptystring value ya
          "text" => null,
          "color" => "#666",
          "order" => 4,
        ],
        // EOL Status of handwash

        // What is the primary source you get your drinking water from
        [
          "question_id" =>  null,
          "question" => "What is the primary source you get your drinking water from",
          "code" => "Protected water source",
          "text" => null,
          "color" => "#28a745",
          "order" => 1,
        ],
        [
          "question_id" =>  null,
          "question" => "What is the primary source you get your drinking water from",
          "code" => "Rain water Harvesting",
          "text" => null,
          "color" => "#FA0",
          "order" => 2,
        ],
        [
          "question_id" =>  null,
          "question" => "What is the primary source you get your drinking water from",
          "code" => "Unprotected water source",
          "text" => null,
          "color" => "#dc3545",
          "order" => 3,
        ],
        // EOL What is the primary source you get your drinking water from

        // Does the household have access to a sanitation facility
        [
          "question_id" =>  null,
          "question" => "Does the household have access to a sanitation facility",
          "code" => "Yes",
          "text" => null,
          "color" => "#28a745",
          "order" => 1,
        ],
        [
          "question_id" =>  null,
          "question" => "Does the household have access to a sanitation facility",
          "code" => "No",
          "text" => null,
          "color" => "#dc3545",
          "order" => 2,
        ],
        // EOL Does the household have access to a sanitation facility

        // Observe sanitation fac-compound if there is evidence of OD
        [
          "question_id" =>  null,
          "question" => "Observe sanitation fac-compound if there is evidence of OD",
          "code" => "No, there is not evidence of OD",
          "text" => "No",
          "color" => "#28a745",
          "order" => 1,
        ],
        [
          "question_id" =>  null,
          "question" => "Observe sanitation fac-compound if there is evidence of OD",
          "code" => "Yes there is evidence of OD",
          "text" => "Yes",
          "color" => "#dc3545",
          "order" => 2,
        ],
        // EOL Observe sanitation fac-compound if there is evidence of OD

        // How satisfied are you with your sanitation facility
        [
          "question_id" =>  null,
          "question" => "How satisfied are you with your sanitation facility",
          "code" => "Satisfied",
          "text" => null,
          "color" => "#28a745",
          "order" => 1,
        ],
        [
          "question_id" =>  null,
          "question" => "How satisfied are you with your sanitation facility",
          "code" => "Dissatisfied",
          "text" => null,
          "color" => "#dc3545",
          "order" => 2,
        ],
        [
          "question_id" =>  null,
          "question" => "How satisfied are you with your sanitation facility",
          "code" => "Unknown",
          "text" => "N/A",
          "color" => "#666",
          "order" => 3,
        ],
        // EOL How satisfied are you with your sanitation facility

        // What type of sanitation facility does household have access to
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
          "code" => "Unknown",
          "text" => "No toilet",
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
        // eol What type of sanitation facility does household have access to
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