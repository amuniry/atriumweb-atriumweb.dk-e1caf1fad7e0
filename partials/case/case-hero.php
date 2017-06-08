<?php 
/**
 * Cases header
 **/ 

$background = (get_field('hero_background')) ?: get_field('page_hero', 'options');
$image_src = get_field('hero_image');
$image_srcset = wp_get_attachment_image_srcset($image_src, 'medium_large');

$image_src = wp_get_attachment_image_src($image_src, 'medium_large');
$image_srcset = $image_srcset ? ' srcset="' . esc_attr( $image_srcset ) . '"' : '';

$colour = get_field('colour');
$colour = hex2rgba($colour, 0.9);

?>
<header class="case__hero" role="banner" style="background-image: url(<?= $background['url']; ?>);">
	<div class="case__hero__inner" style="background-color: <?= $colour; ?>">
		<img src="<?= $image_src[0]; ?>" width="<?= $image_src[1]; ?>" height="<?= $image_src[2]; ?>" alt="<?= get_the_title(); ?>" class="case__hero__image"<?= $image_srcset; ?>>
	</div>
</header>