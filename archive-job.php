<?php 
get_header(); 
get_template_part('partials/page', 'header'); 
?>


<?php 
if ( have_posts() ) : 
	while ( have_posts() ) :
		the_post();

		$terms    = get_the_terms($post, 'kontor');
		$offices  = [];
		foreach($terms as $office) {
			$offices[] = $office->name;
		}
		$acf_term = $terms[0];
		$acf_term = $acf_term->taxonomy . '_' . $acf_term->term_id;
		$title    = get_the_title();
		$featured = get_field('featured');
		$excerpt  = get_field('excerpt') ?: the_excerpt();
		$link     = get_permalink();
		 ?>

		<article class="job-post">
			<div class="section--white job-post__content">
				<h2 class="job-post__title"><a href="<?= $link ?>"><?= $title ?></a></h2>
				<div class="job-post__meta">
					<p class="job-post__meta-item"><?php echo implode(' | ', $offices); ?></p>
				</div>
				<div class="job-post__excerpt">
					<?= $excerpt ?>
				</div>
				<a href="<?= $link ?>" class="job-post__more">Læs mere om stillingen her</a>
			</div>
			<a href="<?= $link ?>" class="job-post__featured" style="background-image: url(<?= $featured['sizes']['post-featured']; ?>);"></a>
		</article>
		<?php 
		endwhile;
endif;
?>

<?php get_footer(); ?>