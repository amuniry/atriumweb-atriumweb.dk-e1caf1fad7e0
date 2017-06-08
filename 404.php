<?php get_header(); 
$background = get_field('404_bg', 'options');
?>
<article class="error" style="background-image: url(<?php echo $background['url'] ?>);">
	<div class="error__inner">
		
		<h2 class="error__title">Hov hov</h2>
		<p class="error__subtitle">Du er vist trådt ved siden af...</p>

		<img src="<?php echo get_template_directory_uri(); ?>/assets/images/footsteps.png" alt="Side ikke fundet" class="error__footsteps">

		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home" class="error__back">Du kommer tilbage til forsiden her</a>

	</div>
</article>

<?php get_footer(); ?>