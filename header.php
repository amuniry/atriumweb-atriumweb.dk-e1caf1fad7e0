<!DOCTYPE html>
<!--[if IE 9]> <html class="old-ie ie9 no-js" <?php language_attributes(); ?>> <![endif]-->
<!--[if !(IE 6) | !(IE 7) | !(IE 8) | !(IE 9)]><!--> <html <?php language_attributes(); ?> class="no-js"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

	<link rel="apple-touch-icon-precomposed" href="<?= get_template_directory_uri(); ?>/assets/images/favicon/favicon-152.png">
	<meta name="msapplication-TileColor" content="#FFFFFF">
	<meta name="msapplication-TileImage" content="<?= get_template_directory_uri(); ?>/assets/images/favicon/favicon-144.png">

	<!--[if lt IE 9]>
		<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->
	
	<script>document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/g, '') + ' js ';</script>

	<?php wp_head(); ?>

	<script>
	!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
	n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
	n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
	t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
	document,'script','https://connect.facebook.net/en_US/fbevents.js');

	fbq('init', '1538307889800095');
	fbq('track', "PageView");</script>
	<noscript><img height="1" width="1" style="display:none"
	src="https://www.facebook.com/tr?id=1538307889800095&ev=PageView&noscript=1"
	/></noscript>
</head>

<body <?php body_class('body'); ?>>

<div class="loader" id="loader">
	<div class="loader__icon"></div>
</div>

<?php 
/**
 * Header
 **/ 

$header_class = ( is_front_page() ) ? 'header header--home' : 'header';
 ?>
<header class="<?php echo $header_class; ?>" role="banner">
		
	<?php 
	/**
	 * Logo markup
	 **/ 

	$blog_name = get_bloginfo( 'name' );
	$logo  = ( is_front_page() ) ? '<h1 class="ir">' . $blog_name . '</h1>' : '<p class="ir">' . $blog_name . '</p>';
	?>

	<a class="header__logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo $blog_name; ?>" rel="home">
		<?php echo $logo; ?>
	</a>


	<?php 
	/**
	 * Social
	 **/ 
	?>

	<div class="social social--header">
		<a href="<?php the_field('social_facebook', 'options'); ?>" target="_blank" class="social__icon"><i class="icon--facebook"></i></a>
		<a href="<?php the_field('social_google', 'options'); ?>" target="_blank" class="social__icon"><i class="icon--google-plus"></i></a>
		<a href="<?php the_field('social_linkedin', 'options'); ?>" target="_blank" class="social__icon"><i class="icon--linkedin"></i></a>
	</div>
</header>


<div class="nav-toggle">
	<span class="nav-toggle__label"><?php _e('Menu', 'atriumweb') ?></span>
	<span class="nav-toggle__icon"></span>
</div>

<div class="nav-wrapper">
	<nav class="nav" role="navigation">
		<ul class="nav__list">
			<?php wp_nav_menu( array(
				'theme_location'	=> 'primary-nav',
				'container'			=> false,
				'menu_class'		=> 'nav__list',
				'echo'				=> true,
				'items_wrap'		=> '%3$s',
				'depth'				=> 10,
				'fallback_cb'		=> '__return_false',
				'walker'				=> new Atframe_Walker_nav
			)); ?>
		</ul>
	</nav>
</div>

<main class="main" role="main" id="main">