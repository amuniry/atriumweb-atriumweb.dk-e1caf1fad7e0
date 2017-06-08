<?php 
get_header(); 
get_template_part('partials/page', 'header'); 
get_template_part('partials/case/case', 'filter');
?>

<div class="cases-overview" id="cases">

	<?php
	/**
	 * Cases
	 **/ 

	$args = array(
		'post_type' 			=> 'cases',
		'posts_per_page'		=> -1
	);

	$cases = new WP_Query($args);

	 if ( $cases->have_posts() ) : while ( $cases->have_posts() ) : $cases->the_post(); 

	// Get case terms
	$types = array_map('get_term_slugs', get_the_terms($post->ID, 'typer'));
	$colours = array_map('get_term_slugs', get_the_terms($post->ID, 'farver'));
	$filters = array_merge($types, $colours);

	// Text and images
	$image = get_field('featured');
	$theme = get_field('colour');
	?>

		<a href="<?php the_permalink() ?>" class="col-xs-6 col-md-4 col-lg-3 col-hd-2 cases__item" data-filter="typer farver <?= implode(' ', $filters); ?>">
			<div class="cases__item-inner" style="background-color: <?= $theme; ?>">
				<div class="cases__image-wrapper">
					<img class="cases__image" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="<?= $image['sizes']['medium_large']; ?>" alt="<?= get_the_title(); ?>">
				</div>
				<div class="cases__overlay">
					<h2 class="cases__title"><?= get_the_title(); ?></h2>
					<h3 class="cases__subtitle"><?= get_field('subtitle'); ?></h3>
				</div>
			</div>
		</a>

	<?php endwhile; wp_reset_postdata(); endif; ?>
</div>

<?php get_footer(); ?>