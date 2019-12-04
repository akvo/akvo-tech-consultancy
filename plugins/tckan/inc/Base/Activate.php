<?php
/**
 * @package  AkvoCkanPlugin
 */
namespace Inc\Base;

class Activate
{
	public static function activate() {
        flush_rewrite_rules();
	}
}
