<?php 
/**
 * Case testimonial
 **/ 

$link = get_field('link');
$add_testimonial 		= get_field('add_testimonial');

if ( $add_testimonial ) :
	$testimonial_contact = get_field('testimonial_contact');
	$testimonial_quote 	= get_field('testimonial_quote');
?>

<blockquote class="widget--sidebar case__testimonial">
	<div class="case__testimonial__quote">
		<?= $testimonial_quote; ?>
	</div>

	<footer class="case__testimonial__cite">
		<cite><a href="<?= $link; ?>" target="_blank">
			<?= $testimonial_contact ?>
		</a></cite>
	</footer>
</blockquote>

<?php 
endif; 

// Visit the site
if ( $link ) : ?>

<div class="widget--sidebar">
	<a href="<?= $link?>" target="_blank" class="btn btn--orange btn--block">Besøg hjemmesiden</a>
</div>

<?php endif; ?>