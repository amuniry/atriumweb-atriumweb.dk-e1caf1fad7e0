<?php get_header(); ?>

<?php
/**
 * Page header
 **/

$cat = get_category( get_query_var( 'cat' ) );  ?>

<header class="blog__hero">

	<h1 class="blog__heading"><?= $cat->name; ?></h1>

</header>

<div class="blog-overview">
	<div class="blog__list" id="blog-overview">

		<?php
		$args = array(
			'post_type'      => 'post',
			'posts_per_page' => -1,
			'cat'            => $cat->ID
		);

		$blog = new WP_Query($args);


		if ( $blog->have_posts() ) : while ( $blog->have_posts() ) : $blog->the_post();
			$categories = array_map('get_term_slugs', get_the_category($post->ID));  ?>

			<article class="blog__item" data-filter="blog <?= implode(' ', $categories); ?>">

				<?php if ( has_post_thumbnail() ) : ?>
					<a class="blog__image" href="<?php the_permalink(); ?>">
						<img src="<?= wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'medium_large')[0]; ?>" alt="<?php the_title(); ?>" class="blog__image-lazy">
					</a>
				<?php endif; ?>

				<div class="blog__content">
					<header class="blog__header">
						<h1 class="blog__title"><a href="<?php the_permalink(); ?>"><?php echo get_atframe_title(); ?></a></h1>
						<p class="blog__meta">Skrevet af <?php the_author_meta('first_name'); ?> &middot; <time datetime="<?php the_time('c'); ?>"><?php the_time('j. F Y'); ?></time></p>
					</header>

					<div class="blog__excerpt">
						<?php
						if ( get_field('excerpt') !== '' ) {
							the_field('excerpt');
						} else {
							the_excerpt();
						}
						?>
					</div>

					<footer class="blog__footer">
						<a href="<?php the_permalink(); ?>" class="blog__more">Læs mere <i class="icon--angle-right"></i></a>

						<?php
						$comments = get_comments_number();
						if ( $comments > 0 ) : ?>
							<span class="blog__comments">
								<i class="icon--comments"></i>
								<?php echo $comments; ?>
							</span>
						<?php endif; ?>
					</footer>
				</div>

			</article>

		<?php
		endwhile;
		wp_reset_postdata();
		else: ?>

			<?php get_template_part('partials/content', 'none'); ?>

		<?php endif; ?>

	</div>
</div>
<?php get_footer(); ?>
