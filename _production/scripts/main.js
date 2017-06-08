function atwebApp() {

	/**
	 * Globals
	 **/
	var lazy;


	/**
	 * Navigation
	 **/

	var $nav = $('.nav');
	$nav.atwebNavigation();

 
	/**
	 * Initialize slogan
	 **/
	var $slogan = $('.slogan');
	var wordList;

	if ( $slogan.length ) {
		wordList = $slogan.data('words').split(', ');

		$('.slogan').atwebSlogan({
			words: wordList,
			classes: {
				typer: 'slogan__word--typer',
				placeholder: 'slogan__word--placeholder'
			}
		});
	}


	/**
	 * Comment plugin
	 **/

	$('#comments').atwebComments({
		loadComments: true,
		loadCommentsSelector: $('#load-comments'),

		postComment: true,
		formSelector: $('#commentform')
	});



	/**
	 * Social share buttons
	 **/

	$('#share').atwebSocial({
		services: {
			facebook: true,
			twitter: true,
			linkedin: true,
			googleplus: true
		}
	});



	/**
	 * Scroll to internal links
	 **/

	$('a[href^="#"]:not(.nav__dropdown-toggle)').on('click', function(e) {
		e.preventDefault();

		var target = this.hash;
		var $target = $(target);

		$('html, body').stop().animate({
			'scrollTop': $target.offset().top
		}, 900, 'swing');

	});


	/**
	 * Cases filter
	 **/

	// Initialize filter plugin
	$('#cases-filter').atwebFilter({
		form: '#cases-filter',
		input: '.filter__input',
		gridItems: '.cases__item',
		lazyLoad: true,
		lazyLoadSelector: '.cases__image',
		lazyLoadSucces: 'has-loaded'
	});


	/**
	 * Custom select box
	 **/

	(function(document) {

		/**
		 * Selectors and states
		 **/

		// Selectors
		var $select = $('.js-cases-filter-select');
		var $trigger = $('.js-cases-filter-trigger');
		var $current = $('.js-cases-filter-text');
		var $list = $('.js-cases-filter-list')
		var $input = $('.js-cases-filter-input');

		// State
		var isOpen = false;


		/**
		 * Visibility functions
		 **/

		// Open select dropdown
		function openDropdown() {
			$trigger.addClass('is-open');
			$list.addClass('is-open');
			isOpen = true;
		}

		// Close select dropdown
		function closeDropdown() {
			$trigger.removeClass('is-open');
			$list.removeClass('is-open');
			isOpen = false;
		}


		/**
		 * Set up event listeners
		 **/

		// Click on trigger
		$trigger.on('click', function(e) {
			if ( isOpen ) {
				closeDropdown();
			} else {
				openDropdown();
			}
		});

		// Click outside dropdown
		$(document).on('click', function(e) {
			var target = $(e.target);

			if ( isOpen && !target.is($select) && $select.find($(target)).length === 0 ) {
				closeDropdown();
			}
		});

		// Replace trigger text with checked input label
		$input.on('change', function() {
			var label = $(this).siblings('.filter__label').text();
			$current.text(label);
			closeDropdown();
		});

	})(document);



	/**
	 * Blog masonry
	 **/

	// Initialize filter plugin
	$('#blog-overview').atwebFilter({
		form: '#blog-filter',

		masonry: true,
		fixItUp: true,
		gridContainer: '#blog-overview',
		hiddenContainer: '#blog-hidden',
		gridItems: '.blog__item',
		columns: 5,
		breakAt: {
			1600: 4,
			1200: 3,
			992: 2,
			600: 1
		},

		lazyLoad: false,
		lazyLoadSelector: '.blog__image-lazy'
	});



	/**
	 * Lazy loading via bLazy
	 **/

	(function() {
		setTimeout(function() {
			lazy = new Blazy({
				selector: '.is-lazy',
				offset: 100,
				successClass: 'has-loaded'
			});
		}, 300);

	})();

	$(window).on('statechangecomplete', function() {
		if ( lazy !== 'undefined' ) {
			setTimeout( function() {
				lazy.revalidate();
			}, 300);
		}
	});


	/**
	 * Gravity Forms
	 **/

	$(document).trigger('gform_post_render', [1, 1]);

}

jQuery(document).ready(function($){
	atwebApp();

	// console.info('%cSå du er interesseret i koden, hva\'? Måske har vi et job til dig. :-) Se mere her: http://atriumweb.dk/om-os/jobs', 'color: grey;');

	$(window).on('statechangecomplete', function() {
		atwebApp();
	});
});
