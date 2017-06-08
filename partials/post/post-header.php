<?php 
/**
 * Post header
 **/ 

$post_header = get_field('featured_single');
?>

<style>
	
	.post__header {
		background-image: url(<?php echo $post_header['sizes']['post-header-small']; ?>);
	}

	@media screen and (min-width: 1200px) {
		.post__header {
			background-image: url(<?php echo $post_header['sizes']['post-header-large']; ?>);
		}		
	}

</style>

<header class="post__header" role="banner">
	<div class="post__overlay">
		<h1 class="post__title" itemprop="entry-title"><?php echo get_atframe_title(); ?></h1>
	</div>
</header>