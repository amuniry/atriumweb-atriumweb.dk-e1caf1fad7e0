<?php 
/**
 * Related posts
 **/ 

// Retrieve the first category of post
$related_cat = get_the_category($post->ID)[0];

if ($related_cat) {

	$args = array(
		'post_type' 				=> 'post',
		'orderby'					=> 'rand',
		'cat'							=> $related_cat->term_id,
		'post__not_in' 			=> array( $post->ID ),
		'posts_per_page'			=> 2,
		'ignore_sticky_posts'	=> 1
	);

	$related = new WP_Query( $args );

	if ( $related->have_posts() ) : ?>

		<section class="widget--sidebar related">
			<h4 class="widget__title">Lignende indlæg</h4>
			
			<div class="related__list row">
				<?php while( $related->have_posts()) : $related->the_post(); ?>
					
					<article class="col-xs-6 col-sm-12 col-lg-6 related__item" role="article" itemscope itemtype="http://microformats.org/profile/hatom">
						<a href="<?php the_permalink(); ?>" class="related__link">
							<?php 
							if ( has_post_thumbnail() ) {
								the_post_thumbnail('post-related', array('class' => 'related__image'));
							} ?>
							<h3 class="related__title" itemprop="entry-title"><?php echo get_atframe_title(); ?></h3>
						</a>
					</article>

				<?php endwhile; wp_reset_postdata(); ?>
			</div>
		</section>

	<?php 
	endif; 
}
?>