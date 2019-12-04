<?php

/**
 * Trigger this file on Plugin uninstall
 *
 * @package  AkvoCkanPlugin
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	die;
}

// Clear Database stored data
$databases = get_posts( array( 'post_type' => 'database', 'numberposts' => -1 ) );

foreach( $databases as $database ) {
	wp_delete_post( $database->ID, true );
}

// Access the database via SQL
global $wpdb;
$wpdb->query( "DELETE FROM wp_posts WHERE post_type = 'database'" );
$wpdb->query( "DELETE FROM wp_postmeta WHERE post_id NOT IN (SELECT id FROM wp_posts)" );
$wpdb->query( "DELETE FROM wp_term_relationships WHERE object_id NOT IN (SELECT id FROM wp_posts)" );
