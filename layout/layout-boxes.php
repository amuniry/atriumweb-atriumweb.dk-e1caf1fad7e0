<?php 
/**
 * Field type: Boxes
 **/ 

if ( have_rows('boxes') ) : ?>

<section class="section--grey-light section--l support">
	<div class="support__inner">

		<?php while ( have_rows('boxes') ) : the_row();
		$link_type = get_sub_field('link_type');
		$link = ($link_type === 'internal') ? get_sub_field('link_internal') : get_sub_field('link_external');
		$title = get_sub_field('title');
		$description = get_sub_field('description');
		?>

		<div class="col-sm-6 col-lg-3 support__item">
			<a href="<?= $link ?>" <?php if ($link_type === 'external') echo 'target="_blank"'; ?> class="support__link">
				<h2 class="support__title"><?= $title ?></h2>
				<div class="support__description">
					<?= $description ?>
				</div>
			</a>
		</div>

		<?php endwhile; ?>

	</div>
</section>

<?php endif; ?>