<?php 
/**
 * Field type: Columns
 * @since 1.1.0
 * ================================================== */ 

/**
 * Section settings
 **/

// Setup wrapper classes
$wrapper_class 		= 'section section--l';
$wrapper_attributes 	= '';
$container_class 		= 'section__container';
$row_class 				= 'row section__row';
$title_class 			= 'section__title';

// Setup wrapper id
if ( $wrapper_id = get_sub_field('row_id') ) {
	$wrapper_attributes .= ' id="' . $wrapper_id . '"';
}

if ( $wrapper_custom_class = get_sub_field('row_class') ) $wrapper_class .= ' ' . $wrapper_custom_class;

// Setup wrapper background
$wrapper_background = get_sub_field('row_background');

if ( $wrapper_background !== 'none' ) {
	if ( $row_background_preset = get_sub_field('row_background_preset') ) {
		$wrapper_class .= ' section--' . $row_background_preset;
	} elseif ( $row_background_image = get_sub_field('row_background_image') ) {
		$wrapper_class .= ' section--has-bg';
		$wrapper_attributes .= ' style="background-image: url(' . $row_background_image['url'] . ');"';
	}
}


// Setup wrapper margin
$wrapper_margin = get_sub_field('row_margin');

if ( !empty($wrapper_margin) ) {
	$wrapper_class .= ' spacing--' . $wrapper_margin;
}


// Section title
$title = get_sub_field('add_title');

if ( $title ) {
	$title_text 	= get_sub_field('title_text');
	$title_type 	= get_sub_field('title_type');
	$title_class 	.= ' ' . get_sub_field('title_class');
	$title_markup 	= ($title_text !== '') ? '<' . $title_type . ' class="' . $title_class . '">' . $title_text . '</' . $title_type . '>' : '';
}


// Retrieve column settings
$columns = get_sub_field('columns');
$breakpoint = get_sub_field('breakpoint');
$column_class = 'section__col';



/**
 * Output wrapper markup
 **/ 

$html = '<section class="' . $wrapper_class . '"' . $wrapper_attributes . '>';
	$html .= '<div class="' . $container_class . '">';
		$html .= ($title) ? $title_markup : '';
		$html .= '<div class="' . $row_class . '">';


		/**
		 * Generate column markup
		 **/ 

		$i = 0;
		while ( $i < $columns ) {

			// Start from 1
		 	$i++;

			// Get values from ACF
			$width = get_sub_field('col_' . $i . '_width');
			$column_class_optional = get_sub_field('col_' . $i . '_class');
			$content = get_sub_field('col_' . $i . '_content');

			// Setup column classes
			$classes = array();
			$classes[] = $column_class;
			$classes[] = get_column_class($width, $breakpoint);
			if ( $column_class_optional !== '' ) $classes[] = $column_class_optional;

			$html .= '<div class="post__content ' . get_classes_from_array( $classes ) . '">';
				$html .= $content;
			$html .= '</div>';
		}


		// End wrapper markup
		$html .= '</div>';
	$html .= '</div>';
$html .= '</section>';

echo $html;
?>