<?php
/**
 * @package  AkvoCkanPlugin
 */
namespace Inc\Base;

class ShortCodes extends BaseController
{
	public function register() {
        add_shortcode( "ckan_search", array($this, "search_widget") );
        add_shortcode( "ckan", array($this, "ckan_dataset") );
        add_action( "wp_enqueue_scripts", array($this, "is_archive_dataset") );
	}

    public function ckan_dataset($param) {
        $html = '<div class="ckan-table" data-id="'.$param['id'].'">';
        $html .= '</div>';
        return $html;
    }

    public function search_widget() {
        $html = '<div class="ckan_search_bar col-md-12">';
        $html .= '<div class="input-group input-group-lg ckan-filesearch-box">';
        $html .= '<input type="text" class="form-control" id="dataset-query" aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search Files">';
        $html .= '<button class="btn btn-primary btn-ckan-search"><i class="fa fa-search"></i> Search</button>';
        $html .= '</div>';
        $html .= '<div class="col-md-12 text-center">';
		$html .= '<div class="lds-ellipsis" style="display:none;"><div></div><div></div><div></div><div></div></div>';
        $html .= '</div>';
        $html .= "</div>";
        return $html;
    }

    public function is_archive_dataset( $post_types = '' ) {
        global $wp_query;
        $datasets_archive = $wp_query->is_post_type_archive( 'dataset' );
        $datasets_page = is_singular( 'dataset' );
        if ($datasets_archive){
            $terms = get_terms( 'collection', array(
                    'hide_empty' => false
            ));
            return add_filter( 'sidebars_widgets', array($this, 'disable_all_widgets') );
        }
        if ($datasets_page){
            return add_filter( 'sidebars_widgets', array($this, 'disable_all_widgets') );
        }
        return;
    }

    public function disable_all_widgets( $sidebars_widgets ) {
        if($sidebars_widgets['sidebar-1']){
        	$sidebars_widgets = array( 'sidebar-1' => array (
				0 => 'lc_taxonomy-2'
			));
		}
        return $sidebars_widgets;
    }

}
