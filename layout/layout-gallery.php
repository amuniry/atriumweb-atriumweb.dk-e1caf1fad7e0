<?php 
/**
 * Field type: Gallery
 * @since 1.1.0
 * ================================================== */ 

$title = get_sub_field('title');
$gallery = get_sub_field('gallery');
 
if ( $gallery ) : ?>

	<section class="gallery">
		<div class="container">
			<?php if ( $title !== '' ) : ?> <h2 class="gallery__title"><?php echo $title; ?></h2><?php endif; ?>
			<div class="row">
				
				<?php 
				/**
				 * Output gallery 
				 **/
				
				$i = 0;
				foreach ( $gallery as $image ) :
				$i++;	?>
					
					<div class="col-xs-6 col-sm-4 col-md-3 gallery__item">
						<a href="<?php echo $image['sizes']['large']; ?>" class="zoom gallery__link" rel="gallery">
							<img src="<?php echo $image['sizes']['thumbnail']; ?>" alt="<?php echo $image['alt']; ?>" class="gallery__image">
						</a>
					</div>
						
					<?php if ( $i % 3 === 0 ) echo '<div class="clearfix hidden-xs hidden-md hidden-lg"></div>'; ?>
					<?php if ( $i % 4 === 0 ) echo '<div class="clearfix hidden-xs hidden-sm hidden-md"></div>'; ?>

				<?php endforeach; ?>


			</div>
		</div>
	</section>

<?php endif; ?>