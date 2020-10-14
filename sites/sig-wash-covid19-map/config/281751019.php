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
        [
          "question_id" => 285750980,
          "question" => "What is the main drinking water source in the facility?",
          "text" => "Main drinking water source",
          "type" => "option",
          "default" => 1,
          "order" => 1,
        ],
        [
          "question_id" => 285741002,
          "question" => "Is the main water source functioning on the day of visit? (meaning water is flowing into the pipes and taps on the day of visit)",
          "text" => "Main water source founctioning",
          "type" => "option",
          "default" => 0,
          "order" => 2,
        ],
        [
          "question_id" => 275690986,
          "question" => "Where is the HCF main water source located?",
          "text" => "HCF main water source located",
          "type" => "option",
          "default" => 0,
          "order" => 3,
        ],
        [
          "question_id" => 259791023,
          "question" => "Are these separate for men and women?",
          "text" => "Men and woman toilet separated",
          "type" => "option",
          "default" => 0,
          "order" => 4,
        ],
        [
          "question_id" => 281741006,
          "question" => "What type of toilets does the facility have/use?",
          "text" => "Type of toilets",
          "type" => "option",
          "default" => 0,
          "order" => 5,
        ],
        [
          "question_id" => 267630980,
          "question" => "Are all toilets functioning at the time of the survey?",
          "text" => "Toilet functioning",
          "type" => "option",
          "default" => 0,
          "order" => 6,
        ],
        [
          "question_id" => 285741007,
          "question" => "Does the toilet provide separate bins for menstrual waste?",
          "text" => "Toilet provide separate bins for menstrual waste",
          "type" => "option",
          "default" => 0,
          "order" => 7,
        ],
        [
          "question_id" => 263701011,
          "question" => "Does the HCF provide incinerators for menstrual waste?",
          "text" => "HCF provide incinerators for menstrual waste",
          "type" => "option",
          "default" => 0,
          "order" => 8,
        ],
        [
          "question_id" => 283691020,
          "question" => "Who is this toilet designated for?",
          "text" => "Toilet designated for",
          "type" => "option",
          "default" => 0,
          "order" => 9,
        ],
        [
          "question_id" => 263721025,
          "question" => "Does this toilet meet the needs of people with reduced mobility? (People living with disabilities)",
          "text" => "Toilet meet the needs of people with reduced mobility",
          "type" => "option",
          "default" => 0,
          "order" => 10,
        ],
        [
          "question_id" => 265690930,
          "question" => "Is there water available in the delivery room at the time of the survey?",
          "text" => "Water available in the delivery room",
          "type" => "option",
          "default" => 0,
          "order" => 11,
        ],
        [
          "question_id" => 263711003,
          "question" => "What is the source of water in the delivery room?",
          "text" => "Source of water in the delivery room",
          "type" => "multiple",
          "default" => 0,
          "order" => 12,
        ],
        [
          "question_id" => 263721026,
          "question" => "Is there a latrine / toilet available for use by women during and after labour and childbirth?",
          "text" => "Latrine / toilet available for use by women during and after labour and childbirth",
          "type" => "option",
          "default" => 0,
          "order" => 13,
        ],
        [
          "question_id" => 285750992,
          "question" => "Is that toilet/latrine functional?",
          "text" => "Toilet / latrine functional",
          "type" => "option",
          "default" => 0,
          "order" => 14,
        ],
        [
          "question_id" => 253651020,
          "question" => "Is the toilet/latrine accessible to women in labour?",
          "text" => "Toilet / latrine accessible to women in labour",
          "type" => "option",
          "default" => 0,
          "order" => 15,
        ],
        [
          "question_id" => 275701004,
          "question" => "Is at least one functional handwashing station in the delivery room?",
          "text" => "Functional handwashing station in the delivery room",
          "type" => "option",
          "default" => 0,
          "order" => 16,
        ],
        [
          "question_id" => 277740991,
          "question" => "Is a designated area for women to shower or bathe during/after labour available?",
          "text" => "Area for women to shower or bathe during/after labour available",
          "type" => "option",
          "default" => 0,
          "order" => 17,
        ],
        [
          "question_id" => 285750995,
          "question" => "is the shower functional?",
          "text" => "Shower functional",
          "type" => "option",
          "default" => 0,
          "order" => 18,
        ],
        [
          "question_id" => 281741010,
          "question" => "Are the basic sterile resources required for a clean delivery available in the delivery room?",
          "text" => "Basic sterile resources required for a clean delivery available in the delivery room",
          "type" => "option",
          "default" => 0,
          "order" => 19,
        ],
        [
          "question_id" => 281741011,
          "question" => "Are basic standard written policies and protocols available within the facility relating to cleaning the delivery room?",
          "text" => "Basic standard written policies and protocols available within the facility relating to cleaning the delivery room",
          "type" => "option",
          "default" => 0,
          "order" => 20,
        ],
        [
          "question_id" => 275690995,
          "question" => "Have cleaning staff responsible for cleaning the delivery room received training in the last 24 months?",
          "text" => "Cleaning staff responsible for cleaning the delivery room received training in the last 24 months",
          "type" => "option",
          "default" => 0,
          "order" => 21,
        ],
        [
          "question_id" => 263711009,
          "question" => "What type of waste management practices are being practiced in this facility?",
          "text" => "Type of waste management practices are being practiced in this facility",
          "type" => "option",
          "default" => 0,
          "order" => 22,
        ],
        [
          "question_id" => 259791034,
          "question" => "How are sharps and disposable syringes that have been used stored?",
          "text" => "Sharps and disposable syringes that have been used stored",
          "type" => "multiple",
          "default" => 0,
          "order" => 23,
        ],
        [
          "question_id" => 285741014,
          "question" => "is there at least one set of bins in place for safety segregation of health care waste?",
          "text" => "Bins in place for safety segregation of health care waste",
          "type" => "option",
          "default" => 0,
          "order" => 24,
        ],
        [
          "question_id" => 273641025,
          "question" => "Are there hand hygiene stations (with water and soap or alcohol based hand rub) available in or near all the toilet?",
          "text" => "Hand hygiene stations available in or near all the toilet",
          "type" => "option",
          "default" => 0,
          "order" => 25,
        ],
        [
          "question_id" => 255841045,
          "question" => "Are functioning hand washing stations (soap and water or alcohol hand rubs) available near food preparation areas?",
          "text" => "Functioning hand washing stations available near food preparation areas",
          "type" => "option",
          "default" => 0,
          "order" => 26,
        ],
        [
          "question_id" => 275691004,
          "question" => "Is WASH training being provided to health care providers at this facility?",
          "text" => "WASH training being provided",
          "type" => "option",
          "default" => 0,
          "order" => 27,
        ],
        [
          "question_id" => 285741022,
          "question" => "Is there training on infection control and prevention provided at this health facility?",
          "text" => "Training on infection control and prevention provided",
          "type" => "option",
          "default" => 0,
          "order" => 28,
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
