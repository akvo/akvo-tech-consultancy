<?php 
/**
 * @package  TckanPlugin
 */
namespace Inc\Api\Callbacks;

use Inc\Base\BaseController;

class AdminCallbacks extends BaseController
{
	public function adminSettings()
	{
		return require_once( "$this->plugin_path/templates/admin.php" );
	}

	public function adminDatasets()
	{
        $ckan = new CkanApi();
        $ckan = $ckan->getData();
		return require_once( "$this->plugin_path/templates/datasets.php" );
	}

	public function adminOrganisations()
	{
        $ckan = new CkanApi();
        $ckan = $ckan->getData();
		return require_once( "$this->plugin_path/templates/organisations.php" );
	}

	public function adminVisualisations( )
	{
        $ckan = new CkanApi();
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $name = $_GET['name'];
            $results = $ckan->getResourceView($id, $name);
            if (empty($results)){
                return require_once( "$this->plugin_path/templates/error.php" );
            };
		    return require_once( "$this->plugin_path/templates/visualisations.php" );
        }
        return require_once( "$this->plugin_path/templates/error.php" );
	}

	public function tckanOptionsGroup( $input )
	{
		return $input;
	}

	public function tckanAdminSection()
	{
		echo 'Some API functions require authorization. The API uses the same authorization functions and configuration as the web interface, so if a user is authorized to do something in the web interface they’ll be authorized to do it via the API as well.';
	}

	public function tckanApiKey()
	{
		$value = esc_attr( get_option( 'api_key' ) );
		echo '<input type="text" class="regular-text" name="api_key" value="' . $value . '" placeholder="dc6ad34e-5eb4-45a5-af0c-fcaf3747326d">';
	}

	public function tckanUrl()
	{
		$value = esc_attr( get_option( 'ckan_url' ) );
		echo '<input type="text" class="regular-text" name="ckan_url" value="' . $value . '" placeholder="https://watersheed.ckan.org">';
	}
}
