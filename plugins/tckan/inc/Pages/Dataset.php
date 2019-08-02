<?php 
/**
 * @package  TckanPlugin
 */
namespace Inc\Pages;

class Dataset {

    public function register() {
        add_action( "init", array( $this, "dataset_post_type" ), 0 );
        add_filter( "wp_editor_settings", array( $this, "dataset_editor_settings" ) );
    }

    public function dataset_post_type() {
        $labels = array(
            'name'                  => 'Datasets',
            'singular_name'         => 'Dataset',
            'menu_name'             => 'Datasets',
            'name_admin_bar'        => 'Dataset',
            'archives'              => 'Item Archives',
            'attributes'            => 'Item Attributes',
            'parent_item_colon'     => 'Parent Item:',
            'all_items'             => 'All Items',
            'add_new_item'          => 'Add New Item',
            'add_new'               => 'Add Dataset',
            'new_item'              => 'New Dataset',
            'edit_item'             => 'Edit Dataset',
            'update_item'           => 'Update Dataset',
            'view_item'             => 'View Dataset',
            'view_items'            => 'View Datasets',
            'search_items'          => 'Search Dataset',
            'not_found'             => 'Dataset Not found',
            'not_found_in_trash'    => 'Not found in Trash',
            'featured_image'        => 'Featured Image',
            'set_featured_image'    => 'Set featured image',
            'remove_featured_image' => 'Remove featured image',
            'use_featured_image'    => 'Use as featured image',
            'insert_into_item'      => 'Insert into dataset',
            'uploaded_to_this_item' => 'Uploaded to this dataset',
            'items_list'            => 'Datasets list',
            'items_list_navigation' => 'Datasets list navigation',
            'filter_items_list'     => 'Filter datasets list',
        );
        $rewrite = array(
            'slug'                  => 'dataset',
            'with_front'            => true,
            'pages'                 => true,
            'feeds'                 => true,
        );
        $args = array(
            'label'                 => 'Dataset',
            'description'           => 'Add new dataset',
            'labels'                => $labels,
            'supports'              => array( 'title', 'editor', 'thumbnail', 'comments' ),
            'taxonomies'            => array( 'category', 'post_tag' ),
            'hierarchical'          => false,
            'public'                => true,
            'show_ui'               => true,
            'show_in_menu'          => true,
            'menu_position'         => 5,
            'menu_icon'             => 'dashicons-excerpt-view',
            'show_in_admin_bar'     => true,
            'show_in_nav_menus'     => true,
            'can_export'            => true,
            'has_archive'           => 'dataset',
            'exclude_from_search'   => false,
            'publicly_queryable'    => true,
            'rewrite'               => $rewrite,
            'capability_type'       => 'post',
            'show_in_rest'          => true,
        );
        register_post_type( 'dataset', $args );
    }

    public function dataset_editor_settings( $settings ) {
        global $post_type;
        if ( $post_type == 'dataset' ) {
            $settings[ 'tinymce' ] = true;
        }
        return $settings;
    }

}
