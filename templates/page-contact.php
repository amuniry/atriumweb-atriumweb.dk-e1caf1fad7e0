<?php 
/**
 * Template Name: Kontaktside
 * @since 1.1.0
 * ================================================== */ 

get_header(); 

/**
 * Page header
 **/ 

$page_hero = (get_field('page_hero')) ?: get_field('page_hero', 'options');
$page_title = get_atframe_title();
$page_subtitle = get_field('page_subtitle');
$page_content = get_field('content');

// Graivty forms
// https://www.gravityhelp.com/documentation/article/embedding-a-form/
$gravity = gravity_form( 1, $display_title = false, $display_description = false, $display_inactive = false, $field_values = null, $ajax = false, 2, $echo = false );
?>
<div class="page--split">
	
	<header class="col-lg-6 page__header--split" style="background-image: url(<?= $page_hero['sizes']['large'] ?>);">
		<div class="page__inner--split">
			<h1 class="page__title"><?= $page_title ?></h1>
			<p class="page__subtitle"><?= $page_subtitle ?></p>
		</div>
	</header>

	<div class="col-lg-6 contact__section page__content--split">

		<div class="post__content">
			<?= $page_content ?>
		</div>

		<div class="gravity">
			<?= $gravity ?>
		</div>

	</div>

</div>

<?php 
/**
 * Departments repeater
 **/ 
if ( have_rows('departments') ) : ?>
<section class="departments">

	<?php while ( have_rows('departments') ) : the_row();

	// Prepare variables
	$title    = get_sub_field('title'); 
	$subtitle = get_sub_field('subtitle'); 
	$phone    = get_sub_field('phone'); 
	$address  = get_sub_field('address'); 
	$email    = get_sub_field('email'); 
	$maps     = get_sub_field('google_maps');  ?>

	<article class="department">

		<div class="col-sm-6 contact__section department__content">
			<h2 class="department__title"><?= $title ?></h2>
			<p class="department__subtitle"><?= $subtitle ?></p>
			<ul class="department__meta">
				<li class="department__contact">
					<i class="department__contact-icon icon--pin"></i>
					<p class="department__contact-text"><?= $address ?></p>
				</li>
				<li class="department__contact">
					<i class="department__contact-icon icon--phone"></i>
					<a class="department__contact-text" href="tel:<?= $phone ?>"><?= $phone ?></a>
				</li>
				<li class="department__contact">
					<i class="department__contact-icon icon--mail"></i>
					<a class="department__contact-text" href="mailto:<?= $email ?>"><?= $email ?></a>
				</li>
			</ul>

		</div>

		<?php if ( !empty($maps)) : ?>
			<div class="col-sm-6 department__map google-map">
				<div class="marker" data-lat="<?php echo $maps['lat']; ?>" data-lng="<?php echo $maps['lng']; ?>"></div>
			</div>
		<?php endif; ?>
	</article>


	<?php endwhile; ?>

</section>
<?php endif; ?>

<?php get_footer(); ?>