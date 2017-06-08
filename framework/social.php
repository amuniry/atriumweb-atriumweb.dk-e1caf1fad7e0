<?php
function social_share($modifier = '') {
	global $post; 

	if ( $modifier !== '' ) {
		echo '<div id="share" class="share share--' . $modifier . '">';
	} else {
		echo '<div id="share" class="share">';
	}
		echo '<p class="share__title">Del siden på de sociale medier</p>';
		echo '<div class="share__list">';
			echo '<div class="share__button share__button--facebook"><div class="fb-share-button" data-href="' . get_permalink() . '" data-layout="button_count"></div></div>';
			echo '<div class="share__button share__button--twitter"><a href="https://twitter.com/share" class="twitter-share-button"{count}>Tweet</a></div>';
			echo '<div class="share__button share__button--linkedin"><script type="IN/Share" data-counter="right"></script></div>';
			echo '<div class="share__button share__button--gplus"><div class="g-plus" data-action="share" data-annotation="bubble"></div></div>';
		echo '</div>';
	echo '</div>';

	// Tilføjer scripts til footer
	add_action('wp_footer', 'social_share_scripts');
}

function social_share_scripts() {

	// // Facebook
	// echo '<div id="fb-root"></div>
	// 	<script>(function(d, s, id) {
	// 	var js, fjs = d.getElementsByTagName(s)[0];
	// 	if (d.getElementById(id)) return;
	// 	js = d.createElement(s); js.id = id;
	// 	js.src = "//connect.facebook.net/da_DK/sdk.js#xfbml=1&version=v2.5&appId=855130884595916";
	// 	fjs.parentNode.insertBefore(js, fjs);
	// 	}(document, "script", "facebook-jssdk"));</script>';

	// // LinkedIn
	// echo '<script src="//platform.linkedin.com/in.js" type="text/javascript"> lang: da_DK</script>';

	// // Twitter
	// echo '<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?"http":"https";if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document, "script", "twitter-wjs");</script>';

	// // Google Plus
	// echo '<script src="https://apis.google.com/js/platform.js" async defer>
	// {lang: "da"}
	// </script>';

}
?>