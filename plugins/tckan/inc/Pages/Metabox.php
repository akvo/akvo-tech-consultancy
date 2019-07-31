<?php 
/**
 * @package  TckanPlugin
 */
namespace Inc\Pages;

use Inc\Base\TckanMetabox;

class Metabox extends TckanMetabox {

    public function register() {

        add_action( 'admin_init', array( $this, 'my_meta_fields' ) );
    }

    public function my_meta_fields()
    {
        $args = array(
            'meta_box_id'   =>  'ckan_meta_id',
            'label'         =>  __( 'CKAN Dataset' ),
            'post_type'     =>  array( 'post', 'page' ),
            'context'       =>  'advanced', // side|normal|advanced
            'priority'      =>  'high', // high|low
            'hook_priority'  =>  10,
            'fields'        =>  array(
                array(
                    'name'      =>  'ckan_dataset',
                    'label'     =>  __( '' ),
                    'type'      =>  'ckan',
                    'desc'      =>  __( '' ),
                    'class'     =>  'tckan-meta-field',
                    'default'   =>  '',
                    'readonly'  =>  false, // true|false
                    'disabled'  =>  false, // true|false
                    'desc_nop'  =>  false, // true|false
                ),
            )
        );
        $this->tckan_meta_box( $args );
    }

    public function tckan_meta_box( $args ){
        return new TckanMetabox( $args );
    }
}

