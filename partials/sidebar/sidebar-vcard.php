<?php 
/**
 * Author vCard
 * Used in sidebar on single
 **/ 

$author_id 		= get_the_author_meta('ID');
$author_name 	= get_the_author();
$author_mail 	= get_the_author_meta('email');
$author_job 	= get_field('job', 'user_' . $author_id);
$author_avatar = get_field('avatar', 'user_' . $author_id);
$author_description = get_field('description', 'user_' . $author_id);
?>

<figure class="widget--sidebar author vcard" itemscope itemtype="http://www.data-vocabulary.org/Person/" title="<?= $author_name . ', ' . $author_job ?>">
	<img class="author__avatar" src="<?= $author_avatar['url']; ?>" alt="<?= $author_name . ', ' . $author_job; ?>">
	
	<figcaption class="author__meta">
		<header class="author__header">
			<h4 class="author__name fn" itemprop="name"><?= $author_name; ?></h4>
			<p><span itemprop="title"><?= $author_job; ?></span> &middot; <a href="mailto:<?= $author_mail; ?>"><?= $author_mail; ?></a></p>
		</header>
		<div class="author__description">
			<?= $author_description; ?>
		</div>
	</figcaption>
</figure>