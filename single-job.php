<?php 
get_header(); 

/**
 * Job single
 **/ 
$terms    = get_the_terms($post, 'kontor');
$offices  = [];
$acf_term = [];
foreach($terms as $term) {
	$offices[]  = $term->name;
	$acf_term[] = $term->taxonomy . '_' . $term->term_id;
}
?>

<div class="l-flex l-flex--equal-height l-flex--justify job-wrapper">

	<div class="col-md-6 no-gutter job__sidebar" role="complementary">
		
		<?php 
		/**
		 * Page header
		 **/ 

		$job_title    = get_field('jobs_title', 'options');
		$job_bg       = get_field('jobs_bg', 'options');
		$job_subtitle = get_the_title();
		 ?>

		<header class="job__header page__header--large" style="background-image: url(<?= $job_bg['url'] ?>);">
			<h2 class="page__title"><?= $job_title ?></h2>
			<h1 class="page__subtitle"><?= $job_subtitle ?></h1>
		</header>


		<?php 
		/**
		 * Featured
		 **/ 

		$featured = get_field('featured');

		if ( $featured ) : ?>
		
		<figure class="job__featured">
			<img src="<?= $featured['sizes']['post-featured'] ?>" alt="<?= $job_subtitle ?>">
		</figure>

		<?php 
		endif;

		/**
		 * Google Maps
		 **/ 
		foreach ( $acf_term as $office ) :
			$maps = get_field('google_maps', $office);

			if ( !empty($maps)) : ?>

				<div class="google-map job__map">
					<div class="marker" data-lat="<?php echo $maps['lat']; ?>" data-lng="<?php echo $maps['lng']; ?>"></div>
				</div>

			<?php 
			endif; 
		endforeach; ?>
	</div>	
	
	<?php 
	/**
	 * The job
	 **/ 

	 ?>

	<div class="col-md-6 no-gutter section--white">
		<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

			<article class="post post--<?php echo $post->post_type; ?>" role="article" itemscope itemtype="http://microformats.org/profile/hatom">

				<div class="section--l post__content--single" itemprop="entry-content">
					<h3 class="department__title"><?= implode(' | ', $offices); ?></h3>
					<?php foreach ( $acf_term as $office ) : ?>
						<p class="department__subtitle"><?= get_field('subtitle', $office); ?></p>
					<?php endforeach; ?>
					
					<div class="post__content">
						<?php the_content(); ?>
					</div>
				</div>

				<?php 
				/**
				 * Apply for job
				 **/ 

				$button_type = get_field('button_type');
				if ( $button_type ) : ?>

					<div class="section--l">
						<?php 
						if ( $button_type === 'external' )  {
							echo '<a href="' . get_field('button_link') . '" target="_blank" class="btn btn--orange">Send ansøgning nu</a>';
						} else { 
							echo '<a href="mailto:' . get_field('button_mail') . '" class="btn btn--orange">Send ansøgning nu</a>';
						} ?>

					</div>

				<?php endif; ?>

				<div class="section--l">
					<?php social_share('single'); ?>
				</div>
				
			</article>

		<?php endwhile; else: ?>

			<?php get_template_part('partials/post', 'none'); ?>

		<?php endif; ?>


	</div>

</div>

<?php get_footer(); ?>