<?php 
/**
 * Load comments
 **/ 

add_action( 'wp_ajax_atweb_get_comments', 'atweb_get_comments' );
add_action( 'wp_ajax_nopriv_atweb_get_comments', 'atweb_get_comments' );

function atweb_get_comments() {
	$page = $_GET['page'];

	$args = array(
		'echo' => false,
		'page' => $page,
		'walker' 	=> new Atframe_Walker_Comments
	);

	$comments = wp_list_comments( $args );

	if (defined('DOING_AJAX') && DOING_AJAX) {
		echo $comments;
	}

	die();
}




 ?>