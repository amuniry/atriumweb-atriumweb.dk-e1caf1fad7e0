<?php 
/**
 * Site framework
 **/ 

$library = array(
	'post-types',
	'comments-walker',
	'ajax',
	'social',
	'helpers',
	'shortcodes',
	'blog'
);

foreach ($library as $file) {
	
	$filepath = __DIR__ . '/' . $file . '.php';

	if ( !file_exists($filepath) ) {
		trigger_error( sprintf('Error locating %s for inclusion', $file), E_USER_ERROR );
	}
	require_once $filepath;
}

unset($file, $filepath);

?>