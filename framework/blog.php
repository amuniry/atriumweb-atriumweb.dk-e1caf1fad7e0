<?php
/**
 * Blog functions
 **/ 


/**
 * Save the estimated time (in seconds) to read
 * @param  integer $post_id
 **/

function blog_save_read_time( $post_id = 0 ) {

	// Bail if any of these conditions are true
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return $post_id;
	}

	if ( get_post_type( $post_id ) !== 'post' ) {
		return $post_id;
	}

	// Get word count from post content
	$content	= get_post_field( 'post_content', $post_id, 'raw' );
	$word_count	= str_word_count( strip_tags( $content ) );

	// Set average reading time
	$average	= apply_filters( 'blog_estimated_read_time', 240 );

	// Calculate to amount of 
	$seconds	= floor( (int) $word_count / (int) $average ) * 60;

	// update the post meta
	update_post_meta( $post_id, '_seconds_read_time', $seconds );

}

add_action( 'save_post', 'blog_save_read_time', 999 );


/*
 * Calculate reading time
 * @param  integer $seconds
 * @return string
 **/

function blog_calc_read_time( $seconds = 0 ) {

	// Convert seconds to minutes
	$minutes	= floor( $seconds / 60 );

	// If the time is less than a minute, return that
	if ( $minutes < 1 ) {
		return __( 'Mindre end 1 minut', 'atriumweb' );
	} else {
		return sprintf( _n( '%d minut', '%d minutter', $minutes, 'atriumweb'), $minutes );
	}
}


/**
 * Get estimated time to read the content
 * @param  string $content
 * @return string
 **/

function blog_get_read_time() {

	global $post;

	// Retrieve post meta key
	$seconds	= get_post_meta( $post->ID, '_seconds_read_time', true );

	// If no key available, bail out mother fucker!
	if ( empty( $seconds ) ) {
		return $content;
	}

	// Retrieve calculated reading time
	$read_time = blog_calc_read_time( $seconds );

	return $read_time;
}
?>