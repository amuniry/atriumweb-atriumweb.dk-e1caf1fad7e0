<?php 
/**
 * Case description
 **/ 

$description = get_field('description');

if ($description) : ?>

<div class="widget--sidebar case__description">
	<?= $description; ?>
</div>

<?php endif; ?>



<?php 
/**
 * Case categories
 **/ 

$cats = get_field('tax_type');
if ($cats) : ?>

<div class="widget--sidebar">
	<?php //implode(glue, pieces) ?>
</div>
<?php endif; ?>