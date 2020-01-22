<?php 
/**
 * @package  AkvoCkanPlugin
 */
namespace Inc\Pages;

use Inc\Base\ShortCodeMetabox;

class Shortcode extends ShortCodeMetabox {

    public function register_shortcode_metabox() {
        add_action( 'admin_init', array( $this, 'shortcode_metabox_fields' ) );
    }

    public function shortcode_metabox_fields()
    {
        $args = array(
            'meta_box_id'   =>  'ckan_shortcode_id',
            'label'         =>  __( '<i class="dashicons dashicons-list-view"></i> CKAN Short Code Helper' ),
            'post_type'     =>  array( 'page','post' ), // can also be in post
            'context'       =>  'normal', // side|normal|advanced
            'priority'      =>  'high', // high|low
            'hook_priority'  =>  10,
            'fields'        =>  array(
                array(
                    'name'      =>  'ckan_dataset',
                    'label'     =>  __( 'Search Dataset' ),
                    'type'      =>  'text',
                    'desc'      =>  __( '' ),
                    'class'     =>  'akvockan-meta-field',
                    'default'   =>  '',
                    'readonly'  =>  false, // true|false
                    'disabled'  =>  false, // true|false
                    'desc_nop'  =>  false, // true|false
                    )
            )
        );

        $this->shortcode_metabox( $args );
    }

    public function shortcode_metabox( $args ){
        return new ShortCodeMetabox( $args );
    }

}

