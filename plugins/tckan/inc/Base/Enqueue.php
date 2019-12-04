<?php 
/**
 * @package  AkvoCkanPlugin
 */
namespace Inc\Base;

use Inc\Base\BaseController;

/**
* 
*/
class Enqueue extends BaseController
{
	public function register() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'ckan_scripts' ) );
	}

	function enqueue() {
		// enqueue all admin scripts
        wp_enqueue_style( 'akvockan-admin', $this->plugin_url . 'assets/akvockan-admin.css' );
		wp_enqueue_script( 'akvockan-admin', $this->plugin_url . 'assets/akvockan-admin.js' );
	}

    function enqueue_frontend() {
        wp_enqueue_style( 'akvockan', $this->plugin_url . 'assets/akvockan.css' );
        wp_enqueue_script( 'jquery' );
		wp_enqueue_script( 'akvockan', $this->plugin_url . 'assets/akvockan.js' );
    }

    function ckan_scripts() {
        if ( is_singular( 'dataset' ) ) {
            $ckan = get_metadata( 'post', get_the_ID(), 'ckan_dataset', true );
            if (isset($ckan)){
                echo("<div style='display:none;' id='ckan-data'>$ckan</div>");
            }
        }
    }


}
