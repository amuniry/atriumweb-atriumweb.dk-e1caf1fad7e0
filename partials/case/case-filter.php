<?php 
/**
 * Filter cases
 **/ 

$types = get_terms('typer', array(
	'hide_empty' => true
));

$colours = get_terms('farver', array(
	'hide_empty' => true
));

?>
<form class="section--l filter filter--cases" id="cases-filter">
	<fieldset class="filter__item filter__item--types">
		<legend class="filter__title">Erhverv</legend>

		<div class="filter__types js-cases-filter-select">

			<div class="filter__type filter__type--current js-cases-filter-trigger">
				<span class="js-cases-filter-text">Vælg erhverv</span> 
				<i class="icon--angle-down"></i>
			</div>

			<div class="filter__types-list js-cases-filter-list">

				<label for="filter_erhverv_alle" class="filter__type">
					<input type="radio" value="<?= $types[0]->taxonomy; ?>" checked id="filter_erhverv_alle" name="<?= $types[0]->taxonomy; ?>" class="filter__input js-cases-filter-input">
					<span class="filter__label">Alle erhverv</span>
				</label>

				<?php 
				// Loop through filters
				foreach($types as $type) : 
					$id = 'filter_' . $type->slug . '_' . $type->term_id;
					$slug = $type->slug;
					$name = $type->name;
					$taxonomy = $type->taxonomy; ?>

					<label for="<?= $id; ?>" class="filter__type">
						<input type="radio" value="<?= $slug; ?>" name="<?= $taxonomy; ?>" id="<?= $id; ?>" class="filter__input js-cases-filter-input">
						<span class="filter__label"><?= $name; ?></span>
					</label>

				<?php endforeach; ?>

			</div> 
		</div>
	</fieldset>

	<fieldset class="filter__item filter__items--colours">
		<legend class="filter__title">Farver</legend>
		<div class="filter__colours">

			<label for="farver-alle" class="filter__colour-label">
				<input type="radio" value="<?= $colours[0]->taxonomy; ?>" checked id="farver-alle" name="<?= $colours[0]->taxonomy; ?>" class="filter__input">
				<span class="filter__colour filter__colour--reset">Alle</span>
			</label>

			<?php foreach($colours as $colour) : 
			$hex = get_field('colour', $colour->taxonomy . '_' . $colour->term_id);
			?>

				<label for="<?= $colour->slug . '_' . $colour->term_id;  ?>" class="filter__colour-label">
					<input type="radio" value="<?= $colour->slug; ?>" name="<?= $colour->taxonomy; ?>" id="<?= $colour->slug . '_' . $colour->term_id;  ?>" class="filter__input">
					<span class="filter__colour" style="background-color: <?= $hex; ?>"></span>
					<?= $colour->name; ?>
				</label>
			<?php endforeach; ?>
		</div>
	</fieldset>

</form>