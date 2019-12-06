<?php 
/**
 * @package  AkvoCkanPlugin
 */
namespace Inc\Pages;

class Dataset {

    public function register() {
        add_action( "init", array( $this, "dataset_custom_taxonomy"), 0 );
        add_action( "init", array( $this, "dataset_post_type" ), 0 );
        add_filter( "wp_editor_settings", array( $this, "dataset_editor_settings" ) );
    }

    public function dataset_post_type() {

        $labels = array(
            'name'                  => 'Datasets',
            'singular_name'         => 'Dataset',
            'menu_name'             => 'Datasets',
            'parent_item_colon'     => 'Parent Dataset:',
            'all_items'             => 'Datasets',
            'view_item'             => 'View Dataset',
            'add_new_item'          => 'Add New Dataset',
            'add_new'               => 'Add Dataset',
            'edit_item'             => 'Edit Dataset',
            'update_item'           => 'Update Dataset',
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
            'description'           => 'See what datasets and documents are available, straight from the search results',
            'labels'                => $labels,
            'supports'              => array( 'title', 'editor', 'excerpt', 'author' , 'thumbnail', 'comments' , 'custom-fields'),
            'taxonomies'            => array( 'collection_tag' ),
            'hierarchical'          => true,
            'public'                => true,
            'show_ui'               => true,
            'show_in_menu'          => true,
            'has_archive'           => true,
            'menu_position'         => 5,
            'menu_icon'             => 'dashicons-excerpt-view',
            'show_in_admin_bar'     => true,
            'show_in_nav_menus'     => true,
            'can_export'            => true,
            'exclude_from_search'   => false,
	        'yarpp_support'         => true,
            'publicly_queryable'    => true,
            'capability_type'       => 'post',
            'show_in_rest'          => true,
            'rewrite'               => $rewrite,
        );

        register_post_type( 'dataset', $args );
    }

    public function dataset_custom_taxonomy() {

          $labels = array(
            'name' => _x( 'Collections', 'taxonomy general name' ),
            'singular_name' => _x( 'Collection', 'taxonomy singular name' ),
            'search_items' =>  __( 'Search Collections' ),
            'popular_items' => __( 'Popular Collections' ),
            'all_items' => __( 'All Collections' ),
            'parent_item' => null,
            'parent_item_colon' => null,
            'edit_item' => __( 'Edit Collection' ), 
            'update_item' => __( 'Update Collection' ),
            'add_new_item' => __( 'Add New Collection' ),
            'new_item_name' => __( 'New Collection Name' ),
            'separate_items_with_commas' => __( 'Separate collection tags with commas' ),
            'add_or_remove_items' => __( 'Add or remove collection tags' ),
            'choose_from_most_used' => __( 'Choose from the most used collection tags' ),
            'menu_name' => __( 'Collections' ),
          ); 	
         
          register_taxonomy('collection',array('dataset'), array(
            'hierarchical'          => true,
            'labels'                => $labels,
            'show_ui'               => true,
            'show_in_menu'          => true,
            'show_admin_column'     => true,
    		'update_count_callback' => '_update_post_term_count',
            'query_var'             => true,
            'show_in_rest'          => true,
            'show_in_nav_menus'     => true,
            'has_archive'           => true,
            'publicly_queryable'    => true,
            'rewrite'               => array( 'slug' => 'dataset' ),
          ));
    }

    public function dataset_editor_settings( $settings ) {
        global $post_type;
        if ( $post_type == 'dataset' ) {
            $settings[ 'tinymce' ] = true;
        }
        return $settings;
    }

}
