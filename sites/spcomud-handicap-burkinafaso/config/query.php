<?php

return [
    'data' => [
        [
            'name' => 'form_instance_id',
            'bridge' => \App\FormInstance::class,
            'on' => 'form_instances',
        ]
    ],
    'values' => [
        [
            'id' => [482740949],
            'name' => 'region',
            'bridge' => \App\AnswerCascade::class,
            'value' => \App\Cascade::class,
            'on' => 'cascades',
            'lv' => 1,
            'repeat' => false
        ],
        [
            'id' => [482740949],
            'name' => 'province',
            'bridge' => \App\AnswerCascade::class,
            'value' => \App\Cascade::class,
            'on' => 'cascades',
            'lv' => 1,
            'repeat' => false
        ],
        [
            'id' => [482740949],
            'name' => 'commune',
            'bridge' => \App\AnswerCascade::class,
            'value' => \App\Cascade::class,
            'on' => 'cascades',
            'lv' => 1,
            'repeat' => false
        ],
        [
            'id' => [474750912],
            'name' => 'legal_status',
            'bridge' => \App\AnswerOption::class,
            'value' => \App\Option::class,
            'on' => 'options',
            'repeat' => false
        ],
        [
            'id' => [476611005],
            'name' => 'type_doph',
            'bridge' => \App\AnswerOption::class,
            'value' => \App\Option::class,
            'on' => 'options',
            'repeat' => false
        ],
        [
            'id' => [469780912],
            'name' => 'type_dhandicap',
            'bridge' => \App\AnswerOption::class,
            'value' => \App\Option::class,
            'on' => 'options',
            'repeat' => false
        ],
        [
            'id' => [469760958],
            'name' => 'organization_structure',
            'bridge' => \App\AnswerOption::class,
            'value' => \App\Option::class,
            'on' => 'options',
            'repeat' => false
        ],
        [
            'id' => [474770912],
            'name' => 'head_gender',
            'bridge' => \App\AnswerOption::class,
            'value' => \App\Option::class,
            'on' => 'options',
            'repeat' => false
        ],
        [
            'id' => [476620984],
            'name' => 'intervention_area',
            'bridge' => \App\AnswerOption::class,
            'value' => \App\Option::class,
            'on' => 'options',
            'repeat' => false
        ],
        [
            'id' => [455470955],
            'name' => 'beneficiaries',
            'bridge' => \App\AnswerOption::class,
            'value' => \App\Option::class,
            'on' => 'options',
            'repeat' => false
        ],
        [
            'id' => [455470955],
            'name' => 'accessibility',
            'bridge' => \App\AnswerOption::class,
            'value' => \App\Option::class,
            'on' => 'options',
            'repeat' => false
        ],
        [
            'id' => [474840962],
            'name' => 'languange_used',
            'bridge' => \App\AnswerOption::class,
            'value' => \App\Option::class,
            'on' => 'options',
            'repeat' => false
        ],
        [
            'id' => [482970959],
            'name' => 'funding_source',
            'bridge' => \App\AnswerOption::class,
            'value' => \App\Option::class,
            'on' => 'options',
            'repeat' => false
        ],
        // [
        //     'id' => [1006544002, 1020264002, 1000464002, 1006554003],
        //     'name' => 'sub_domain',
        //     'bridge' => \App\AnswerOption::class,
        //     'value' => \App\Option::class,
        //     'on' => 'options',
        //     'repeat' => true
        // ],
        // [
        //     'id' => [1006544003],
        //     'name' => 'completion_date',
        //     'type' => 'date',
        //     'on' => false,
        //     'repeat' => true
        // ],
        // [
        //     'id' => [998514002],
        //     'name' => 'quantity',
        //     'type' => 'integer',
        //     'on' => false,
        //     'repeat' => true
        // ],
        // [
        //     'id' => [1018314004],
        //     'name' => 'total',
        //     'type' => 'integer',
        //     'on' => false,
        //     'repeat' => true
        // ],
        // [
        //     'id' => [998514003],
        //     'name' => 'new',
        //     'type' => 'integer',
        //     'on' => false,
        //     'repeat' => true
        // ],
    ]
];
