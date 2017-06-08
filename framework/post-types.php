<?php 
/**
 * Register job custom post type
 **/ 

function register_job_cpt() {

	$labels = array(
		'name'							=> _x( 'Job', 'Post Type General Name', 'atriumweb' ),
		'singular_name'				=> _x( 'Job', 'Post Type Singular Name', 'atriumweb' ),
		'menu_name'						=> __( 'Job', 'atriumweb' ),
		'name_admin_bar'				=> __( 'Job', 'atriumweb' ),
		'archives'						=> __( 'Arkiver: Job', 'atriumweb' ),
		'parent_item_colon'			=> __( 'Forælder-job:', 'atriumweb' ),
		'all_items'						=> __( 'Alle job', 'atriumweb' ),
		'add_new_item'					=> __( 'Tilføj ny job', 'atriumweb' ),
		'add_new'						=> __( 'Tilføj ny', 'atriumweb' ),
		'new_item'						=> __( 'Ny job', 'atriumweb' ),
		'edit_item'						=> __( 'Rediger job', 'atriumweb' ),
		'update_item'					=> __( 'Opdater job', 'atriumweb' ),
		'view_item'						=> __( 'Vis job', 'atriumweb' ),
		'search_items'					=> __( 'Søg i job', 'atriumweb' ),
		'not_found'						=> __( 'Ikke fundet', 'atriumweb' ),
		'not_found_in_trash'			=> __( 'Ikke fundet i papirkurven', 'atriumweb' ),
		'featured_image'				=> __( 'Udvalgt billede', 'atriumweb' ),
		'set_featured_image'			=> __( 'Sæt udvalgt billede', 'atriumweb' ),
		'remove_featured_image'		=> __( 'Fjern udvalgt billede', 'atriumweb' ),
		'use_featured_image'			=> __( 'Brug som udvalgt billede', 'atriumweb' ),
		'insert_into_item'			=> __( 'Indsæt i job', 'atriumweb' ),
		'uploaded_to_this_item'		=> __( 'Uploaded til denne job', 'atriumweb' ),
		'items_list'					=> __( 'Caseliste', 'atriumweb' ),
		'filter_items_list'			=> __( 'Filtrer job', 'atriumweb' ),
	);
	
	$args = array(
		'label'						=> __( 'Job', 'atriumweb' ),
		'description'				=> __( 'Ledige stillinger i atriumWeb', 'atriumweb' ),
		'labels'						=> $labels,
		'supports'					=> array( 'title', 'thumbnail', 'editor', 'revisions' ),
		'hierarchical'				=> false,
		'public'						=> true,
		'show_ui'					=> true,
		'show_in_menu'				=> true,
		'menu_position'			=> 5,
		'menu_icon'					=> 'dashicons-megaphone',
		'show_in_admin_bar'		=> true,
		'show_in_nav_menus'		=> true,
		'can_export'				=> true,
		'has_archive'				=> 'job',
		'exclude_from_search'	=> false,
		'publicly_queryable'		=> true,
		'capability_type'			=> 'post',
		'rewrite'					=> array(
			'slug'			=> 'job',
			'with_front'	=> false
		)
	);

	register_post_type( 'job', $args );

}

add_action( 'init', 'register_job_cpt', 0 );



/**
 * Register office taxonomy
 **/ 

function register_office_taxonomy() {
	$labels = array(
		'name'                       => _x( 'Kontor', 'Kontortaksonomi navn - flertal', 'atriumweb' ),
		'singular_name'              => _x( 'Kontor', 'Kontortaksonomi navn - ental', 'atriumweb' ),
		'search_items'               => __( 'Søg i kontorer', 'atriumweb' ),
		'popular_items'              => __( 'Populære kontorer', 'atriumweb' ),
		'all_items'                  => __( 'Alle kontorer', 'atriumweb' ),
		'parent_item'                => null,
		'parent_item_colon'          => null,
		'edit_item'                  => __( 'Rediger kontor', 'atriumweb' ),
		'update_item'                => __( 'Opdater kontor', 'atriumweb' ),
		'add_new_item'               => __( 'Tilføj nyt kontor', 'atriumweb' ),
		'new_item_name'              => __( 'Nyt kontornavn', 'atriumweb' ),
		'separate_items_with_commas' => __( 'Separer kontor med kommaer', 'atriumweb' ),
		'add_or_remove_items'        => __( 'Tilføj eller fjern kontor', 'atriumweb' ),
		'choose_from_most_used'      => __( 'Vælg fra meste brugte kontorer', 'atriumweb' ),
		'not_found'                  => __( 'Intet kontor fundet.', 'atriumweb' ),
		'menu_name'                  => __( 'Kontorer', 'atriumweb' ),
	);

	$args = array(
		'hierarchical'          => true,
		'labels'                => $labels,
		'show_ui'               => true,
		'show_admin_column'     => true,
		'update_count_callback' => '_update_post_term_count',
		'query_var'             => false,
		'rewrite'               => array( 'slug' => 'kontor' ),
	);

	register_taxonomy( 'kontor', 'job', $args );
}

add_action( 'init', 'register_office_taxonomy' );



/**
 * Register cases custom post type
 **/ 

function register_cases_cpt() {

	$labels = array(
		'name'							=> _x( 'Cases', 'Post Type General Name', 'atriumweb' ),
		'singular_name'				=> _x( 'Case', 'Post Type Singular Name', 'atriumweb' ),
		'menu_name'						=> __( 'Cases', 'atriumweb' ),
		'name_admin_bar'				=> __( 'Cases', 'atriumweb' ),
		'archives'						=> __( 'Arkiver: Cases', 'atriumweb' ),
		'parent_item_colon'			=> __( 'Forælder-case:', 'atriumweb' ),
		'all_items'						=> __( 'Alle cases', 'atriumweb' ),
		'add_new_item'					=> __( 'Tilføj ny case', 'atriumweb' ),
		'add_new'						=> __( 'Tilføj ny', 'atriumweb' ),
		'new_item'						=> __( 'Ny case', 'atriumweb' ),
		'edit_item'						=> __( 'Rediger case', 'atriumweb' ),
		'update_item'					=> __( 'Opdater case', 'atriumweb' ),
		'view_item'						=> __( 'Vis case', 'atriumweb' ),
		'search_items'					=> __( 'Søg i cases', 'atriumweb' ),
		'not_found'						=> __( 'Ikke fundet', 'atriumweb' ),
		'not_found_in_trash'			=> __( 'Ikke fundet i papirkurven', 'atriumweb' ),
		'featured_image'				=> __( 'Udvalgt billede', 'atriumweb' ),
		'set_featured_image'			=> __( 'Sæt udvalgt billede', 'atriumweb' ),
		'remove_featured_image'		=> __( 'Fjern udvalgt billede', 'atriumweb' ),
		'use_featured_image'			=> __( 'Brug som udvalgt billede', 'atriumweb' ),
		'insert_into_item'			=> __( 'Indsæt i case', 'atriumweb' ),
		'uploaded_to_this_item'		=> __( 'Uploaded til denne case', 'atriumweb' ),
		'items_list'					=> __( 'Caseliste', 'atriumweb' ),
		'filter_items_list'			=> __( 'Filtrer cases', 'atriumweb' ),
	);
	
	$args = array(
		'label'						=> __( 'Cases', 'atriumweb' ),
		'description'				=> __( 'Cases af projekter lavet af atriumWeb.', 'atriumweb' ),
		'labels'						=> $labels,
		'supports'					=> array( 'title', 'thumbnail', 'revisions' ),
		'hierarchical'				=> false,
		'public'						=> true,
		'show_ui'					=> true,
		'show_in_menu'				=> true,
		'menu_position'			=> 4,
		'menu_icon'					=> 'dashicons-heart',
		'show_in_admin_bar'		=> true,
		'show_in_nav_menus'		=> true,
		'can_export'				=> true,
		'has_archive'				=> 'cases',
		'exclude_from_search'	=> false,
		'publicly_queryable'		=> true,
		'capability_type'			=> 'post',
		'rewrite'					=> array(
			'slug'			=> 'cases',
			'with_front'	=> false,

		)
	);

	register_post_type( 'cases', $args );

}

add_action( 'init', 'register_cases_cpt', 0 );



/**
 * Register cases taxonomies
 **/ 

function register_cases_taxonomies() {

	/**
	 * Colours
	 **/ 

	$labels = array(
		'name'                       => _x( 'Farver', 'Farver taksonomi navn - flertal', 'atriumweb' ),
		'singular_name'              => _x( 'Farve', 'Farver taksonomi navn - ental', 'atriumweb' ),
		'search_items'               => __( 'Søg i farver', 'atriumweb' ),
		'popular_items'              => __( 'Populære farver', 'atriumweb' ),
		'all_items'                  => __( 'Alle farver', 'atriumweb' ),
		'parent_item'                => null,
		'parent_item_colon'          => null,
		'edit_item'                  => __( 'Rediger farve', 'atriumweb' ),
		'update_item'                => __( 'Opdater farve', 'atriumweb' ),
		'add_new_item'               => __( 'Tilføj nyt farve', 'atriumweb' ),
		'new_item_name'              => __( 'Nyt farvenavn', 'atriumweb' ),
		'separate_items_with_commas' => __( 'Separer farver med kommaer', 'atriumweb' ),
		'add_or_remove_items'        => __( 'Tilføj eller fjern farver', 'atriumweb' ),
		'choose_from_most_used'      => __( 'Vælg fra meste brugte farver', 'atriumweb' ),
		'not_found'                  => __( 'Ingen farver fundet.', 'atriumweb' ),
		'menu_name'                  => __( 'Farver', 'atriumweb' ),
	);

	$args = array(
		'hierarchical'          => false,
		'labels'                => $labels,
		'show_ui'               => true,
		'show_admin_column'     => true,
		'update_count_callback' => '_update_post_term_count',
		'query_var'             => false,
		'rewrite'               => array( 'slug' => 'farver' ),
	);

	register_taxonomy( 'farver', 'cases', $args );


	// Reset arrays
	unset($labels);
	unset($args);


	/**
	 * Type
	 **/ 

	$labels = array(
		'name'                       => _x( 'Typer', 'Typer taksonomi navn - flertal', 'atriumweb' ),
		'singular_name'              => _x( 'Type', 'Typer taksonomi navn - ental', 'atriumweb' ),
		'search_items'               => __( 'Søg i typer', 'atriumweb' ),
		'popular_items'              => __( 'Populære typer', 'atriumweb' ),
		'all_items'                  => __( 'Alle typer', 'atriumweb' ),
		'parent_item'                => null,
		'parent_item_colon'          => null,
		'edit_item'                  => __( 'Rediger type', 'atriumweb' ),
		'update_item'                => __( 'Opdater type', 'atriumweb' ),
		'add_new_item'               => __( 'Tilføj nyt type', 'atriumweb' ),
		'new_item_name'              => __( 'Nyt typenavn', 'atriumweb' ),
		'separate_items_with_commas' => __( 'Separer typer med kommaer', 'atriumweb' ),
		'add_or_remove_items'        => __( 'Tilføj eller fjern typer', 'atriumweb' ),
		'choose_from_most_used'      => __( 'Vælg fra meste brugte typer', 'atriumweb' ),
		'not_found'                  => __( 'Ingen typer fundet.', 'atriumweb' ),
		'menu_name'                  => __( 'Typer', 'atriumweb' ),
	);

	$args = array(
		'hierarchical'          => false,
		'labels'                => $labels,
		'show_ui'               => true,
		'show_admin_column'     => true,
		'update_count_callback' => '_update_post_term_count',
		'query_var'             => false,
		'rewrite'               => array( 'slug' => 'typer' ),
	);

	register_taxonomy( 'typer', 'cases', $args );

}

add_action( 'init', 'register_cases_taxonomies' );
 
?>