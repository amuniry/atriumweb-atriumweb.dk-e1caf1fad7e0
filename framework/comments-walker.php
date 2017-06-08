<?php
/**
 * Custom comment walker
 * @link https://gist.github.com/georgiecel/9445357
 **/ 

class Atframe_Walker_Comments extends Walker_Comment {
	var $tree_type = 'comment';
	var $db_fields = array( 'parent' => 'comment_parent', 'id' => 'comment_ID' );


	/**
	 * Wrapper for comment list
	 **/ 

	function __construct() {
		if ( !defined('DOING_AJAX') ) {
			echo '<section class="comments__list">';
		}
	} 


	/**
	 * start_lvl
	 * A wrapper for child comments list
	 **/

	function start_lvl( &$output, $depth = 0, $args = array() ) {
		$GLOBALS['comment_depth'] = $depth + 2;
		echo '<section class="comments__list comments__list--child">';
	}


	/**
	 * end_lvl
	 * Closing wrapper for child comments list
	 **/ 

	function end_lvl( &$output, $depth = 0, $args = array() ) {
		$GLOBALS['comment_depth'] = $depth + 2;
		echo '</section>';
	}


	/**
	 * start_el
	 * Create HTML template
	 **/ 

	function start_el( &$output, $comment, $depth = 0, $args = array(), $id = 0 ) {
		$depth++;
		$GLOBALS['comment_depth'] = $depth;
		$GLOBALS['comment'] = $comment;
		$comment_class = ( empty( $args['has_children'] ) ? '' : 'comment--parent' ); 
		$comment_class .= ' comment-depth--' . $depth;
		$tag = 'article';
		$add_below = 'comment'; 
		?>

		<article class="comment <?php echo $comment_class; ?>" id="comment-<?php comment_ID() ?>" itemprop="comment" itemscope itemtype="http://schema.org/Comment">
			
			<?php 
			/**
			 * Comment meta
			 **/ ?>

			<div class="comment__meta" role="complementary">
				
				<h2 class="comment__author" itemprop="author"><?php comment_author(); ?></h2>
				<time class="comment__meta__item" datetime="<?php comment_date('Y-m-d') ?>T<?php comment_time('H:iP') ?>" itemprop="datePublished"><?php comment_date('j. F Y') ?></time>
				
				<?php edit_comment_link('Rediger denne kommentar', '', ''); ?>
				
				<?php comment_reply_link(array_merge( $args, array('add_below' => $add_below, 'depth' => $depth, 'max_depth' => $args['max_depth']))) ?>

				<?php if ($comment->comment_approved == '0') : ?>
					<p class="comment__meta__item">Din kommentar afventer godkendelse.</p>
				<?php endif; ?>

			</div>


			<?php 
			/**
			 * Comment meta
			 **/ ?>

			<div class="comment__content" itemprop="text">
				<?php comment_text() ?>
			</div>

	<?php }


	/**
	 * end_el
	 * Closing HTML for comment template
	 **/ 

	function end_el( &$output, $comment, $depth = 0, $args = array() ) {
		echo '</article>';
	}


	/**
	 * __destruct
	 * Closing wrapper for comments list
	 **/ 

	function __destruct() {
		if ( !defined('DOING_AJAX') ) {
			echo '</section>';
		}
	}
}



/**
 * Helper functions
 **/ 

// Change class of reply link
add_filter('comment_reply_link', 'replace_reply_link_class');

function replace_reply_link_class($class) {
	$class = str_replace( 'comment-reply-link', 'comment__meta__item comment__link comment__link--reply', $class );
	return $class;
}

// Change class of edit comment link
add_filter('edit_comment_link', 'replace_edit_comment_link_class');

function replace_edit_comment_link_class($class) {
	$class = str_replace( 'comment-edit-link', 'comment__meta__item comment__link comment__link--edit', $class );
	return $class;
}

?>