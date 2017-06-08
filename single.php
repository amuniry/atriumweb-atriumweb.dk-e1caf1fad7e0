<?php get_header(); ?>

<div class="l-flex l-flex--equal-height l-flex--justify">
	<div class="section--white col-sm-7 no-gutter">

		<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

			<article class="post post--<?php echo $post->post_type; ?>" role="article" itemscope itemtype="http://microformats.org/profile/hatom">

				<?php get_template_part('partials/post/post', 'header'); ?>
				<?php get_template_part('partials/post/post', 'meta'); ?>
				<?php get_template_part('partials/post/post', 'content'); ?>
				
				<div class="section--l">
					<?php social_share('single'); ?>
				</div>
				
			</article>

		<?php endwhile; else: ?>

			<?php get_template_part('partials/post', 'none'); ?>

		<?php endif; ?>


	</div>

	<aside class="col-sm-5 section--l section--light-grey sidebar" role="complementary">
		<?php get_sidebar(); ?>
	</aside>
</div>

<?php get_footer(); ?>