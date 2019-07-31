<?php

/**
 * @package  TckanPlugin
 */
namespace Inc\Pages;

class Post
{
    public function register() {

        add_action( 'init', array( $this, 'tpg_create_database_post_type' ) );
        add_action( 'init', array( $this, 'tpg_create_library_taxonomy') , 0 );
        add_filter( 'cmb_meta_boxes' , array( $this, 'tpg_create_metaboxes' ) );
        add_filter( 'manage_database_posts_columns', array( $this, 'tpg_add_librarys_column_to_database_list') );
        add_filter( 'manage_database_posts_custom_column', array( $this, 'tpg_show_library_column_for_database_list') , 10, 2 );
        add_filter( 'parse_query', array( $this, 'tpg_convert_library_id_to_taxonomy_term_in_query' ) );
        add_filter( 'manage_edit-database_sortable_columns', array( $this, 'tpg_library_column_register_sortable') );
        add_filter( 'request', array( $this, 'tpg_library_column_orderby' ) );
    }
    public function tpg_create_database_post_type() {
        $labels = array(
            'name' => _x('Database', 'post type general name'),
            'singular_name' => _x('Database Item', 'post type singular name'),
            'add_new' => _x('Add New', 'item'),
            'add_new_item' => __('Add New Database Item'),
            'edit_item' => __('Edit Database Item'),
            'new_item' => __('New Database Memeber'),
            'all_items' => __('All Database'),
            'view_item' => __('View Database Item'),
            'search_items' => __('Search Database'),
            'not_found' =>  __('No database found'),
            'not_found_in_trash' => __('No database found in Trash'), 
            'parent_item_colon' => '',
            'menu_name' => 'Database'
        );
        $args = array(
            'labels' => $labels,
            'description' => 'A post type for entering database information.',
            'public' => true,
            'publicly_queryable' => true,
            'show_ui' => true,
            'query_var' => true,
            'hierarchical' => false,
            'supports' => array('thumbnail'),
            'rewrite' => array('slug' => 'database'),
            'has_archive' => 'database',
        );
        register_post_type('database',$args);
    }

    public function tpg_create_library_taxonomy(){
        $labels = array(
            'name' => _x( 'Libraries', 'taxonomy general name' ),
            'singular_name' => _x( 'Library', 'taxonomy singular name' ),
            'search_items' =>  __( 'Search Libraries' ),
            'popular_items' => __( 'Popular Libraries' ),
            'all_items' => __( 'All Libraries' ),
            'parent_item' => null,
            'parent_item_colon' => null,
            'edit_item' => __( 'Edit Library' ), 
            'update_item' => __( 'Update Library' ),
            'add_new_item' => __( 'Add New Library' ),
            'new_item_name' => __( 'New Library Name' ),
            'separate_items_with_commas' => __( 'Separate librarys with commas' ),
            'add_or_remove_items' => __( 'Add or remove librarys' ),
            'choose_from_most_used' => __( 'Choose from the most used librarys' ),
            'menu_name' => __( 'Library' ),
        );

        register_taxonomy(  
            'library',
            'database',
            array(
                'hierarchical' => false,
                'labels' => $labels,
                'public'=>true,
                'show_ui'=>true,
                'query_var' => true,
                'rewrite' => array( 'slug' => 'library', 'with_front' => false ),
            )
        );
    }

    public function tpg_create_metaboxes( $meta_boxes ) {
        $prefix = 'tpg_'; // start with an underscore to hide fields from custom fields list
        $meta_boxes[] = array(
            'id' => 'database_info_metabox',
            'title' => 'Information',
            'pages' => array('database'), // post type
            'context' => 'normal',
            'priority' => 'low',
            'show_names' => true, // Show field names on the left
            'fields' => array(
                array(
                    'name' => 'First Name',
                    'desc' => '',
                    'id' => $prefix . 'first_name_text',
                    'type' => 'text'
                ),
                array(
                    'name' => 'Organisation',
                    'desc' => '',
                    'id' => $prefix . 'organisation_text',
                    'type' => 'text'
                ),
                array(
                    'name' => 'Title',
                    'desc' => 'Database title.',
                    'id' => $prefix . 'title_text',
                    'type' => 'text'
                ),
                array(
                    'name' => 'Url',
                    'desc' => 'Url of the webpage.',
                    'id' => $prefix . 'url_text',
                    'type' => 'text'
                ),
                array(
                    'name' => 'Description',
                    'desc' => 'A short description about the dataset.',
                    'id' => $prefix . 'dataset_wysiwyg',
                    'type' => 'wysiwyg',
                    'options' => array(
                        'wpautop' => true, // use wpautop?
                        'media_buttons' => false, // show insert/upload button(s)
                        'textarea_rows' => get_option('default_post_edit_rows', 10), // rows="..."
                    ),
                ),
                array(
                    'name' => 'Library',
                    'desc' => '',
                    'id' => $prefix . 'library_taxonomy_select',
                    'taxonomy' => 'library', //Enter Taxonomy Slug
                    'type' => 'taxonomy_select',	
                ),
                array(
                    'name' => 'Order',
                    'desc' => 'Used to order the list of database.',
                    'id' => $prefix . 'order_text',
                    'type' => 'text'
                ),
            ),
        );
        
        return $meta_boxes;
    }

    public function tpg_initialize_cmb_meta_boxes() {
        if ( !class_exists( 'cmb_Meta_Box' ) ) {
            require_once( get_stylesheet_directory() . '/lib/metabox/init.php' );
        }
    }

    public function tpg_add_librarys_column_to_database_list( $posts_columns ) {
        if (!isset($posts_columns['author'])) {
            $new_posts_columns = $posts_columns;
        } else {
            $new_posts_columns = array();
            $index = 0;
            foreach($posts_columns as $key => $posts_column) {
                if ($key=='author') {
                $new_posts_columns['library'] = null;
                }
                $new_posts_columns[$key] = $posts_column;
            }
        }
        $new_posts_columns['library'] = 'Libraries';
        $new_posts_columns['author'] = __('Author');
        return $new_posts_columns;
    }

    function tpg_show_library_column_for_database_list( $column_id,$post_id ) {
        global $typenow;
        if ($typenow=='database') {
            $taxonomy = 'library';
            switch ($column_id) {
            case 'library':
                $librarys = get_the_terms($post_id,$taxonomy);
                if (is_array($librarys)) {
                    foreach($librarys as $key => $library) {
                        $edit_link = get_term_link($library,$taxonomy);
                        $librarys[$key] = '<a href="'.$edit_link.'">' . $library->name . '</a>';
                    }
                    echo implode(' | ',$librarys);
                }
                break;
            }
        }
    }

    public function tpg_restrict_database_by_library() {
    global $typenow;
        $args=array( 'public' => true, '_builtin' => false ); 
        $post_types = get_post_types($args);
        if ( in_array($typenow, $post_types) ) {
            $filters = get_object_taxonomies($typenow);
            foreach ($filters as $tax_slug) {
                $tax_obj = get_taxonomy($tax_slug);
                wp_dropdown_categories(array(
                    'show_option_all' => __('Show All '.$tax_obj->label ),
                    'taxonomy' => $tax_slug,
                    'name' => $tax_obj->name,
                    'orderby' => 'term_order',
                    'selected' => $_GET[$tax_obj->query_var],
                    'hierarchical' => $tax_obj->hierarchical,
                    'show_count' => false,
                    'hide_empty' => true
                    )
                );
            }
        }
    }

    public function tpg_convert_library_id_to_taxonomy_term_in_query($query) {
    global $pagenow;
        global $typenow;
            if ($pagenow=='edit.php') {
                $filters = get_object_taxonomies($typenow);
                    foreach ($filters as $tax_slug) {
                        $var = &$query->query_vars[$tax_slug];
                            if ( isset($var) ) {
                                $term = get_term_by('id',$var,$tax_slug);
                                $var = $term->slug;
                            }
                    }
            }
    }

    public function tpg_library_column_register_sortable( $columns ) {
        $columns['library'] = 'library';
     
        return $columns;
    }

    public function tpg_library_column_orderby( $vars ) {
        if ( isset( $vars['orderby'] ) && 'library' == $vars['orderby'] ) {
            $vars = array_merge( $vars, array(
                'meta_key' => 'tpg_library_taxonomy_select',
                'orderby' => 'meta_value'
            ) );
        }
     
        return $vars;
    }

}
