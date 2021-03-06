<?php
/**
 * @package  AkvoCkanPlugin
 */
namespace Inc;

final class Init
{
	/**
	 * Store all the classes inside an array
	 * @return array Full list of classes
	 */
	public static function get_services() 
	{
		return [
			Pages\Admin::class,
			Base\Enqueue::class,
			Base\ShortCodes::class,
			Base\SettingsLinks::class
		];
	}

	/**
	 * Loop through the classes, initialize them, 
	 * and call the register() method if it exists
	 * @return
	 */
	public static function register_services() 
	{
		foreach ( self::get_services() as $class ) {
			$service = self::instantiate( $class );
			if ( method_exists( $service, 'register' ) ) {
				$service->register();
			}
		}
	}

    public static function register_post_type()
    {
        $post_type = new Pages\Dataset();
        $post_type->register();
    }

    public static function register_custom_api()
    {
        $custom_api = new Pages\Api();
		$custom_api->register();
		$custom_api->addContainerTag();
    }

    public static function register_metabox()
    {
        $metabox = new Pages\Metabox();
        $metabox->register_ckan_metabox();
    }

    public static function register_shortcode()
    {
        $metabox = new Pages\Shortcode();
        $metabox->register_shortcode_metabox();
    }

	/**
	 * Initialize the class
	 * @param  class $class    class from the services array
	 * @return class instance  new instance of the class
	 */
	private static function instantiate( $class )
	{
		$service = new $class();

		return $service;
	}
}
