<?php 

/**
 * Add theme support
 * @since 1.0.0
 **/ 

// Post thumbnails
add_theme_support( 'post-thumbnails', array( 'post' ) );


// Title tag (SEO)
add_theme_support( 'title-tag' );


// HTML markup and tags
add_theme_support( 'html5', array(
	'search-form', 
	'comment-form', 
	'comment-list', 
	'gallery', 
	'caption'
));



/**
 * Add 'defer' or 'async' attribute to specified scripts
 * @since 1.1.0
 * @link http://diywpblog.com/add-defer-or-async-attribute-to-wordpress-scripts/
 **/ 

function add_defer_async_attributes( $tag ) {

	// Array of scripts to defer
	$scripts_to_defer = array();

	foreach( $scripts_to_defer as $defer_script ) {
		if ( true == strpos( $tag, $defer_script ) )
			$tag = str_replace( ' src', ' defer src', $tag );
	}

	// Array of scripts to async
	$scripts_to_async = array();

	foreach( $scripts_to_async as $async_script ) {
		if ( true == strpos( $tag, $async_script ) )
			$tag = str_replace( ' src', ' async src', $tag );
	}

	return $tag;
}

add_filter('script_loader_tag', 'add_defer_async_attributes', 10, 2);



/**
 * TypeKit enqueueing and caching
 * @since 1.0.3
 **/ 

// Enqueue TypeKit fonts
function enqueue_typekit_fonts() {
	add_action('wp_head', 'typekit_cache');
	add_action('wp_footer', 'typekit_kit');
}


// Cache script (not available to IE9 and below)
function typekit_cache() {
	$cache = '<!--[if !IE ]>';
	$cache .= '<script>';
		$cache .= '!function(e,t,n,a,r,s,l,p){n&&(s=n[a],s&&(l=e.createElement("style"),l.innerHTML=s,e.getElementsByTagName("head")[0].appendChild(l)),p=t.setAttribute,t.setAttribute=function(e,l,u,i){"string"==typeof l&&l.indexOf(r)>-1&&(u=new XMLHttpRequest,u.open("GET",l,!0),u.onreadystatechange=function(){4===u.readyState&&(i=u.responseText.replace(/url\(\//g,"url("+r+"/"),i!==s&&(n[a]=i))},u.send(null),t.setAttribute=p,s)||p.apply(this,arguments)})}(document,Element.prototype,localStorage,"tk","https://use.typekit.net");';
	$cache .= '</script>';
	$cache .= '<![endif]-->';

	echo $cache;
}


// Advanced embed code for kit
function typekit_kit() {
	$kit = '<script>';
	$kit .= '(function(d) {';
		$kit .= 'var config = {';
			$kit .= 'kitId: "' . TYPEKIT_ID . '",';
			$kit .= 'scriptTimeout: 3000,';
			$kit .= 'async: true';
		$kit .= '},';
		$kit .= 'h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src="https://use.typekit.net/"+config.kitId+".js";tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)';
	$kit .= '})(document);';
	$kit .= '</script>';

	echo $kit;
}



/**
 * Enable shortcodes in widgets
 * @since 1.0.1
 **/ 

add_filter('widget_text', 'do_shortcode');

?>