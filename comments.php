<?php 
/**
 * Comments template
 **/ 
?>

<div id="comments" class="comments">

	<?php 
	// If comments are open and there are comments
	if (have_comments()) {

		echo '<h3 class="widget__title comments__header">';
			comments_number(); 
		echo '</h3>';

		// Comment list with custom walker
		$args = array(
			'per_page'	=> 3,
			'reverse_top_level' => true,
			'reverse_children' => true,
			'walker' 	=> new Atframe_Walker_Comments
		);
		wp_list_comments( $args );

		global $cpage, $post;
		$next_page = ($cpage) ?: '1';
		
		if ( get_comments_number($post->ID) > 3 ) {
			echo '<nav class="comments__more" role="navigation">';
				echo '<a href="' . get_comments_pagenum_link($next_page + 1) . '" data-comment-page="' . $post->ID . '" class="comments__btn" id="load-comments">Indlæs alle kommentarer <i class="icon--angle-down"></i></a>';
			echo '</nav>';
		}
	} 

	// Comments are not open
	elseif ( ! comments_open() && ! is_page() && post_type_supports( get_post_type(), 'comments' ) ) {
		echo '<p>' . __( 'Der er lukket for kommentarer.', 'atriumweb' ) . '</p>';
	}

	/**
	 * Comment form
	 **/ 

	// Setup fields
	$commenter = wp_get_current_commenter();
	$req = get_option( 'require_name_email' );
	$aria_req = ( $req ? " aria-required='true'" : '' );

	$fields = array(
		'author' =>
			'<p class="comment-form-author">
				<label for="author">' . 
					__( 'Navn', 'atriumweb' ) . 
					( $req ? '<span class="required">*</span>' : '' ) .
				'</label> ' .
				'<input id="author" name="author" type="text" value="' . esc_attr( $commenter['comment_author'] ) . '" size="30"' . $aria_req . ' />
			</p>',

		'email' =>
			'<p class="comment-form-email">
				<label for="email">' . 
					__( 'E-mail', 'atriumweb' ) . 
					( $req ? '<span class="required">*</span>' : '' ) .
				'</label> ' .
				'<input id="email" name="email" type="text" value="' . esc_attr(  $commenter['comment_author_email'] ) . '" size="30"' . $aria_req . ' />
			</p>'
	);

	// Form arguments
	$form_args = array(
		'fields' => apply_filters( 'comment_form_default_fields',  $fields),
		'title_reply' => 'Skriv en kommentar'
	);

	comment_form( $form_args );
	?>
</div>