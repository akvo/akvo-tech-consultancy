<?php 
/**
 * @package  AkvoCkanPlugin
 */
namespace Inc\Pages;

use Inc\Base\AkvoCkanMetabox;

class Metabox extends AkvoCkanMetabox {

    public function register_ckan_metabox() {
        add_action( 'admin_init', array( $this, 'ckan_metabox_fields' ) );
    }

    public function ckan_metabox_fields()
    {
        $args = array(
            'meta_box_id'   =>  'ckan_meta_id',
            'label'         =>  __( '<i class="dashicons dashicons-list-view"></i> CKAN Dataset' ),
            'post_type'     =>  array( 'dataset' ), // can also be in post
            'context'       =>  'normal', // side|normal|advanced
            'priority'      =>  'high', // high|low
            'hook_priority'  =>  10,
            'fields'        =>  array(
                array(
                    'name'      =>  'ckan_dataset',
                    'label'     =>  __( 'Datasets' ),
                    'type'      =>  'ckan',
                    'desc'      =>  __( '' ),
                    'class'     =>  'akvockan-meta-field',
                    'default'   =>  '',
                    'readonly'  =>  false, // true|false
                    'disabled'  =>  false, // true|false
                    'desc_nop'  =>  false, // true|false
                    )
            )
        );

            $this->akvockan_meta_box( $args );
    }


    public function akvockan_meta_box( $args ){
        return new AkvoCkanMetabox( $args );
    }

}

