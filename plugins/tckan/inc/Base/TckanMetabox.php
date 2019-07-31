<?php

/**
 * @package  TckanPlugin
 */
namespace Inc\Base;

use Inc\Api\Callbacks\CkanApi;

class TckanMetabox {

	/**
	 * @var string|array $post_type post types to add meta box to.
	 */
	public $post_type;

	/**
	 * @var string $context side|normal|advanced location of the meta box.
	 */
	public $context;

	/**
	 * @var string $priority high|low position of the meta box.
	 */
	public $priority;

	/**
	 * @var string $hook_priority priority of triggering thie hook. Default is 10.
	 */
	public $hook_priority = 10;

	/**
	 * @var array $fields meta fields to be added.
	 */
	public $fields;

	/**
	 * @var string $meta_box_id meta box id.
	 */
	public $meta_box_id;

	/**
	 * @var string $label meta box label.
	 */
	public $label;

	function __construct( $args = null ){
		$this->meta_box_id 		= $args['meta_box_id'] ? : 'tckan_meta_box';
		$this->label 			= $args['label'] ? : 'TCKAN Metabox';
		$this->post_type 		= $args['post_type'] ? : 'post';
		$this->context 			= $args['context'] ? : 'normal';
		$this->priority 		= $args['priority'] ? : 'high';
		$this->hook_priority 	= $args['hook_priority'] ? : 10;
		$this->fields 			= $args['fields'] ? : array();

		self::hooks();
	}

	function enqueue_scripts() {
        wp_enqueue_style( 'wp-color-picker' );
        wp_enqueue_media();
        wp_enqueue_script( 'wp-color-picker' );
        wp_enqueue_script( 'jquery' );
    }

	public function hooks(){
		add_action( 'add_meta_boxes' , array( $this, 'add_meta_box' ), $this->hook_priority );
		add_action( 'save_post', array( $this, 'save_meta_fields' ), 1, 2 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'admin_head', array( $this, 'scripts' ) );
        add_action( 'rest_api_init', function () { 
            register_rest_route( 'tckan', '/v1', array(
                'methods' => 'GET',
                'callback' => array($this,'get_ckan_data'),
            ));
        } );
	}

    public function get_ckan_data() {
        $ckan = new CkanApi();
        return $ckan->searchData();
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
		
		echo '<input type="hidden" name="tckan_cmb_nonce" id="tckan_cmb_nonce" value="' . 
		wp_create_nonce( plugin_basename( __FILE__ ) ) . '" />';
		
		foreach ( $this->fields as $field ) {

			if ( $field['type'] == 'text' || $field['type'] == 'number' || $field['type'] == 'email' || $field['type'] == 'url' || $field['type'] == 'password' ) {
				echo $this->field_text( $field );
			}
			elseif( $field['type'] == 'textarea' ){
				echo $this->field_textarea( $field );
			}
			elseif( $field['type'] == 'ckan' ){
				echo $this->field_ckan( $field );
			}
			elseif( $field['type'] == 'radio' ){
				echo $this->field_radio( $field );
			}
			elseif( $field['type'] == 'select' ){
				echo $this->field_select( $field );
			}
			elseif( $field['type'] == 'checkbox' ){
				echo $this->field_checkbox( $field );
			}
			elseif( $field['type'] == 'color' ){
				echo $this->field_color( $field );
			}
			elseif( $field['type'] == 'file' ){
				echo $this->field_file( $field );
			}
			elseif( $field['type'] == 'wysiwyg' ){
				echo $this->field_wysiwyg( $field );
			}

			do_action( "tckan_meta_field-{$field['name']}", $field, $post->post_type );
		}
		

	}
	
	public function save_meta_fields( $post_id, $post ) {
		if (
			! isset( $_POST['tckan_cmb_nonce'] ) ||
			! wp_verify_nonce( $_POST['tckan_cmb_nonce'], plugin_basename( __FILE__ ) ) ||
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
		$class  = isset( $field['class'] ) && ! is_null( $field['class'] ) ? $field['class'] : 'tckan-meta-field';
		$readonly  = isset( $field['readonly'] ) && ( $field['readonly'] == true ) ? " readonly" : "";
		$disabled  = isset( $field['disabled'] ) && ( $field['disabled'] == true ) ? " disabled" : "";

		$html	= sprintf( '<fieldset class="tckan-row" id="tckan_cmb_fieldset_%1$s">', $field['name'] );
		$html	.= sprintf( '<label class="tckan-label" for="tckan_cmb_%1$s">%2$s</label>', $field['name'], $field['label']);

		$html  .= sprintf( '<input type="%1$s" class="%2$s" id="tckan_cmb_%3$s" name="%3$s" value="%5$s" %6$s %7$s/>', $field['type'], $class, $field['name'], $field['name'], $value, $readonly, $disabled );

		$html	.= $this->field_description( $field );
		$html	.= '</fieldset>';
		return $html;
	}

	public function field_ckan( $field ){
		global $post;
		$field['default'] = ( isset( $field['default'] ) ) ? $field['default'] : '';
		$value = get_post_meta( $post->ID, $field['name'], true ) != '' ? esc_attr ( get_post_meta( $post->ID, $field['name'], true ) ) : $field['default'];
		$class  = isset( $field['class'] ) && ! is_null( $field['class'] ) ? $field['class'] : 'tckan-meta-field';
		$readonly  = isset( $field['readonly'] ) && ( $field['readonly'] == true ) ? " readonly" : "";
		$disabled  = isset( $field['disabled'] ) && ( $field['disabled'] == true ) ? " disabled" : "";

		$html	= sprintf( '<fieldset class="tckan-row" id="tckan_cmb_fieldset_%1$s">', $field['name'] );
        $html .= sprintf( '<i class="dashicons dashicons-search"></i>');
		$html	.= sprintf( '<label class="tckan-label" for="tckan_cmb_%1$s">%2$s</label>', $field['name'], $field['label']);

		$html  .= sprintf( '<input placeholder="type then enter to search suggestion" type="text" class="%2$s" id="suggest_tckan_cmb_%3$s" />', $field['type'], $class, $field['name'], $field['name'], $value, $readonly, $disabled );
		$html  .= sprintf( '<input type="hidden" id="tckan_cmb_%3$s" name="%3$s" value="%5$s" %6$s %7$s/>', $field['type'], $class, $field['name'], $field['name'], $value, $readonly, $disabled );

		$html	.= $this->field_description( $field );
		$html	.= '</fieldset>';
        $html .= sprintf('<div id="ckan-suggest-box" style="display:none;"></div>');
        $html .= sprintf('<div class="lds-ellipsis" style="display:none;"><div></div><div></div><div></div><div></div></div>');
		return $html;
	}

	public function field_textarea( $field ){
		global $post;
		$value = get_post_meta( $post->ID, $field['name'], true ) != '' ? esc_attr (get_post_meta( $post->ID, $field['name'], true ) ) : $field['default'];
		$class  = isset( $field['class'] ) && ! is_null( $field['class'] ) ? $field['class'] : 'tckan-meta-field';
		$cols  = isset( $field['columns'] ) ? $field['columns'] : 24;
		$rows  = isset( $field['rows'] ) ? $field['rows'] : 5;
		$readonly  = isset( $field['readonly'] ) && ( $field['readonly'] == true ) ? " readonly" : "";
		$disabled  = isset( $field['disabled'] ) && ( $field['disabled'] == true ) ? " disabled" : "";

		$html	= sprintf( '<fieldset class="tckan-row" id="tckan_cmb_fieldset_%1$s">', $field['name'] );
		$html	.= sprintf( '<label class="tckan-label" for="tckan_cmb_%1$s">%2$s</label>', $field['name'], $field['label']);

		$html  .= sprintf( '<textarea rows="' . $rows . '" cols="' . $cols . '" class="%1$s-text" id="tckan_cmb_%2$s" name="%3$s" %4$s %5$s >%6$s</textarea>', $class, $field['name'], $field['name'], $readonly, $disabled, $value );

		$html .= $this->field_description( $field );
		$html	.= '</fieldset>';

		return $html;
	}

	public function field_radio( $field ){
		global $post;
		$value = get_post_meta( $post->ID, $field['name'], true ) != '' ? esc_attr (get_post_meta( $post->ID, $field['name'], true ) ) : $field['default'];
		$class  = isset( $field['class'] ) && ! is_null( $field['class'] ) ? $field['class'] : 'tckan-meta-field';
		$disabled  = isset( $field['disabled'] ) && ( $field['disabled'] == true ) ? " disabled" : "";

        $html	= sprintf( '<fieldset class="tckan-row" id="tckan_cmb_fieldset_%1$s">', $field['name'] );
        $html .= '<label class="tckan-label">'.$field['label'].'</label>';
        foreach ( $field['options'] as $key => $label ) {
            $html .= sprintf( '<label for="%1$s[%2$s]">', $field['name'], $key );

            $html .= sprintf( '<input type="radio" class="radio %1$s" id="%2$s[%3$s]" name="%2$s" value="%3$s" %4$s %5$s />', $class, $field['name'], $key, checked( $value, $key, false ), $disabled );

            $html .= sprintf( '%1$s</label>', $label );
        }

        $html .= $this->field_description( $field );
        $html .= '</fieldset>';

        return $html;
	}

	public function field_checkbox( $field ){
		global $post;
		$field['default'] = ( isset( $field['default'] ) ) ? $field['default'] : '';
		$value = get_post_meta( $post->ID, $field['name'], true ) != '' ? esc_attr (get_post_meta( $post->ID, $field['name'], true ) ) : $field['default'];
		$class  = isset( $field['class'] ) && ! is_null( $field['class'] ) ? $field['class'] : 'tckan-meta-field';
		$disabled  = isset( $field['disabled'] ) && ( $field['disabled'] == true ) ? " disabled" : "";

		$html	= sprintf( '<fieldset class="tckan-row" id="tckan_cmb_fieldset_%1$s">', $field['name'] );
		$html	.= sprintf( '<label class="tckan-label" for="tckan_cmb_%1$s">%2$s</label>', $field['name'], $field['label']);

		$html  .= sprintf( '<input type="checkbox" class="checkbox" id="tckan_cmb_%1$s" name="%1$s" value="on" %2$s %3$s />', $field['name'], checked( $value, 'on', false ), $disabled );

		$html .= $this->field_description( $field, true ) . '';
		$html	.= '</fieldset>';
		return $html;
	}

	public function field_select( $field ){
		global $post;
		$field['default'] = ( isset( $field['default'] ) ) ? $field['default'] : '';
		$value = get_post_meta( $post->ID, $field['name'], true ) != '' ? esc_attr ( get_post_meta( $post->ID, $field['name'], true ) ) : $field['default'];
		$class  = isset( $field['class'] ) && ! is_null( $field['class'] ) ? $field['class'] : 'tckan-meta-field';
		$disabled  = isset( $field['disabled'] ) && ( $field['disabled'] == true ) ? " disabled" : "";
		$multiple  = isset( $field['multiple'] ) && ( $field['multiple'] == true ) ? " multiple" : "";
		$name 	   = isset( $field['multiple'] ) && ( $field['multiple'] == true ) ? $field['name'] . '[]' : $field['name'];

		$html	= sprintf( '<fieldset class="tckan-row" id="tckan_cmb_fieldset_%1$s">', $field['name'] );
        $html	.= sprintf( '<label class="tckan-label" for="tckan_cmb_%1$s">%2$s</label>', $field['name'], $field['label']);
        $html   .= sprintf( '<select class="%1$s" name="%2$s" id="tckan_cmb_%2$s" %3$s %4$s>', $class, $name, $disabled, $multiple );

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

	public function field_color( $field ){
		global $post;
		$value = get_post_meta( $post->ID, $field['name'], true ) != '' ? esc_attr (get_post_meta( $post->ID, $field['name'], true ) ) : $field['default'];
		$class  = isset( $field['class'] ) && ! is_null( $field['class'] ) ? $field['class'] : 'tckan-meta-field';

		$html  = sprintf( '<fieldset class="tckan-row" id="tckan_cmb_fieldset_%1$s">', $field['name'] );
		$html .= sprintf( '<label class="tckan-label" for="tckan_cmb_%1$s">%2$s</label>', $field['name'], $field['label']);

        $html .= sprintf( '<input type="text" class="%1$s-text wp-color-picker-field" id="tckan_cmb_%2$s" name="%2$s" value="%4$s" data-default-color="%5$s" />', $class, $field['name'], $field['name'], $value, $field['default'] );

		$html .= $this->field_description( $field );
		$html .= '</fieldset>';

        return $html;
	}

	public function field_file( $field ){
		global $post;
		$value = get_post_meta( $post->ID, $field['name'], true ) != '' ? esc_attr (get_post_meta( $post->ID, $field['name'], true ) ) : $field['default'];
		$class  = isset( $field['class'] ) && ! is_null( $field['class'] ) ? $field['class'] : 'tckan-meta-field';
		$disabled  = isset( $field['disabled'] ) && ( $field['disabled'] == true ) ? " disabled" : "";

        $id    = $field['name']  . '[' . $field['name'] . ']';
        $upload_button = isset( $field['upload_button'] ) ? $field['upload_button'] : __( 'Choose File' );
        $select_button = isset( $field['select_button'] ) ? $field['select_button'] : __( 'Select' );
        
        $html	= sprintf( '<fieldset class="tckan-row" id="tckan_cmb_fieldset_%1$s">', $field['name'] );
        $html	.= sprintf( '<label class="tckan-label" for="tckan_cmb_%1$s">%2$s</label>', $field['name'], $field['label']);
        $html  .= sprintf( '<input type="text" class="%1$s-text tckan-file" id="tckan_cmb_%2$s" name="%2$s" value="%3$s" %4$s />', $class, $field['name'], $value, $disabled );
        $html  .= '<input type="button" class="button tckan-browse" data-title="' . $field['label'] . '" data-select-text="' . $select_button . '" value="' . $upload_button . '" ' . $disabled . ' />';
        $html  .= $this->field_description( $field );
        $html	.= '</fieldset>';
        return $html;
	}

	public function field_wysiwyg( $field ){
		global $post;
		$value = get_post_meta( $post->ID, $field['name'], true ) != '' ? get_post_meta( $post->ID, $field['name'], true ) : $field['default'];
		$class  = isset( $field['class'] ) && ! is_null( $field['class'] ) ? $field['class'] : 'tckan-meta-field';
		$width  = isset( $field['width'] ) && ! is_null( $field['width'] ) ? $field['width'] : '500px';
		$teeny  = isset( $field['teeny'] ) && ( $field['teeny'] == true ) ? true : false;
		$text_mode  = isset( $field['text_mode'] ) && ( $field['text_mode'] == true ) ? true : false;
		$media_buttons  = isset( $field['media_buttons'] ) && ( $field['media_buttons'] == true ) ? true : false;
		$rows  = isset( $field['rows'] ) ? $field['rows'] : 10;

		$html	= sprintf( '<fieldset class="tckan-row" id="tckan_cmb_fieldset_%1$s">', $field['name'] );
        $html	.= sprintf( '<label class="tckan-label" for="tckan_cmb_%1$s">%2$s</label>', $field['name'], $field['label']);
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
        		$desc = sprintf( '<small class="tckan-small">%s</small>', $args['desc'] );
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
                $("#suggest_tckan_cmb_ckan_dataset").change(function(){
                    $("#ckan-suggest-box").children().remove();
                    $("#ckan-suggest-box").show();
                    $(".lds-ellipsis").show();
                    $.get("/wp-json/tckan/v1?q=" + $(this).val(), function(results){
                        $(".lds-ellipsis").hide();
                        results.forEach(function(data, index){
                        var html = "<table class='ckan-list' id='"+ data.id +"'>"
                            html += "<tr class='title'><td>";
                            html += "<button id='button_" + data.id + "' class='button button-small button-secondary'>Attach</button></td>"
                            html += "<td>"+ data.title +"</tr>"
                            html += "<tr><td class='name'>Author</td><td>"+ data.author +"</td></tr>"
                            html += "<tr><td class='name'>Organisation</td><td>"+ data.organization.title +"</td></tr>"
                            html += "<tr><td class='name'>Resources</td><td>"
                            if (data.resources.length > 0) {
                                html += "<ul>";
                                data.resources.forEach(function(a, x){
                                    if (x < 5){
                                        html += "<li><a href='"+ a.url +"' target='_blank'>" + a.name +"</a> <kbd>" + a.format + "</kbd></li>";
                                    } else if (x === 5) {
                                        html += "</br></br>... and " + data.resources.length + " more datasets</br>";
                                    } else {
                                        console.log(a);
                                    }
                                })
                                html += "</ul></td></tr>"
                            } else {
                                html += "No Data Available";
                            }
                            html += "</table>"
                            $("#ckan-suggest-box").append(html);
                            $('#button_' + data.id).click(function(){
                                $('#' + data.id).siblings().remove();
                                $(this).removeClass('button-secondary').addClass('button-primary');
                                $(this).text('Attached');
                                $("#tckan_cmb_ckan_dataset").val(data.id);
                            });
                        });
                    });
                });

                function attachData(data) {
                    $("#suggest_tckan_cmb_ckan_dataset").value(data); 
                }

                //color picker
                $('.wp-color-picker-field').wpColorPicker();

                // media uploader
                $('.tckan-browse').on('click', function (event) {
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

                        self.prev('.tckan-file').val(attachment.url);
                        $('.supports-drag-drop').hide()
                    });

                    file_frame.open();
                });
        });
        </script>

        <style type="text/css">
            /* version 3.8 fix */
            input#suggest_tckan_cmb_ckan_dataset {
                margin: 0px;
                padding: 10px;
                border: none;
                box-shadow: none;
                border-bottom: 1px solid #ddd;
                padding-left: 30px;
            }
            .tckan-row i { 
                position: absolute;
                top: 35px;
                left: 20px;
                color: #9ea3a9;
            }
            .ckan-list { border: 1px solid #ddd; margin-bottom: 20px; width: 100%; }
            .ckan-list td { vertical-align: baseline; padding: 5px; }
            .ckan-list tr.title { font-weight: bold; font-size: 14px; background:#eee;}
            .ckan-list td.name { width:20%; font-weight: bold; }
            .form-table th { padding: 20px 10px; }
            .tckan-row { border-bottom: 1px solid #ebebeb; padding: 8px 4px; }
            .tckan-row:last-child { border-bottom: 0px;}
            .tckan-row .tckan-label {display: inline-block; vertical-align: top; width: 200px; font-size: 15px; line-height: 24px;}
            .tckan-row .tckan-browse { width: 96px;}
            .tckan-row .tckan-file { width: calc( 100% - 110px ); margin-right: 4px; line-height: 20px;}
            .lds-ellipsis {
              display: inline-block;
              position: relative;
              width: 64px;
              height: 64px;
            }
            .lds-ellipsis div {
              background: #2d84bb;
              position: absolute;
              top: 27px;
              width: 11px;
              height: 11px;
              border-radius: 50%;
              animation-timing-function: cubic-bezier(0, 1, 1, 0);
            }
            .lds-ellipsis div:nth-child(1) {
              left: 6px;
              animation: lds-ellipsis1 0.6s infinite;
            }
            .lds-ellipsis div:nth-child(2) {
              left: 6px;
              animation: lds-ellipsis2 0.6s infinite;
            }
            .lds-ellipsis div:nth-child(3) {
              left: 26px;
              animation: lds-ellipsis2 0.6s infinite;
            }
            .lds-ellipsis div:nth-child(4) {
              left: 45px;
              animation: lds-ellipsis3 0.6s infinite;
            }
            @keyframes lds-ellipsis1 {
              0% {
                transform: scale(0);
              }
              100% {
                transform: scale(1);
              }
            }
            @keyframes lds-ellipsis3 {
              0% {
                transform: scale(1);
              }
              100% {
                transform: scale(0);
              }
            }
            @keyframes lds-ellipsis2 {
              0% {
                transform: translate(0, 0);
              }
              100% {
                transform: translate(19px, 0);
              }
            }
            #postbox-container-1 .tckan-meta-field, #postbox-container-1 .tckan-meta-field-text {width: 100%;}
            #postbox-container-2 .tckan-meta-field, #postbox-container-2 .tckan-meta-field-text {width: 100%;}
            #postbox-container-1 .tckan-meta-field-text.tckan-file { width: calc(100% - 101px) }
            #postbox-container-2 .tckan-meta-field-text.tckan-file { width: calc(100% - 306px) }
            #wpbody-content .metabox-holder { padding-top: 5px; }
        </style>
        <?php
    }
}

