<?php
/*
Plugin Name: TCkan
Plugin URI: https://www.akvo.org
Description: Connecting Your CKAN Datasets to Wordpress using CKAN API
Version: 1.0.0
Author: Deden Bangkit, Joy Ghosh
Author URI: https://www.akvo.org
License: GPLv2 or later
 */

/*
TCkan is developed by Akvo Tech Consultancy; you can redistribute it and/or
modify it under the terms of GNU General Public License as published by Akvo Foundation;
either version 2 of the License, or (at your option) any later version.

This Program is developed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of 
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

Akvo Foundation
*/

// If this file is called firectly, abort!!!
defined( 'ABSPATH' ) or die( 'Hey, what are you doing here? You silly human!' );

// Require once the Composer Autoload
if ( file_exists( dirname( __FILE__ ) . '/vendor/autoload.php' ) ) {
	require_once dirname( __FILE__ ) . '/vendor/autoload.php';
}

/**
 * The code that runs during plugin activation
 */
function activate_tckan_plugin() {
	Inc\Base\Activate::activate();
}
register_activation_hook( __FILE__, 'activate_tckan_plugin' );

/**
 * The code that runs during plugin deactivation
 */
function deactivate_tckan_plugin() {
	Inc\Base\Deactivate::deactivate();
}
register_deactivation_hook( __FILE__, 'deactivate_tckan_plugin' );

/**
 * Initialize all the core classes of the plugin
 */
if ( class_exists( 'Inc\\Init' ) ) {
	Inc\Init::register_services();
}
