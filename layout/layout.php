<?php 
/**
 * Flexible content layout setup
 * @since 1.1.0
 * ================================================== */ 

if ( have_rows('layout') ) {
	while ( have_rows('layout') ) {

		the_row();
		$layout = get_row_layout();

		if ( $layout == 'columns' ) 				get_template_part('layout/layout', 'columns');
		elseif ( $layout == 'gallery' )			get_template_part('layout/layout', 'gallery');
		elseif ( $layout == 'boxes' )			get_template_part('layout/layout', 'boxes');

	}
} else {
	echo '<section class="section">';
		echo '<div class="container">';
			_e('Intet indhold fundet. Tilføj sektioner via kontrolpanelet.', 'atriumweb');
		echo '</div>';
	echo '</section>';
}

?>