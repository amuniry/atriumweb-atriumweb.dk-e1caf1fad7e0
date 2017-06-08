<?php 
/**
 * Theme dependencies
 * @since 1.0.0a
 * ================================================== */ 

$library = array(
	'clean-up.php',
	'debug.php',
	'editor.php',
	'nav-walker.php',
	'security.php',
	'utilities.php',
	'atframe-utilities.php',
	'atframe-layout.php'
);

foreach ($library as $file) {
	
	$filepath = __DIR__ . '/' . $file;

	if ( !file_exists($filepath) ) {
		trigger_error( sprintf('Error locating %s for inclusion', $file), E_USER_ERROR );
	}
	require_once $filepath;
}

unset($file, $filepath);

?>