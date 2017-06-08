<?php 
/**
 * Custom shortcodes
 **/ 


/**
 * Row shortcode for resetting and clearing columns
 * @param $atts A set of optional attributes
 * @param $content The content to wrap
 **/ 

function row_shortcode( $atts, $content = null ) {

	$atts = shortcode_atts( array(
		'xclass' => false,
		'data'	=> false
	), $atts );
	
	$class = 'row';
	$class .= ( $atts['xclass'] ) ? ' ' . $atts['xclass'] : '';

	$data = ( $atts['data'] ) ? ' data-' . $atts['data'] : '';

	return sprintf(
		'<div class="%s"%s>%s</div>',
		esc_attr( $class ),
		$data,
		do_shortcode( $content )
	);

}

add_shortcode('row', 'row_shortcode');



/**
 * Column shortcode via Bootstrap classes
 * @param $atts A set of optional attributes
 * @param $content The content to wrap
 **/ 

function column_shortcode( $atts, $content = null ) {
	
	/**
	 * Attributes
	 **/ 

	$atts = shortcode_atts( array(
		// Regular columns
		'xs'				=> false,
		'sm'				=> false,
		'md'				=> false,
		'lg'				=> false,
		'hd'				=> false,

		// Offset
		'xs_offset'		=> false,
		'sm_offset'		=> false,
		'md_offset'		=> false,
		'lg_offset'		=> false,
		'hd_offset'		=> false,

		// Pull
		'xs_pull'		=> false,
		'sm_pull'		=> false,
		'md_pull'		=> false,
		'lg_pull'		=> false,
		'hd_pull'		=> false,

		// Push
		'xs_push'		=> false,
		'sm_push'		=> false,
		'md_push'		=> false,
		'lg_push'		=> false,
		'hd_push'		=> false,

		// Extra
		'xclass'			=> false,
		'data'			=> false

	), $atts);


	/**
	 * Append classes
	 **/ 

	$class = '';

	// Regular columns
	$class .= ( $atts['xs'] ) ? ' col-xs-' . $atts['xs'] : '';
	$class .= ( $atts['sm'] ) ? ' col-sm-' . $atts['sm'] : '';
	$class .= ( $atts['md'] ) ? ' col-md-' . $atts['md'] : '';
	$class .= ( $atts['lg'] ) ? ' col-lg-' . $atts['lg'] : '';
	$class .= ( $atts['hd'] ) ? ' col-hd-' . $atts['hd'] : '';

	// Offset classes
	$class .= ( $atts['xs_offset'] || $atts['xs'] === '0' ) ? ' col-xs-offset-' . $atts['xs_offset'] : '';
	$class .= ( $atts['sm_offset'] || $atts['sm'] === '0' ) ? ' col-sm-offset-' . $atts['sm_offset'] : '';
	$class .= ( $atts['md_offset'] || $atts['md'] === '0' ) ? ' col-md-offset-' . $atts['md_offset'] : '';
	$class .= ( $atts['lg_offset'] || $atts['lg'] === '0' ) ? ' col-lg-offset-' . $atts['lg_offset'] : '';
	$class .= ( $atts['hd_offset'] || $atts['hd'] === '0' ) ? ' col-hd-offset-' . $atts['hd_offset'] : '';

	// Pull classes
	$class .= ( $atts['xs_pull'] || $atts['xs'] === '0' ) ? ' col-xs-pull-' . $atts['xs_pull'] : '';
	$class .= ( $atts['sm_pull'] || $atts['sm'] === '0' ) ? ' col-sm-pull-' . $atts['sm_pull'] : '';
	$class .= ( $atts['md_pull'] || $atts['md'] === '0' ) ? ' col-md-pull-' . $atts['md_pull'] : '';
	$class .= ( $atts['lg_pull'] || $atts['lg'] === '0' ) ? ' col-lg-pull-' . $atts['lg_pull'] : '';
	$class .= ( $atts['hd_pull'] || $atts['hd'] === '0' ) ? ' col-hd-pull-' . $atts['hd_pull'] : '';

	// Push classes
	$class .= ( $atts['xs_push'] || $atts['xs'] === '0' ) ? ' col-xs-push-' . $atts['xs_push'] : '';
	$class .= ( $atts['sm_push'] || $atts['sm'] === '0' ) ? ' col-sm-push-' . $atts['sm_push'] : '';
	$class .= ( $atts['md_push'] || $atts['md'] === '0' ) ? ' col-md-push-' . $atts['md_push'] : '';
	$class .= ( $atts['lg_push'] || $atts['lg'] === '0' ) ? ' col-lg-push-' . $atts['lg_push'] : '';
	$class .= ( $atts['hd_push'] || $atts['hd'] === '0' ) ? ' col-hd-push-' . $atts['hd_push'] : '';

	// Extra class
	$class .= ( $atts['xclass'] ) ? ' ' . $atts['xclass'] : '';

	$data = ( $atts['data'] ) ? ' data-' . $atts['data'] : '';

	return sprintf(
		'<div class="%s"%s>%s</div>',
		esc_attr( $class ),
		esc_attr( $data ),
		do_shortcode( $content )
	);
}

add_shortcode('column', 'column_shortcode');

?>