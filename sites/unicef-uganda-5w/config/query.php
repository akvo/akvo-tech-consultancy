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
            'id' => [1018314001],
            'name' => 'org_type',
            'bridge' => \App\AnswerCascade::class,
            'value' => \App\Cascade::class,
            'on' => 'cascades',
            'lv' => 1,
            'repeat' => false
        ],
        [
            'id' => [1018314001],
            'name' => 'org_name',
            'bridge' => \App\AnswerCascade::class,
            'value' => \App\Cascade::class,
            'on' => 'cascades',
            'lv' => 2,
            'repeat' => false
        ],
        [
            'id' => [1006544003],
            'name' => 'completion_date',
            'type' => 'date',
            'on' => false,
            'repeat' => true
        ],
        [
            'id' => [1022214001],
            'name' => 'activity',
            'bridge' => \App\AnswerOption::class,
            'value' => \App\Option::class,
            'on' => 'options',
            'repeat' => true
        ],
        [
            'id' => [992534002,1027034160],
            'name' => 'region',
            'bridge' => \App\AnswerCascade::class,
            'value' => \App\Cascade::class,
            'on' => 'cascades',
            'lv' => 1,
            'repeat' => true
        ],
        [
            'id' => [992534002,1027034160],
            'name' => 'district',
            'bridge' => \App\AnswerCascade::class,
            'value' => \App\Cascade::class,
            'on' => 'cascades',
            'lv' => 2,
            'repeat' => true
        ],
        [
            'id' => [1018314002],
            'name' => 'domain',
            'bridge' => \App\AnswerOption::class,
            'value' => \App\Option::class,
            'on' => 'options',
            'repeat' => true
        ],
        [
            'id' => [1006544002, 1020264002, 1000464002, 1006554003],
            'name' => 'sub_domain',
            'bridge' => \App\AnswerOption::class,
            'value' => \App\Option::class,
            'on' => 'options',
            'repeat' => true
        ],
        [
            'id' => [998514002],
            'name' => 'quantity',
            'type' => 'integer',
            'on' => false,
            'repeat' => true
        ],
        [
            'id' => [1018314004],
            'name' => 'total',
            'type' => 'integer',
            'on' => false,
            'repeat' => true
        ],
        [
            'id' => [998514003],
            'name' => 'new',
            'type' => 'integer',
            'on' => false,
            'repeat' => true
        ],
    ]
];
