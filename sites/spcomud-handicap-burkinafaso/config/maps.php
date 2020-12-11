<?php

$colors = [
    "black" => "#000",
    "white" => "#fff"
];

return [
    "469750943" => [
        "template" => [
           "css" => "ophbf",
           "js" => "ophbf" 
        ],
        "maps" => [
            "polygon" => true,
            "point" => false,
            "match_question" => 482740949, // location question
        ],
        "first_filter" => [
            [
                "question_id" => 455470955,
                "text" => null,
                "order" => 0,
                "options" => [
                    [
                        "code" => "homme",
                        "text" => "test",
                        "color" => $colors['black'],
                        "order" => 0,
                    ],
                    [
                        "code" => "femmes",
                        "text" => null,
                        "color" => null,
                        "order" => 1,
                    ],
                    [
                        "code" => "nouvelle option",
                        "text" => null,
                        "color" => null,
                        "order" => 2,
                    ],
                    [
                        "code" => "garçons",
                        "text" => null,
                        "color" => null,
                        "order" => 3,
                    ],
                    [
                        "code" => "filles",
                        "text" => null,
                        "color" => null,
                        "order" => 4,
                    ],
                    [
                        "code" => "jeunes",
                        "text" => null,
                        "color" => null,
                        "order" => 5,
                    ],
                    [
                        "code" => "enfants",
                        "text" => null,
                        "color" => null,
                        "order" => 6,
                    ],
                ],
            ],
            [
                "question_id" => 463661005,
                "text" => null,
                "order" => 1,
                "options" => null,
            ],
            [
                "question_id" => 469760958,
                "text" => null,
                "order" => 2,
                "options" => null,
            ],
            [
                "question_id" => 469780912,
                "text" => null,
                "order" => 3,
                "options" => null,
            ],
            [
                "question_id" => 474750912,
                "text" => null,
                "order" => 4,
                "options" => null,
            ],
        ],
        "second_filter" => [
            [
                "question_id" => 482740949,
                "text" => null,
                "order" => 0,
            ],
        ],
    ],
];