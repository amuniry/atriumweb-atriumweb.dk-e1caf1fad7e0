<?php 
/**
 * Post meta
 **/ 
?>
<footer class="section--l post__meta" role="contentinfo">

	<?php 
	/**
	 * Post date
	 **/ 
	?>

	<time class="col-xs-6 post__meta__item" itemprop="published" pubdate datetime="<?php the_time('c'); ?>">
		<i class="post__meta__icon icon--clock"></i>
		<?php the_time('j. F Y'); ?>
	</time>
	

	<?php 
	/**
	 * Category list
	 **/ 

	$categories = get_the_category();


	if ( count($categories) > 0 ) {
		$meta_categories = array();
		foreach ( $categories as $cat ) {
			$meta_categories[] = '<a rel="tag" href="' . get_category_link( $cat->term_id ) .'">' . $cat->name . '</a>';
		}

		if ( count($categories) > 1 ) {
			$meta_categories = 'Kategorier: ' . implode( ', ', $meta_categories ); 
		} else {
			$meta_categories = 'Kategori: ' . $meta_categories[0]; 
		}
	} ?>

	<div class="col-xs-6 post__meta__item">
		<i class="post__meta__icon icon--category"></i>
		<?php echo $meta_categories; ?> 
	</div>


	<?php 
	/**
	 * Comment number
	 **/ 
	
	$comment_count = get_comments_number();
	
	if ( comments_open() ) {
		if ( $comment_count == 0 ) {
			$comment = 'Ingen kommentarer';
		} elseif ( $comment_count > 1 ) {
			$comment = $comment_count . ' kommentarer';
		} else {
			$comment = '1 kommentar';
		}
		$meta_comments = '<a href="#comments">'. $comment.'</a>';
	} else {
		$meta_comments = 'Kommentarer er deaktiveret for dette indlæg';
	} 
	?>

	<div class="col-xs-6 post__meta__item">
		<i class="post__meta__icon icon--comments"></i>
		<?php echo $meta_comments; ?>
	</div>

	<div class="col-xs-6 post__meta__item">
		<i class="post__meta__icon icon--eye"></i>
		Læsetid: <?php echo blog_get_read_time(); ?>
	</div>

</footer>