<?php 
/**
 * @package  TckanPlugin
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
	}

	function enqueue() {
		// enqueue all our scripts
        wp_enqueue_style( 'tckan-admin', $this->plugin_url . 'assets/tckan-admin.css' );
		wp_enqueue_script( 'tckan-admin', $this->plugin_url . 'assets/tckan-admin.js' );
	}


}
