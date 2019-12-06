<?php

/**
 * @package  AkvoCkanPlugin
 */
namespace Inc\Base;

use Inc\Api\Callbacks\CkanApi;

class AkvoCkanMetabox {

	public $post_type;
	public $context;
	public $priority;
	public $hook_priority = 10;
	public $fields;
	public $meta_box_id;
	public $label;

	function __construct( $args = null ){
		$this->meta_box_id 		= $args['meta_box_id'] ? : 'akvockan_meta_box';
		$this->label 			= $args['label'] ? : 'akvockan Metabox';
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
		add_action( 'save_post', array( $this, 'save_meta_fields' ), 1, 2 );
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
		
		echo '<input type="hidden" name="akvockan_cmb_nonce" id="akvockan_cmb_nonce" value="' . 
		wp_create_nonce( plugin_basename( __FILE__ ) ) . '" />';
		
		foreach ( $this->fields as $field ) {

			if ( $field['type'] == 'text' || $field['type'] == 'number' || $field['type'] == 'email' || $field['type'] == 'url' || $field['type'] == 'password' ) {
				echo $this->field_text( $field );
			}
			elseif( $field['type'] == 'ckan' ){
				echo $this->field_ckan( $field );
			}
			elseif( $field['type'] == 'select' ){
				echo $this->field_select( $field );
			}
			elseif( $field['type'] == 'checkbox' ){
				echo $this->field_checkbox( $field );
			}
			elseif( $field['type'] == 'file' ){
				echo $this->field_file( $field );
			}
			elseif( $field['type'] == 'wysiwyg' ){
				echo $this->field_wysiwyg( $field );
			}

			do_action( "akvockan_meta_field-{$field['name']}", $field, $post->post_type );
		}
		

	}
	
	public function save_meta_fields( $post_id, $post ) {
		if (
			! isset( $_POST['akvockan_cmb_nonce'] ) ||
			! wp_verify_nonce( $_POST['akvockan_cmb_nonce'], plugin_basename( __FILE__ ) ) ||
			! current_user_can( 'edit_post', $post->ID ) ||
			$post->post_type == 'revision'
		) {
			return $post->ID;
		}

		foreach ( $this->fields as $field ){
			$key = $field['name'];
			$meta_values[$key] = $_POST[$key];
		}

		foreach ( $meta_values as $key => $value ) {
			$value = implode( ',', (array) $value );
			if( get_post_meta( $post->ID, $key, FALSE )) {
				update_post_meta( $post->ID, $key, $value );
			} else {
				add_post_meta( $post->ID, $key, $value );
			}
			if( ! $value ) delete_post_meta( $post->ID, $key );
		}

	}

	public function field_text( $field ){
		global $post;
		$field['default'] = ( isset( $field['default'] ) ) ? $field['default'] : '';
		$value = get_post_meta( $post->ID, $field['name'], true ) != '' ? esc_attr ( get_post_meta( $post->ID, $field['name'], true ) ) : $field['default'];
		$class  = isset( $field['class'] ) && ! is_null( $field['class'] ) ? $field['class'] : 'akvockan-meta-field';
		$readonly  = isset( $field['readonly'] ) && ( $field['readonly'] == true ) ? " readonly" : "";
		$disabled  = isset( $field['disabled'] ) && ( $field['disabled'] == true ) ? " disabled" : "";

		$html	= sprintf( '<fieldset class="akvockan-row" id="akvockan_cmb_fieldset_%1$s">', $field['name'] );
		$html	.= sprintf( '<label class="akvockan-label" for="akvockan_cmb_%1$s">%2$s</label>', $field['name'], $field['label']);

		$html  .= sprintf( '<input type="%1$s" class="%2$s" id="akvockan_cmb_%3$s" name="%3$s" value="%5$s" %6$s %7$s/>', $field['type'], $class, $field['name'], $field['name'], $value, $readonly, $disabled );

		$html	.= $this->field_description( $field );
		$html	.= '</fieldset>';
		return $html;
	}

	public function field_ckan( $field ){
		global $post;
		$field['default'] = ( isset( $field['default'] ) ) ? $field['default'] : '';
		$value = get_post_meta( $post->ID, $field['name'], true ) != '' ? esc_attr ( get_post_meta( $post->ID, $field['name'], true ) ) : $field['default'];
		$class  = isset( $field['class'] ) && ! is_null( $field['class'] ) ? $field['class'] : 'akvockan-meta-field';
		$readonly  = isset( $field['readonly'] ) && ( $field['readonly'] == true ) ? " readonly" : "";
		$disabled  = isset( $field['disabled'] ) && ( $field['disabled'] == true ) ? " disabled" : "";

		$html	= sprintf( '<fieldset class="akvockan-row" id="akvockan_cmb_fieldset_%1$s">', $field['name'] );
        $html .= sprintf( '<i class="dashicons dashicons-search"></i>');
		$html	.= sprintf( '<label class="akvockan-label" for="akvockan_cmb_%1$s">%2$s</label>', $field['name'], $field['label']);

		$html  .= sprintf( '<input placeholder="type keywords here to search" type="text" class="%2$s" id="suggest_akvockan_cmb_%3$s" />', $field['type'], $class, $field['name'], $field['name'], $value, $readonly, $disabled );
		$html  .= sprintf( '<input type="hidden" id="akvockan_cmb_%3$s" name="%3$s" value="%5$s" %6$s %7$s/>', $field['type'], $class, $field['name'], $field['name'], $value, $readonly, $disabled );

		$html	.= $this->field_description( $field );
		$html	.= '</fieldset>';
        $html .= sprintf('<div id="ckan-suggest-box" style="display:none;"></div>');
        $html .= sprintf('<div class="lds-ellipsis" style="display:none;"><div></div><div></div><div></div><div></div></div>');
		return $html;
	}

	public function field_checkbox( $field ){
		global $post;
		$field['default'] = ( isset( $field['default'] ) ) ? $field['default'] : '';
		$value = get_post_meta( $post->ID, $field['name'], true ) != '' ? esc_attr (get_post_meta( $post->ID, $field['name'], true ) ) : $field['default'];
		$class  = isset( $field['class'] ) && ! is_null( $field['class'] ) ? $field['class'] : 'akvockan-meta-field';
		$disabled  = isset( $field['disabled'] ) && ( $field['disabled'] == true ) ? " disabled" : "";

		$html	= sprintf( '<fieldset class="akvockan-row" id="akvockan_cmb_fieldset_%1$s">', $field['name'] );
		$html	.= sprintf( '<label class="akvockan-label" for="akvockan_cmb_%1$s">%2$s</label>', $field['name'], $field['label']);

		$html  .= sprintf( '<input type="checkbox" class="checkbox" id="akvockan_cmb_%1$s" name="%1$s" value="on" %2$s %3$s />', $field['name'], checked( $value, 'on', false ), $disabled );

		$html .= $this->field_description( $field, true ) . '';
		$html	.= '</fieldset>';
		return $html;
	}

	public function field_select( $field ){
		global $post;
		$field['default'] = ( isset( $field['default'] ) ) ? $field['default'] : '';
		$value = get_post_meta( $post->ID, $field['name'], true ) != '' ? esc_attr ( get_post_meta( $post->ID, $field['name'], true ) ) : $field['default'];
		$class  = isset( $field['class'] ) && ! is_null( $field['class'] ) ? $field['class'] : 'akvockan-meta-field';
		$disabled  = isset( $field['disabled'] ) && ( $field['disabled'] == true ) ? " disabled" : "";
		$multiple  = isset( $field['multiple'] ) && ( $field['multiple'] == true ) ? " multiple" : "";
		$name 	   = isset( $field['multiple'] ) && ( $field['multiple'] == true ) ? $field['name'] . '[]' : $field['name'];

		$html	= sprintf( '<fieldset class="akvockan-row" id="akvockan_cmb_fieldset_%1$s">', $field['name'] );
        $html	.= sprintf( '<label class="akvockan-label" for="akvockan_cmb_%1$s">%2$s</label>', $field['name'], $field['label']);
        $html   .= sprintf( '<select class="%1$s" name="%2$s" id="akvockan_cmb_%2$s" %3$s %4$s>', $class, $name, $disabled, $multiple );

        if( $multiple == '' ) { 

        foreach ( $field['options'] as $key => $label ) {
            $html .= sprintf( '<option value="%s"%s>%s</option>', $key, selected( $value, $key, false ), $label );
        }

        } else{

            $values = explode( ',', $value );
            foreach ( $field['options'] as $key => $label ) {
                $selected = in_array( $key, $values ) && $key != '' ? ' selected' : '';
                $html .= sprintf( '<option value="%s"%s>%s</option>', $key, $selected, $label );
            }
        }


        $html .= sprintf( '</select>' );
        $html .= $this->field_description( $field );
        $html	.= '</fieldset>';
        return $html;
	}

	public function field_file( $field ){
		global $post;
		$value = get_post_meta( $post->ID, $field['name'], true ) != '' ? esc_attr (get_post_meta( $post->ID, $field['name'], true ) ) : $field['default'];
		$class  = isset( $field['class'] ) && ! is_null( $field['class'] ) ? $field['class'] : 'akvockan-meta-field';
		$disabled  = isset( $field['disabled'] ) && ( $field['disabled'] == true ) ? " disabled" : "";

        $id    = $field['name']  . '[' . $field['name'] . ']';
        $upload_button = isset( $field['upload_button'] ) ? $field['upload_button'] : __( 'Choose File' );
        $select_button = isset( $field['select_button'] ) ? $field['select_button'] : __( 'Select' );
        
        $html	= sprintf( '<fieldset class="akvockan-row" id="akvockan_cmb_fieldset_%1$s">', $field['name'] );
        $html	.= sprintf( '<label class="akvockan-label" for="akvockan_cmb_%1$s">%2$s</label>', $field['name'], $field['label']);
        $html  .= sprintf( '<input type="text" class="%1$s-text akvockan-file" id="akvockan_cmb_%2$s" name="%2$s" value="%3$s" %4$s />', $class, $field['name'], $value, $disabled );
        $html  .= '<input type="button" class="button akvockan-browse" data-title="' . $field['label'] . '" data-select-text="' . $select_button . '" value="' . $upload_button . '" ' . $disabled . ' />';
        $html  .= $this->field_description( $field );
        $html	.= '</fieldset>';
        return $html;
	}

	public function field_wysiwyg( $field ){
		global $post;
		$value = get_post_meta( $post->ID, $field['name'], true ) != '' ? get_post_meta( $post->ID, $field['name'], true ) : $field['default'];
		$class  = isset( $field['class'] ) && ! is_null( $field['class'] ) ? $field['class'] : 'akvockan-meta-field';
		$width  = isset( $field['width'] ) && ! is_null( $field['width'] ) ? $field['width'] : '500px';
		$teeny  = isset( $field['teeny'] ) && ( $field['teeny'] == true ) ? true : false;
		$text_mode  = isset( $field['text_mode'] ) && ( $field['text_mode'] == true ) ? true : false;
		$media_buttons  = isset( $field['media_buttons'] ) && ( $field['media_buttons'] == true ) ? true : false;
		$rows  = isset( $field['rows'] ) ? $field['rows'] : 10;

		$html	= sprintf( '<fieldset class="akvockan-row" id="akvockan_cmb_fieldset_%1$s">', $field['name'] );
        $html	.= sprintf( '<label class="akvockan-label" for="akvockan_cmb_%1$s">%2$s</label>', $field['name'], $field['label']);
        $html	.= '<div style="width: ' . $width . '; float:right">';

        $editor_settings = array(
            'teeny'         => $teeny,
            'textarea_name' => $field['name'],
            'textarea_rows' => $rows,
            'quicktags'		=> $text_mode,
            'media_buttons'		=> $media_buttons,
        );

        if ( isset( $field['options'] ) && is_array( $field['options'] ) ) {
            $editor_settings = array_merge( $editor_settings, $field['options'] );
        }

        ob_start();
        wp_editor( $value, $field['name'], $editor_settings );
		$html .= ob_get_contents();
		ob_end_clean();
        
        $html	.= '</div>';
        $html	.= '</fieldset>';
        return $html;
	}

	public function field_description( $args ) {
        if ( ! empty( $args['desc'] ) ) {
        	if( isset( $args['desc_nop'] ) && $args['desc_nop'] ) {
        		$desc = sprintf( '<small class="akvockan-small">%s</small>', $args['desc'] );
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
                let defaultValue = $("#akvockan_cmb_ckan_dataset").val();
                if (typeof defaultValue !== undefined) {
                    $(".lds-ellipsis").show();
                    $.get("/wp-json/akvockan/v1?id=" + defaultValue, function(data){
                        $(".lds-ellipsis").hide();
                        $("#ckan-suggest-box").children().remove();
                        $("#ckan-suggest-box").show();
                        showDataList(data, 1);
                    });
                }
                $("#suggest_akvockan_cmb_ckan_dataset").on('input', function(){
                    $("#ckan-suggest-box").children().remove();
                    $("#ckan-suggest-box").show();
                    let thisBox = $(this);
                    showData(thisBox);
                });

                function showData(thisBox) {
                    $(".lds-ellipsis").show();
                    $.get("/wp-json/akvockan/v1?q=" + $(thisBox).val(), function(results){
                        $(".lds-ellipsis").hide();
                        results.forEach(function(data, index){
                            showDataList(data, 0)
                        });
                    });
                }

                function showDataList(data, defaultStatus) {
                    var html = "<table class='ckan-list' id='"+ data.id +"'>"
                    html += "<tr class='title'><td>";
                    html += "<div id='button_" + data.id + "' class='button button-small button-secondary'>Attach</div></td>"
                    html += "<td>"+ data.title +"</tr>"
                    html += "<tr><td class='name'>Author</td><td>"+ data.author +"</td></tr>"
                    html += "<tr><td class='name'>Organisation</td><td>"+ data.organization.title +"</td></tr>"
                    html += "<tr><td class='name'>Resources</td><td>"
                    if (data.resources.length > 0) {
                        html += "<ul>";
                        data.resources.forEach(function(a, x){
                            if (x < 5){
                                html += "<li>";
                                html += "<kbd>" + a.format + "</kbd>";
                                html += "<a href='"+ a.url +"' target='_blank'>" + a.name +"</a>";
                                html += "</li>";
                            } 
                            if (x === 5) {
                                html += "</br></br>... and " + data.resources.length + " more datasets</br>";
                            }                                })
                        html += "</ul></td></tr>"
                    } else {
                        html += "No Data Available";
                    }
                    html += "</table>"
                    $("#ckan-suggest-box").append(html);
                    $('#button_' + data.id).click(function(event){
						$('#' + data.id).siblings().remove();
						$("#akvockan_cmb_ckan_dataset").val(data.id);
						if ($("#akvockan_cmb_fieldset_ckan_dataset").is(':visible')) {
							$("#suggest_akvockan_cmb_ckan_dataset").hide();
							$("#akvockan_cmb_fieldset_ckan_dataset").hide();
							$('#button_' + data.id).text('Change');
							$('#button_' + data.id).removeClass('button-secondary').addClass('button-primary');
						} else {
							$("#suggest_akvockan_cmb_ckan_dataset").show();
							$("#akvockan_cmb_fieldset_ckan_dataset").show();
							$('#button_' + data.id).text('Attach');
							$('#button_' + data.id).removeClass('button-primary').addClass('button-secondary');
						}
					});
					if(defaultStatus === 1) {
						$("#suggest_akvockan_cmb_ckan_dataset").hide();
						$("#akvockan_cmb_fieldset_ckan_dataset").hide();
						$('#button_' + data.id).text('Change');
						$('#button_' + data.id).removeClass('button-secondary').addClass('button-primary');
					}
                }

                function attachData(data) {
                    $("#suggest_akvockan_cmb_ckan_dataset").value(data); 
                }

                // media uploader
                $('.akvockan-browse').on('click', function (event) {
                    event.preventDefault();

                    var self = $(this);

                    var file_frame = wp.media.frames.file_frame = wp.media({
                        title: self.data('title'),
                        button: {
                            text: self.data('select-text'),
                        },
                        multiple: false
                    });

                    file_frame.on('select', function () {
                        attachment = file_frame.state().get('selection').first().toJSON();

                        self.prev('.akvockan-file').val(attachment.url);
                        $('.supports-drag-drop').hide()
                    });

                    file_frame.open();
                });
        });
        </script>

        <?php
    }

}

