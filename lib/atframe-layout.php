<?php 
/**
 * Helper functions for ACF Flexible Content
 * @since 1.1.0
 * ================================================== */ 


/**
 * Get column class
 * @since 1.1.0
 * @param (string) $columns Number of columns
 * @param (string) $bp The breakpoint
 **/ 

function get_column_class($columns, $bp = 'sm') {
	return 'col-' . $bp . '-' . $columns;
}



/**
 * Transform array of strings to valid HTML classes
 * @since 1.1.0
 * @param (array) $classes Array of strings
 **/ 

function get_classes_from_array($classes) {
	if ( is_array($classes) && !empty($classes) ) {
		return implode(' ', $classes);
	}
}

 ?>