<?php // Template Name: Medarbejdere
get_header(); 

get_template_part('partials/page', 'header'); 


/**
 * Team
 **/ 
if ( have_rows('team') ) : ?>

	<div class="team">

		<?php 
		$i = 0;
		while ( have_rows('team') ) : 
			the_row();
			$i++;
			$name     = get_sub_field('name');
			$position = get_sub_field('position');
			$mail     = get_sub_field('mail');
			$areas    = get_sub_field('areas');

			if ( $i === 1 || $i % 3 === 1 ) {
				$image = get_sub_field('image_white');
			} elseif ( ($i + 1 ) % 3 === 1 ) {
				$image = get_sub_field('image_grey_dark');
			} elseif ( ($i + 2) % 3 === 1 ) {
				$image = get_sub_field('image_grey_light');
			}
			?>

			<figure class="team__member">

				<img src="<?php echo $image['sizes']['medium_large']; ?>" alt="<?php echo $name; ?>" class="team__profile">

				<figcaption class="team__caption">
					<div class="team__person">
						<h2 class="team__name"><?php echo $name; ?></h2>
						<p class="team__position"><?php echo $position; ?></p>
					</div>

					<div class="team__meta">
						<?php if ( $mail ) : ?>
							<div class="team__mail">
								<small>Mail</small>
								<p><a href="mailto:<?php echo $mail; ?>"><?php echo $mail; ?></a></p>
							</div>
						<?php endif; if ( $areas ) : ?>
							<div class="team__areas">
								<small>Arbejdsområder</small>
								<p><?php echo $areas; ?></p>
							</div>
						<?php endif; ?>
					</div>
				</figcaption>
			</figure>

		<?php endwhile; ?>
		
		<?php 
		/**
		 * Available jobs
		 **/ 

		$args = array(
			'post_type'      => 'job',
			'posts_per_page' => -1,
			'post_status'    => 'publish'
		);

		$jobs = new WP_Query($args);

		if ( $jobs->have_posts() ) : 
			while ( $jobs->have_posts() ) : 
			$jobs->the_post(); 
			$i++;

			$link  = get_permalink();
			$title = get_the_title();

			if ( $i === 1 || $i % 3 === 1 ) {
				$image = wp_get_attachment_image_src(1487, 'medium_large'); // White
			} elseif ( ($i + 1 ) % 3 === 1 ) {
				$image = wp_get_attachment_image_src(1488, 'medium_large'); // Light grey
			} elseif ( ($i + 2) % 3 === 1 ) {
				$image = wp_get_attachment_image_src(1489, 'medium_large'); // Dark grey
			} ?>

			<a class="team__member team__member--job" href="<?= get_permalink() ?>">

				<img src="<?php echo $image[0]; ?>" alt="<?php echo $name; ?>" class="team__profile team__profile--job">

				<div class="team__caption">
					<div class="team__person team__person--job">
						<h2 class="team__name">Dig?</h2>
						<p class="team__position"><?= $title ?></p>
					</div>
				</div>
			</a>

			<?php
			endwhile; 
			wp_reset_postdata(); 
		endif; ?>
	</div>

<?php endif; ?>

<?php get_footer(); ?>