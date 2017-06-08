<?php 
/**
 * Header partial
 * @since 1.1.0
 * ================================================== */ 


/**
 * Page title
 **/ 

if ( is_category() ) {
	$page_title = single_cat_title( '', false );
} elseif ( is_archive() ) {
	$page_title = post_type_archive_title( '', false );
	if ( is_post_type_archive('cases') ) {
		$page_title = (get_field('cases_title', 'options')) ?: post_type_archive_title( '', false );
		$subtitle = get_field('cases_subtitle', 'options');
	} elseif ( is_post_type_archive('job') ) {
		$page_title = (get_field('jobs_title', 'options')) ?: post_type_archive_title( '', false );
		$subtitle = get_field('jobs_subtitle', 'options');
	}
} elseif ( is_404() ) {
	$page_title = __('Ups, siden kan ikke findes', 'atriumweb');
} elseif ( is_search() ) {
	$page_title = __('Søgning', 'atriumweb');
} elseif ( is_home() ) {
	$page_title = get_the_title( get_option('page_for_posts') );
} else {
	$page_title = get_atframe_title();
	$subtitle = get_field('page_subtitle');
}

$page_title = '<h1 class="page__title">' . $page_title . '</h1>';


/**
 * Page subtitle
 **/ 
$page_subtitle = ($subtitle) ? '<h3 class="page__subtitle">' . $subtitle . '</h3>' : '';


/**
 * Page header background
 **/ 

$page_hero = ( get_field('page_hero') ) ?: get_field('page_hero', 'options');
$page_hero = ( is_post_type_archive('cases') ) ? get_field('cases_bg', 'options') : $page_hero;
$page_hero = ( is_post_type_archive('job') ) ? get_field('jobs_bg', 'options') : $page_hero;
 ?>

<header class="page__header page__header--large" style="background-image: url( <?php echo $page_hero['sizes']['page-header-horizontal']; ?> );">
	<?php echo $page_title; ?>
	<?php echo $page_subtitle; ?>
</header>