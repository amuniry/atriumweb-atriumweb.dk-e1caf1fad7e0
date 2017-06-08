<?php 

/**
 * Get phone number
 * @param $str string The phone number string
 **/ 


function get_phone_number($str) {
	$str = str_replace(' ', '', $str);

	if ( strpos($str, '+45') === 0 ) {
		$str = str_replace('+45', '', $str);
	}

	return $str;
}


/**
 * hex2rgba
 * @param $color string A hex colour value
 * @param $opacity integer A numerical opacity value from 0 to 1
 * @return string The converted rgb(a) value
 **/ 
 
function hex2rgba($color, $opacity = false) {

	$default = 'rgb(0,0,0)';

	//Return default if no color provided
	if (empty($color))
		return $default; 

	//Sanitize $color if "#" is provided 
	if ($color[0] == '#' ) {
		$color = substr( $color, 1 );
	}

	//Check if color has 6 or 3 characters and get values
	if (strlen($color) == 6) {
		$hex = array( $color[0] . $color[1], $color[2] . $color[3], $color[4] . $color[5] );
	} elseif ( strlen( $color ) == 3 ) {
		$hex = array( $color[0] . $color[0], $color[1] . $color[1], $color[2] . $color[2] );
	} else {
		return $default;
	}

	//Convert hexadec to rgb
	$rgb =  array_map('hexdec', $hex);

	//Check if opacity is set(rgba or rgb)
	if ($opacity){
		if (abs($opacity) > 1) {
			$opacity = 1.0;
		}
		$output = 'rgba('.implode(",",$rgb).','.$opacity.')';
	} else {
		$output = 'rgb('.implode(",",$rgb).')';
	}

	//Return rgb(a) color string
	return $output;
}


/**
 * Retrieve list of case taxonomy term slugs
 * @param object Term object
 * @return string The name property of the term
 **/ 

function get_term_slugs($term) {
	return $term->slug;
}

 ?>