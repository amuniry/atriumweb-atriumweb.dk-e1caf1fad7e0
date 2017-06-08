<?php get_header(); ?>

<?php get_template_part('partials/case/case', 'hero'); ?>

<article class="l-flex l-flex--equal-height l-flex--justify">
	<div class="section--l section--white col-sm-7">
		<div class="case__images">

			<?php 
			if ( have_rows('designs') ) {
				while ( have_rows('designs') ) {
					the_row();
					$layout = get_row_layout();

					/**
					 * Single image
					 **/ 
					
					if ( $layout === 'single_image' ) {
						$image = get_sub_field('image');

						if ( $image ) {
							echo '<div class="row">';
								echo '<div class="col-xs-12">';
									echo '<img class="is-lazy case__image" data-borgsrc="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" src="' . $image['url'] . '">';
								echo '</div>';
							echo '</div>';
						} 
					} 


					/**
					 * Two images
					 **/ 

					elseif ( $layout === 'two_images' ) {

						$image_1 = get_sub_field('image_1');
						$image_2 = get_sub_field('image_2');

						echo '<div class="row">';
							
							if ( $image_1 ) {
								echo '<div class="col-sm-6 col-md-12 col-lg-6">';
									echo '<img class="is-lazy case__image" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="' . $image_1['url'] . '" width="' . $image_1['width'] . '" height="' . $image_1['height'] . '">';
								echo '</div>';
							}
							
							if ( $image_2 ) {
								echo '<div class="col-sm-6 col-md-12 col-lg-6">';
									echo '<img class="is-lazy case__image" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="' . $image_2['url'] . '" width="' . $image_2['width'] . '" height="' . $image_2['height'] . '">';
								echo '</div>';
							}

						echo '</div>';

					}
				}
			}
			?>
		</div>

		<?php social_share(); ?>

	</div>

	<section class="col-sm-5 section--l section--light-grey sidebar" role="complementary">
		
		<?php 
		/**
		 * Case widgets
		 **/

		// Header
		get_template_part('partials/case/case', 'header');

		// Meta information
		get_template_part('partials/case/case', 'meta');

		// Description
		get_template_part('partials/case/case', 'description');

		// Testimonial
		get_template_part('partials/case/case', 'testimonial');

		// Related
		get_template_part('partials/case/case', 'related'); 
		?>

	</section>
</article>

<?php get_footer(); ?>