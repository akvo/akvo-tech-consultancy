<?php 
/**
 * @package  AkvoCkanPlugin
 */
namespace Inc\Pages;

use Inc\Api\Callbacks\CkanApi;

class Api extends CkanApi 
{ 

	public function register() 
	{
        add_action( 'rest_api_init', array($this, 'route') );
    }

    public function route()
    {
        register_rest_route( 'akvockan', 'v1', array(
            'methods'  => 'GET',
            'callback' => array($this,'searchData'),
        ));
    }

    public function addContainerTag() 
	{
        add_filter( 'the_content', array($this, 'tagContainer'));
    }

    public function tagContainer($content) {
        return $content . '<div id="ckan-container"></div>';
    }
}
