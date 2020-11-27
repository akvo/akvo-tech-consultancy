<?php

namespace App\Models;

use JsonSerializable;

class Role implements JsonSerializable
{
    public $key;

    public $name;

    public $permissions;

    public $description;

    private static $roles = [];

    public function __construct(string $key, string $name, array $permissions)
    {
        $this->key = $key;
        $this->name = $name;
        $this->permissions = $permissions;
    }

    public function description(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function jsonSerialize(): array
    {
        return [
            'key' => $this->key,
            'name' => $this->name,
            'permissions' => $this->permissions,
            'description' => $this->description,
        ];
    }

    public static function get(string $key): ?self
    {
        if (array_key_exists($key, self::$roles)) {
            return self::$roles[$key];
        }

        if (array_key_exists($key, config('bc.roles'))) {
            $c = config('bc.roles.'.$key);
            $role = new self($key, $c['name'], $c['permissions']);
            self::$roles[$key] = $role;
            return $role;
        }

        return null;
    }

    public static function all(): array
    {
        foreach (array_keys(config('bc.roles')) as $key) {
            self::get($key);
        }

        return array_values(self::$roles);
    }
}
