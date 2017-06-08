<?php
/**
 * atriumWeb framework functions
 * ================================================== */

define( 'ATFRAME_DEBUG', false );
define( 'TYPEKIT_ID', 'szx8pqg' );
show_admin_bar(false);

require_once 'lib/atriumweb-framework.php';
require_once 'framework/site-framework.php';



/**
 * ACF Options Page
 * @since 1.0.1
 **/

if ( function_exists('acf_add_options_page') ) {

	acf_add_options_page( array(
		'page_title' 	=> 'Globalt indhold',
		'menu_title'	=> 'Globalt indhold',
		'menu_slug' 	=> 'globalt-indhold',
		'capability'	=> 'edit_posts',
		'redirect'		=> true,
		'position'		=> '3.3'
	));

	acf_add_options_sub_page( array(
		'page_title' 	=> 'Generelt indhold',
		'menu_title' 	=> 'Generelt indhold',
		'menu_slug'		=> 'generelt',
		'parent_slug' 	=> 'globalt-indhold'
	));

	acf_add_options_sub_page( array(
		'page_title' 	=> 'Kontaktoplysninger',
		'menu_title' 	=> 'Kontaktoplysninger',
		'menu_slug'		=> 'kontaktoplysninger',
		'parent_slug' 	=> 'globalt-indhold'
	));

}


/**
 * Add Google Maps API key to ACF
 **/

function add_google_maps_key_to_acf() {
	acf_update_setting('google_api_key', 'AIzaSyBMcDOX0Fco6VFS2a0wBabRbW4XIsansSE');
}

add_action('acf/init', 'add_google_maps_key_to_acf');


/**
 * Script and style registration
 * @since 1.0.0
 **/

function register_scripts() {

	// Add .min-extension when not debugging
	$postfix = ( defined( 'ATFRAME_DEBUG' ) && ATFRAME_DEBUG === true ) ? '' : '.min';


	/**
	 * Stylesheets
	 **/

	wp_enqueue_style( 'main-css', get_template_directory_uri() . '/assets/css/main' . $postfix . '.css', false, null );


	/**
	 * JavaScript
	 * Defer and async attributes can be set in lib/utilities.php
	 **/

	if (!is_admin()) {
		wp_dequeue_script('picturefill');
		wp_deregister_script('wp-embed');
		wp_deregister_script( 'jquery' );
		wp_register_script( 'jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js', array(), null, true );
	}

	wp_enqueue_script( 'jquery' );
	wp_enqueue_script( 'main-js', get_template_directory_uri() . '/assets/scripts/main' . $postfix . '.js', array('jquery'), null, true );

	if ( get_option( 'thread_comments' ) )  {
		wp_enqueue_script( 'comment-reply' );
	}

	wp_localize_script( 'main-js', 'WP', array(
		'ajaxUrl' => admin_url( 'admin-ajax.php' )
	));

	// Add Google Maps API to single jobs and contact page
	if ( is_singular('job') || is_page_template('templates/page-contact.php') ) {
		wp_enqueue_script( 'google-maps', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBMcDOX0Fco6VFS2a0wBabRbW4XIsansSE&?v=3.exp"', array('jquery'), null, true );
	}
}

add_action('wp_enqueue_scripts', 'register_scripts', 100);


/**
 * Remove WordPress embeds
 **/

function disable_embeds_init() {
	global $wp;

	// Remove the embed query var.
	$wp->public_query_vars = array_diff( $wp->public_query_vars, array(
		'embed',
	) );

	// Remove the REST API endpoint.
	remove_action( 'rest_api_init', 'wp_oembed_register_route' );

	// Turn off oEmbed auto discovery.
	add_filter( 'embed_oembed_discover', '__return_false' );

	// Don't filter oEmbed results.
	remove_filter( 'oembed_dataparse', 'wp_filter_oembed_result', 10 );

	// Remove oEmbed discovery links.
	remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );

	// Remove oEmbed-specific JavaScript from the front-end and back-end.
	remove_action( 'wp_head', 'wp_oembed_add_host_js' );
	// add_filter( 'tiny_mce_plugins', 'disable_embeds_tiny_mce_plugin' );

	// Remove WP-JSON
	remove_action( 'wp_head', 'rest_output_link_wp_head', 10 );

	// Remove all embeds rewrite rules.
	// add_filter( 'rewrite_rules_array', 'disable_embeds_rewrites' );
}
add_action( 'init', 'disable_embeds_init', 9999 );


/**
 * Typekit enqueueing
 * Define TYPEKIT_ID constant in top of this document
 * Enqueueing and caching functions are placed in lib/utilities.php
 * @since 1.0.3
 **/

if ( defined( 'TYPEKIT_ID' ) && TYPEKIT_ID !== null ) {
	enqueue_typekit_fonts();
}



/**
 * Menu registration
 * @since 1.0.0
 **/

function register_menus() {
	register_nav_menus(
		array(
			'primary-nav'  => __( 'Primær menu', 'atriumweb' )
		)
	);
}

add_action( 'after_setup_theme', 'register_menus' );



/**
 * Add image sizes
 * @since 1.0.0
 * @link https://developer.wordpress.org/reference/functions/add_image_size/
 **/

// Image sizes
add_image_size('post-header-small', 600, 300, true);
add_image_size('post-header-large', 1200, 500, true);

add_image_size('page-header-horizontal', 1920, 640, true);
// add_image_size('page-header-vertical', 1000, 1600, true);


add_image_size('post-featured', 1000, 99999, false);
add_image_size('post-related', 400, 300, true);
add_image_size('post-related-large', 800, 400, true);


// Add created images sizes to dropdown in WP control panel
add_filter( 'image_size_names_choose', 'custom_image_sizes' );

function custom_image_sizes( $sizes ) {
	return array_merge( $sizes, array(
		'medium_large' => __( 'Medium large' )
	) );
}



/**
 * Gravity forms
 * @since 1.0.1
 **/

// Load scripts in footer
add_filter( 'gform_init_scripts_footer', '__return_true' );



/**
 * The excerpt
 * @since 1.0.0
 **/

// New excerpt length
function custom_excerpt_length( $length ) {
	return 40;
}

add_filter( 'excerpt_length', 'custom_excerpt_length', 999 );


// Excerpt more
function custom_excerpt_more( $more ) {
	global $post;
	return '&hellip;';
}

add_filter('excerpt_more', 'custom_excerpt_more');

?>
