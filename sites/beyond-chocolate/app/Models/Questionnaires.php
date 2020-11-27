<?php
namespace App\Models;

use JsonSerializable;
use ArrayAccess;
use IteratorAggregate;
use ArrayIterator;
use DomainException;

class Questionnaires implements ArrayAccess, IteratorAggregate, JsonSerializable
{
    public $items = [];

    public static function fromInput($input)
    {
        $qs = new self();

        if (!is_array($input)) {
            return $qs;
        }

        foreach ($input as $name) {
            $q = Questionnaire::get($name);
            if (is_null($q)) {
                continue;
            }
            $qs[] = $q;
        }

        return $qs;
    }

    public function __construct(array $items = [])
    {
        foreach ($items as $item) {
            $this->offsetSet(null, $item);
        }
    }

    public function getIterator()
    {
        return new ArrayIterator($this->items);
    }

    public function offsetExists($offset)
    {
        return isset($this->items[$key]);
    }

    public function offsetGet($offset)
    {
        return $this->items[$key];
    }

    public function offsetSet($offset, $value)
    {
        if (! $value instanceof Questionnaire) {
            throw new DomainException('Invalid type ' . get_class($item));
        }

        if (is_null($offset)) {
            $this->items[] = $value;
        } else {
            $this->items[$offset] = $value;
        }
    }

    public function offsetUnset($offset)
    {
        unset($this->items[$key]);
    }

    public function jsonSerialize(): array
    {
        return $this->items;
    }
}
