<?php 
/**
 * @package  AkvoCkanPlugin
 */
namespace Inc\Pages;

use Inc\Api\SettingsApi;
use Inc\Base\BaseController;
use Inc\Api\Callbacks\AdminCallbacks;

/**
* 
*/
class Admin extends BaseController
{
	public $settings;

	public $callbacks;

	public $pages = array();

	public $subpages = array();

	public function register() 
	{
		$this->settings = new SettingsApi();
		$this->callbacks = new AdminCallbacks();
		$this->setPages();
		$this->setSubpages();
		$this->setSettings();
		$this->setSections();
		$this->setFields();
		$this->settings->addPages( $this->pages )->withSubPage( 'Settings' )->addSubPages( $this->subpages )->register();
	}

	public function setPages() 
	{
		$this->pages = array(
			array(
				'page_title' => 'Akvo Ckan Settings', 
				'menu_title' => 'Akvo Ckan', 
				'capability' => 'manage_options', 
				'menu_slug' => 'akvockan_plugin', 
				'callback' => array( $this->callbacks, 'adminSettings' ), 
				'icon_url' => 'dashicons-admin-network', 
				'position' => 110
            ),
		);
	}

	public function setSubpages()
	{
		$this->subpages = array(
			array(
				'parent_slug' => 'akvockan_plugin', 
				'page_title' => 'Datasets Views', 
				'menu_title' => 'Datasets Views', 
				'capability' => 'manage_options', 
				'menu_slug' => 'akvockan_datasets', 
				'callback' => array( $this->callbacks, 'adminDatasets' )
			),
			array(
				'parent_slug' => 'akvockan_plugin', 
				'page_title' => 'Organisations', 
				'menu_title' => 'Organisations', 
				'capability' => 'manage_options', 
				'menu_slug' => 'akvockan_organisation', 
				'callback' => array( $this->callbacks, 'adminOrganisations' )
			),
			array(
				'parent_slug' => 'akvockan_plugin', 
				'page_title' => 'Visualisations', 
				'menu_title' => 'Visualisations', 
				'capability' => 'manage_options', 
				'menu_slug' => 'akvockan_visualisation', 
				'callback' => array( $this->callbacks, 'adminVisualisations' )
			)
		);
	}

	public function setSettings()
	{
		$args = array(
			array(
				'option_group' => 'akvockan_options_group',
				'option_name' => 'api_key',
				'callback' => array( $this->callbacks, 'akvockanOptionsGroup' )
			),
			array(
				'option_group' => 'akvockan_options_group',
				'option_name' => 'ckan_url'
			),
		);

		$this->settings->setSettings( $args );
	}

	public function setSections()
	{
		$args = array(
			array(
				'id' => 'akvockan_admin_index',
				'title' => 'Settings',
				'callback' => array( $this->callbacks, 'akvockanAdminSection' ),
				'page' => 'akvockan_plugin'
			)
		);

		$this->settings->setSections( $args );
	}

	public function setFields()
	{
		$args = array(
			array(
				'id' => 'api_key',
				'title' => 'CKAN API KEY',
				'callback' => array( $this->callbacks, 'akvockanApiKey' ),
				'page' => 'akvockan_plugin',
				'section' => 'akvockan_admin_index',
				'args' => array(
					'label_for' => 'api_key',
					'class' => 'example-class'
				)
			),
			array(
				'id' => 'ckan_url',
				'title' => 'CKAN URL',
				'callback' => array( $this->callbacks, 'akvockanUrl' ),
				'page' => 'akvockan_plugin',
				'section' => 'akvockan_admin_index',
				'args' => array(
					'label_for' => 'ckan_url',
					'class' => 'example-class'
				)
			)
		);

		$this->settings->setFields( $args );
	}

}
