<?php
/**
 * @package  TckanPlugin
 */
namespace Inc\Base;

use Inc\Base\BaseController;

class SettingsLinks extends BaseController
{
	public function register() 
	{
		add_filter( "plugin_action_links_$this->plugin", array( $this, 'settings_link' ) );
        add_filter( "admin_footer_text", array($this, "remove_footer_admin") );
	}


	public function settings_link( $links ) 
	{
		$settings_link = '<a href="admin.php?page=tckan_plugin">Settings</a>';
		array_push( $links, $settings_link );
		return $links;
	}

    public function remove_footer_admin () {
            echo '<span id="footer-thankyou" class="footer-bg">Developed by <a href="https://www.akvo.org" target="_blank">Akvo Tech Consultancy</a></span>';
    } 

}
