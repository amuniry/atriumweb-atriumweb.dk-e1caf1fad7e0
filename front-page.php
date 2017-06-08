<?php get_header(); ?>

<?php 
/**
 * Hero section
 **/ 

$poster = get_field('video_poster');
?>

<div class="hero" style="background-image: url(<?php echo $poster['url']; ?>);">
	
	<?php 
	/**
	 * Video
	 **/ 
	$video_mp4 = get_field('video_mp4');
	$video_ogv = get_field('video_ogv');
	$video_webm = get_field('video_webm');
	?>
	
	<video id="hero__video" class="hidden-xs hero__video" autoplay preload="auto" loop muted="muted" volume="0" poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQ">
		<source src="<?php echo $video_mp4; ?>" type="video/mp4" codecs="avc1, mp4a">
		<source src="<?php echo $video_ogv; ?>" type="video/ogg" codecs="theora, vorbis">
		<source src="<?php echo $video_webm; ?>" type="video/webm" codecs="vp8, vorbis">
		Din browser understøtter ikke HTML5 video. Opgrader venligst din browser.
	</video>


	<div class="hero__inner">
		<?php 
		/**
		 * Words
		 **/ 

		$words_constant = get_field('words_constant');
		$words = get_field('words');
		$words_comma_separated = preg_replace( "/((\r?\n)|(\r\n?))/", ', ', trim( $words) );
		$word_placeholder = explode( "\r", trim( $words) );
		?>
		
		<h2 class="slogan" data-words="<?php echo $words_comma_separated; ?>">
			<span class="slogan__word slogan__word--constant"><?php echo $words_constant; ?></span>
			<span class="slogan__word slogan__word--placeholder">
				&nbsp;
				<span class="slogan__word--typer"><?php echo $word_placeholder[0]; ?></span>
			</span>
		</h2>

	</div>
</div>

<?php get_footer(); ?>