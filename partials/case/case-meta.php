<?php 
/**
 * Case meta
 **/ 

// Taxonomy type
$types = get_field('tax_type');
$type_names = [];

foreach ( $types as $type ) {
	$type = get_term($type, 'typer');
	$type_names[] = $type->name;
}

// Taxonomy colours
$colours = get_field('tax_colours');
$colour_names = [];

foreach ( $colours as $colour ) {
	$colour = get_term($colour, 'farver');
	$colour_names[] = $colour->name;
}

?>

<footer class="case__meta">
	
	<?php	if ( $type_names ) : ?>
		<div class="case__meta__item">
			Erhverv: <span><?= implode(', ', $type_names); ?></span>
		</div>
	<?php endif; ?>

	<?php if ( $colour_names ) : ?>
		<div class="case__meta__item">
			Farver: <span><?= implode(', ', $colour_names); ?></span>
		</div>
	<?php endif; ?>

</footer>