<?php

/**
 * @package  shortcodePlugin
 */
namespace Inc\Base;

use Inc\Api\Callbacks\CkanApi;

class ShortCodeMetabox {

	public $post_type;
	public $context;
	public $priority;
	public $hook_priority = 10;
	public $fields;
	public $meta_box_id;
	public $label;

	function __construct( $args = null ){
		$this->meta_box_id 		= $args['meta_box_id'] ? : 'shortcode_meta_box';
		$this->label 			= $args['label'] ? : 'shortcode Metabox';
		$this->post_type 		= $args['post_type'] ? : 'post';
		$this->context 			= $args['context'] ? : 'normal';
		$this->priority 		= $args['priority'] ? : 'high';
		$this->hook_priority 	= $args['hook_priority'] ? : 10;
		$this->fields 			= $args['fields'] ? : array();
        if ( $args !== null) {
		    self::hooks();
        }
	}

	function enqueue_scripts() {
        wp_enqueue_media();
        wp_enqueue_script( 'jquery' );
    }

	public function hooks(){
		add_action( 'add_meta_boxes' , array( $this, 'add_meta_box' ), $this->hook_priority );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'admin_head', array( $this, 'scripts' ) );
	}

	public function add_meta_box() {
		if( is_array( $this->post_type ) ){
			foreach ( $this->post_type as $post_type ) {
				add_meta_box( $this->meta_box_id, $this->label, array( $this, 'meta_fields_callback' ), $post_type, $this->context, $this->priority );
			}
		}
		else{
			add_meta_box( $this->meta_box_id, $this->label, array( $this, 'meta_fields_callback' ), $this->post_type, $this->context, $this->priority );
		}
	}

	public function meta_fields_callback() {
		global $post;
		foreach ( $this->fields as $field ) {
	        echo $this->field_text( $field );
			do_action( "shortcode_meta_field-{$field['name']}", $field, $post->post_type );
		}
		

	}
	
	public function field_text( $field ){
		global $post;
		$field['default'] = ( isset( $field['default'] ) ) ? $field['default'] : '';
		$value = get_post_meta( $post->ID, $field['name'], true ) != '' ? esc_attr ( get_post_meta( $post->ID, $field['name'], true ) ) : $field['default'];
		$class  = isset( $field['class'] ) && ! is_null( $field['class'] ) ? $field['class'] : 'shortcode-meta-field';
		$readonly  = isset( $field['readonly'] ) && ( $field['readonly'] == true ) ? " readonly" : "";
		$disabled  = isset( $field['disabled'] ) && ( $field['disabled'] == true ) ? " disabled" : "";

		$html	= sprintf( '<fieldset class="shortcode-row" id="shortcode_cmb_fieldset_%1$s">', $field['name'] );
        $html .= sprintf( '<i class="dashicons dashicons-search"></i>');
		$html	.= sprintf( '<label class="shortcode-label" for="shortcode_cmb_%1$s">%2$s</label>', $field['name'], $field['label']);

		$html  .= sprintf( '<input placeholder="type keywords here to search" type="text" class="%2$s" id="suggest_shortcode_cmb_%3$s" />', $field['type'], $class, $field['name'], $field['name'], $value, $readonly, $disabled );
		$html  .= sprintf( '<input type="hidden" id="shortcode_cmb_%3$s" name="%3$s" value="%5$s" %6$s %7$s/>', $field['type'], $class, $field['name'], $field['name'], $value, $readonly, $disabled );

		$html	.= $this->field_description( $field );
		$html	.= '</fieldset>';
        $html .= sprintf('<div id="ckan-suggest-box" style="display:none;"></div>');
        $html .= sprintf('<div class="result-box"><div>');
        $html .= sprintf('<div class="lds-ellipsis" style="display:none;"><div></div><div></div><div></div><div></div></div>');
		return $html;
	}

	public function field_description( $args ) {
        if ( ! empty( $args['desc'] ) ) {
        	if( isset( $args['desc_nop'] ) && $args['desc_nop'] ) {
        		$desc = sprintf( '<small class="shortcode-small">%s</small>', $args['desc'] );
        	} else{
        		$desc = sprintf( '<p class="description">%s</p>', $args['desc'] );
        	}
        } else {
            $desc = '';
        }

        return $desc;
    }

    function scripts() {
        ?>
        <script>
            jQuery(document).ready(function($) {
                $("#suggest_shortcode_cmb_ckan_dataset").on('input', function(){
                    let currentList = $(".listing-data");
                    if (currentList.length > 0) {
                        $('.listing-data').remove();
                    }
                    let thisBox = $(this);
                    showLists(thisBox);
                });

                function showLists(thisBox) {
                    $(".lds-ellipsis").show();
                    $.get("/wp-json/akvockan/v1?q=" + $(thisBox).val(), function(results){
                        $(".lds-ellipsis").hide();
                        results.forEach(function(data, index){
                            listingData(data);
                        });
                    });
                }

                function clipBoard(elementId) {
                    var aux = document.createElement("input");
                    aux.setAttribute("value", document.getElementById(elementId).innerHTML);
                    document.body.appendChild(aux);
                    aux.select();
                    document.execCommand("copy");
                    document.body.removeChild(aux);
                }


                function listingData(data) {
                    let html = "";
                    html += '<table style="min-width:100%;border:1px solid #eee;margin:5px 0px;padding:5px;">';
                    html += '<tr><td class="dataset-title" colspan=2>' + data.title + '</td></tr>';
                    html += '<tr><td class="vtop" width="20">Files</td><td>';
                    html += getresources(data);
                    html += '</td></tr>';
                    html += '<tr><td class="vtop">Total</td><td>';
                    if (data.resources.length > 1){
                        html += data.resources.length + ' Files';
                    }
                    if (data.resources.length === 1){
                        html += '1 File';
                    }
                    if (data.resources.length === 0){
                        html += 'No resource';
                    }
                    html += '</td></tr>';
                    html += '<tr><td class="vtop"><div id="copy-clip-'+data.id+'" class="button button-small button-secondary">Copy to Clipboard</div></td>'
                    html += '<td> <code id="clip-' +data.id+ '">[ckan id="'+data.id+'"]</code></td></tr>';
                    html += '</table>';
                    $('.result-box').append(html);
                    $('#copy-clip-'+ data.id).on('click',function() {
                        clipBoard('clip-' + data.id);
                    });
                }

                function getresources(data) {
                    let html = "";
                    data.resources.forEach(function(a, x) {
                        let at = a.format.toLowerCase();
                        let icon = at;
                        if (at === "akvo lumen") {
                            icon = 'lumen';
                        }
                        html += '<li class="data-listing">';
                        html += '<input type="checkbox" name="'+data.id+'" value="'+a.id+'" checked>'
                        html += a.name + '<code>' + at + '</code>';
                        html += '</li>';
                    });
                    return html;
                }

        });
        </script>

        <?php
    }

}

