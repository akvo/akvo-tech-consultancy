<?php

namespace App\Models;

use JsonSerializable;

class Questionnaire implements JsonSerializable
{
    public $name;

    public $title;

    private static $questionnaires = [];

    public function __construct(string $name, string $title)
    {
        $this->name = $name;
        $this->title = $title;
    }

    public function url()
    {
        return config('bc.form_url') . $this->name;
    }

    public function jsonSerialize(): array
    {
        return [
            'name' => $this->name,
            'title' => $this->title,
            'url' => $this->url(),
        ];
    }

    public static function get(string $name): ?self
    {
        if (array_key_exists($name, self::$questionnaires)) {
            return self::$questionnaires[$name];
        }

        if (array_key_exists($name, config('bc.questionnaires'))) {
            $title = config('bc.questionnaires.'.$name);
            $q = new self($name, $title);
            self::$questionnaires[$name] = $q;
            return $q;
        }

        return null;
    }

    public static function all(): Questionnaires
    {
        foreach (array_keys(config('bc.questionnaires')) as $name) {
            self::get($name);
        }

        return new Questionnaires(array_values(self::$questionnaires));
    }
}
