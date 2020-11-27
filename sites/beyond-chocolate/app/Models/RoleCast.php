<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use App\Models\Role;

class RoleCast implements CastsAttributes
{
    public function get($model, $key, $value, $attributes)
    {
        if (array_key_exists($value, config('bc.roles'))) {
            return Role::get($value);
        }

        return null;
    }

    public function set($model, $key, $value, $attributes)
    {
        if (is_null($value)) {
            return null;
        }

        if (! $value instanceof Role) {
            throw new InvalidArgumentException('The given value is not a Role instance.');
        }

        return $value->key;
    }
}
