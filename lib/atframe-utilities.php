<?php 
/**
 * atriumWeb custom utilities
 * @since 1.1.0
 * ================================================== */ 



/** 
 * Get proper title
 * @since 1.0.1
 **/

function get_atframe_title() {
	global $post;

	$acf_title = get_field('page_title');

	return ($acf_title) ? $acf_title : get_the_title( $post->ID );
}



/**
 * Get company info from ACF Options Page
 * The fields are prefixed with 'company_'
 * @since 1.1.0
 **/ 

function get_company_info( $field_id = null ) {

	if ( $field_id == null )
		return __('Du mangler at angive $field_id (felt-id fra acf)', 'atriumweb');

	$field = get_field($field_id, 'options');

	if ( empty($field) )
		return __('Felt ikke fundet', 'atriumweb');

	return $field;
}



/**
 * Locate template
 * @since 1.1.0
 **/

function atframe_locate_template( $template_name, $template_path = '' ) {
	if ( ! $template_path ) {
		$template_path = TEMPLATEPATH . '/partials/';
	}

	// Look within passed path within the theme - this is priority
	$template = locate_template( $template_path . $template_name . '.php');

	// Get default template
	if ( ! $template ) {
		$template = $template_path . $template_name . '.php';
	}

	// Return what we found
	return $template;
}



/**
 * Get template
 * @since 1.1.0
 **/

function atframe_get_template( $template_name, $args = array(), $echo = false, $template_path = '' ) {
	if ( $args && is_array( $args ) ) {
		extract( $args );
	}

	$located = atframe_locate_template( $template_name, $template_path );

	if ( ! file_exists( $located ) ) {
		_doing_it_wrong( __FUNCTION__, sprintf( '<code>%s</code> does not exist.', $located ), '1.0' );
		return;
	}

	if ( $echo != false ) {
		return include( $located );
	}	else {
		ob_start();
		include( $located );
		return ob_get_clean();
	}

	return __('Noget gik galt...', 'atriumweb');
}
 ?>