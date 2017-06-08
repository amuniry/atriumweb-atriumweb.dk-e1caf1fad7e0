<?php
/**
 * Custom navigation walker
 * @since 1.0.0
 * ================================================== */ 

/**
 * Cleaner walker for wp_nav_menu()
 * @since 1.0.0
 *
 * Walker_Nav_Menu (WordPress default) example output:
 *   <li id="menu-item-8" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8"><a href="/">Home</a></li>
 *   <li id="menu-item-9" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-9"><a href="/sample-page/">Sample Page</a></li>
 *
 * Atframe_Walker_Nav example output:
 *   <li class="nav__item nav__item--home"><a href="/">Home</a></li>
 *   <li class="nav__item nav__item--sample-page is-active"><a href="/sample-page/">Sample Page</a></li>
 **/

class Atframe_Walker_Nav extends Walker_Nav_Menu {

	function check_current($classes) {
		return preg_match('/(current[-_])|active|dropdown/', $classes);
	}

	function start_lvl(&$output, $depth = 0, $args = array()) {
		$output .= '<ul class="nav__dropdown" aria-hidden="true" aria-label="submenu">';
	}

	function start_el(&$output, $item, $depth = 0, $args = array(), $id = 0) {
		$item_html = '';

		parent::start_el($item_html, $item, $depth, $args);
	
		$item_html = str_replace('<a', '<a class="nav__link"', $item_html);

		if ($item->is_dropdown && ($depth === 0)) {
			$item_html = str_replace('<a class="nav__link"', '<a class="nav__link nav__dropdown-toggle" aria-haspopup="true"', $item_html);
			$item_html = str_replace('</a>', ' <i class="caret"></i></a>', $item_html);
		}
		elseif (stristr($item_html, 'li class="divider')) {
			$item_html = preg_replace('/<a[^>]*>.*?<\/a>/iU', '', $item_html);
		}
		elseif (stristr($item_html, 'li class="dropdown-header')) {
			$item_html = preg_replace('/<a[^>]*>(.*)<\/a>/iU', '$1', $item_html);
		}

		if(!empty($item->description)) {
			$item_html .= '<small class="nav__item__description">' . esc_attr( $item->description ) . '</small>';
		}

		$item_html = apply_filters('wp_nav_menu_item', $item_html);
		$output .= $item_html;
	}

	function display_element($element, &$children_elements, $max_depth, $depth = 0, $args, &$output) {
		$element->is_dropdown = ((!empty($children_elements[$element->ID]) && (($depth + 1) < $max_depth || ($max_depth === 0))));

		if ($element->is_dropdown) {
			$element->classes[] = 'has-dropdown';
		}

		parent::display_element($element, $children_elements, $max_depth, $depth, $args, $output);
	}
}



/**
 * Check if element is empty
 * @since 1.0.0
 **/

function is_element_empty($element) {
	$element = trim($element);
	return !empty($element);
}



/**
 * Remove the id="" on nav menu items and add active class
 * Return 'menu-slug' for nav menu classes
 * @since 1.0.0
 **/

function nav_menu_css_class($classes, $item) {
	$slug = sanitize_title($item->title);
	$post_type = get_query_var('post_type');
	$blog_id = get_option('page_for_posts');
	$is_404 = is_404();

	$classes = preg_replace('/(current(-menu-|[-_]page[-_])(item|parent|ancestor))/', 'is-active', $classes);
	$classes = preg_replace('/^((menu|page)[-_\w+]+)+/', '', $classes);
	$classes[] = 'nav__item';
	$classes[] = 'nav__item--' . $slug;
	$classes = array_unique($classes);

	// Add active class if item has "cases-cpt" class
	if ( $post_type === 'cases') {
		if (  in_array('cases-cpt', $classes) ) {
			$classes[] = 'is-active';
		}
	}

	// Add active class if item has "job-cpt" class
	if ( $post_type === 'job') {
		if (  in_array('job-cpt', $classes) ) {
			$classes[] = 'is-active';
		}
	}

	// If "blog" has active class, and current page is either tax or cpt, remove active class
	if ( $item->object_id === $blog_id && in_array('is-active', $classes)) {
		if ( $post_type === 'cases' || $post_type === 'job' || $is_404 ) {
			$key = array_search('is-active', $classes); 
			if ($key !== false) unset($classes[$key]);
		}
	}

	return array_filter($classes, 'is_element_empty');
}

add_filter('nav_menu_css_class', 'nav_menu_css_class', 10, 2);

// Remove id
add_filter('nav_menu_item_id', '__return_null');



/**
 * Remove the container via wp_nav_menu_args
 * @since 1.0.0
 **/

function nav_menu_args($args = '') {
	$nav_menu_args = array();

	$nav_menu_args['container'] = false;

	if (!$args['items_wrap']) {
		$nav_menu_args['items_wrap'] = '<ul class="%2$s">%3$s</ul>';
	}

	if (!$args['depth']) {
		$nav_menu_args['depth'] = 2;
	}

	return array_merge($args, $nav_menu_args);
}

add_filter('wp_nav_menu_args', 'nav_menu_args');

?>