	<?php 
	/**
	 * Inspirational navigation
	 **/ 

	$bottom_link = get_field('bottom_link_url');

	if ( $bottom_link ) : ?>
	<aside class="navigator">
		<div class="container-fluid">
			<a href="<?php echo get_permalink($bottom_link); ?>" class="navigator__btn"><?php the_field('bottom_link_text'); ?></a>
		</div>
	</aside>
	<?php endif; ?>


	<?php 
	/**
	 * Top footer
	 **/ 

	// Social
	$facebook 	= get_field('social_facebook', 'options'); 
	$google 		= get_field('social_google', 'options'); 
	$linkedin 	= get_field('social_linkedin', 'options'); 

	if ( ! is_front_page() ) : ?>

	<nav class="footer section--orange-dark footer--top" role="navigation">
		<div class="container">
			<div class="social social--footer">
				<a href="<?php echo $facebook; ?>" target="_blank" class="social__icon"><i class="icon--facebook"></i></a>
				<a href="<?php echo $google; ?>" target="_blank" class="social__icon"><i class="icon--google-plus"></i></a>
				<a href="<?php echo $linkedin; ?>" target="_blank" class="social__icon"><i class="icon--linkedin"></i></a>
			</div>
			
			<?php 
			// Yoast breadcrumbs
			if ( function_exists('yoast_breadcrumb') ) {
				yoast_breadcrumb('<div class="breadcrumbs">', '</div>');
			} ?>
		</div>
	</nav>

	<?php endif; ?>
</main>

<?php 
/**
 * Main footer
 **/ ?>

<footer class="footer footer--main section--orange" role="contentinfo">
	<div class="container">
		<div class="row">
				
			<div class="col-sm-2 visible-lg visible-hd widget--footer">
				<img src="<?php echo get_template_directory_uri(); ?>/assets/images/logo-small.svg" alt="atriumWeb logo" class="footer__logo">
			</div>
			
			<?php 
			// Aarhus
			$aarhus_address = get_field('aarhus_address', 'options');
			$aarhus_phone   = get_field('aarhus_phone', 'options'); ?>

			<div class="col-xs-6 col-md-3 widget--footer widget--contact">
				<h4 class="widget__title widget__title--footer">Aarhus</h4>
				<div class="widget__content widget__content--footer">
					<?= $aarhus_address ?>
					<p><a href="tel:<?= get_phone_number($aarhus_phone) ?>"><?= $aarhus_phone ?></a></p>
				</div>
			</div>
			

			<?php 
			// Copenhagen
			$copenhagen_address = get_field('copenhagen_address', 'options');
			$copenhagen_phone   = get_field('copenhagen_phone', 'options'); ?>
			
			<div class="col-xs-6 col-md-3 widget--footer widget--contact">
				<h4 class="widget__title widget__title--footer">København</h4>
				<div class="widget__content widget__content--footer">
					<?= $copenhagen_address ?>
					<p><a href="tel:<?= get_phone_number($copenhagen_phone) ?>"><?= $copenhagen_phone ?></a></p>
				</div>
			</div>

			<div class="col-sm-12 col-md-6 col-lg-4 widget--footer widget--newsletter">
				<h4 class="widget__title widget__title--footer">Nyhedsbrev</h4>
				<div class="widget__content widget__content--footer">
					<?php echo do_shortcode('[mc4wp_form id="1017"]'); ?>
				</div>
			</div>

		</div>
	</div>
</footer>


<?php 
/**
 * Bottom footer
 **/  

$cvr = get_field('company_cvr', 'options');
$mail = get_field('company_mail', 'options');
$phone = get_field('company_phone', 'options');
$terms = 1092;
?>

<div class="footer section--grey-light footer--bottom">
	<div class="container">
		<span class="footer__item--bottom">CVR: <?= $cvr ?></span>
		<span class="footer__item--bottom">Telefon: <a href="tel:<?= get_phone_number($phone) ?>"><?= $phone ?></a></span>
		<span class="footer__item--bottom">E-mail: <a href="mailto:<?= $mail ?>"><?= $mail ?></a></span>
		<span class="footer__item--bottom"><a href="<?= get_permalink($terms); ?>">Forretningsbetingelser</a></span>
	</div>
</div>


<?php 
/**
 * Status
 **/ 

if ( get_field('show_status', 'options') ) : ?>
	<div class="status">
		<?= get_field('status', 'options'); ?>
	</div>
<?php endif; ?>

<div class="document-footer">
	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-26131427-1', 'auto');
	  ga('send', 'pageview');
	</script>
	
	<?php wp_footer(); ?>
</div>
</body>
</html>