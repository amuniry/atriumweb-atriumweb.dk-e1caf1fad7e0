/**
 * Navigation handler
 * @author Theis Nygaard
 **/ 

;( function( $, window, document, undefined ) {

	'use strict';

	/**
	 * Prepare global variables
	 **/ 

	var History = window.History; 
	var $window = $(window);
	var $body = $(document.body);
	var rootUrl = History.getRootUrl();
	var relativeUrl = window.location.href.replace( rootUrl, '' );


	/**
	 * Defaults
	 **/ 

	var defaults = {

		// Navigation selectors
		navTrigger: '.nav-toggle',
		nav: '.nav',
		navList: '.nav__list',
		navItem: '.nav__item',
		navLink: '.nav__link',
		navDropdown: '.nav__dropdown',
		navDropdownTrigger: '.nav__dropdown-toggle',

		// Ajax settings and selectors
		loader: '#loader',
		contentSelector: '#main',

		// Body class states
		states: {
			body: 'is-open--nav',
			dropdown: 'is-open',
			ajax: 'is-loading'
		},

		// Breakpoints
		breakpoints: {
			mobile: 992
		}
	};


	/**
	 * Plugin constructor
	 **/ 

	function atwebNavigation( element, options ) {
		this.element = element;
		this.settings = $.extend( {}, defaults, options );

		// Global states
		this.navOpen = false;
		this.dropdownOpen = false;

		// Determine history API support
		this.supportsAjax = History.enabled;
		this.isLoading = false;

		// Viewport variables
		this.vW = $(window).width();
		this.isMobile = ( this.vW < this.settings.breakpoints.mobile );

		// Initialize
		this.init();
	}


	/**
	 * Helper functions
	 **/ 

	// Check if link is internal (custom jQuery expression selector)
	$.expr[':'].internalLink = function(obj, index, meta, stack){

		// Prepare
		var $this = $(obj);
		var url = $this.attr( 'href' ) || '';
		var isInternalLink;
		
		// Check link
		isInternalLink = url.substring( 0, rootUrl.length ) === rootUrl || url.indexOf( ':' ) === -1;
		
		// Ignore or Keep
		return isInternalLink;
	}


	/**
	 * Plugin methods
	 **/ 

	$.extend( atwebNavigation.prototype, {
		
		/**
		 * Initialize plugin methods
		 **/ 

		init: function() {
			var self = this;

			// Run bindEvents method
			self.bindEvents();

			// Set loader to "has-loaded" to remove it
			$(self.settings.loader).addClass('has-loaded');
		},


		/**
		 * Bind events
		 **/ 

		bindEvents: function() {
			var self = this;
			
			/**
			 * Trigger navigation visibility
			 **/ 

			$(self.settings.navTrigger).on( 'click', function(e) {
				e.preventDefault();

				if (self.navOpen) {
					self.closeNav();
				} else {
					self.openNav();
				}
			});


			/**
			 * Dropdown visibility trigger
			 **/ 

			$(document).on( 'click', self.settings.navDropdownTrigger, function(e) {
				if ( !self.isMobile ) {
					e.preventDefault();

					if ( self.dropdownOpen ) {
						self.closeDropdown( $(this) );
					} else {
						self.openDropdown( $(this) );
					}
				}
			});


			/**
			 * Ajax internal links if supported
			 **/ 

			if ( self.supportsAjax ) {
				self.initAjax();
			}

			
			/**
			 * Close navigation when clicking outside
			 **/ 

			$(document).on( 'click', function(e) {
				var target = $(e.target);

				if ( self.navOpen && !target.is(self.settings.navTrigger) && !target.is($(self.element)) && $(self.element).find($(target)).length === 0 ) {
					self.closeNav();
				}
			});

			
			/**
			 * Update window width on resize
			 **/ 

			$(window).on( 'resize', function() {
				self.vW = $(window).width();
			});
		},


		/**
		 * Open navigation
		 **/ 

		openNav: function() {
			var self = this;
			if ( !self.navOpen ) {
				$('html, body').animate({
					scrollTop: 0
				}, 'fast', function() {
					$('body').addClass('is-open--nav');
					self.navOpen = true;
				});
			}
		},


		/**
		 * Close navigation
		 **/ 

		closeNav: function() {
			if ( this.navOpen ) {
				$('body').removeClass('is-open--nav');
				this.navOpen = false;
			}
		},


		/**
		 * Open dropdown
		 * @param {object} element The clicked element
		 **/ 

		openDropdown: function(element) {
			if ( !this.dropdownOpen ) {
				element.parent().addClass('is-open');
				element.parent().find('.nav__dropdown').attr('aria-hidden', 'false');
				this.dropdownOpen = true;
			}
		},


		/**
		 * Close dropdown
		 * @param {object} element The clicked element
		 **/ 

		closeDropdown: function(element) {
			if ( this.dropdownOpen ) {
				element.parent().removeClass('is-open');
				element.parent().find('.nav__dropdown').attr('aria-hidden', 'true');
				this.dropdownOpen = false;
			}
		},


		/**
		 * Initialize ajax handling 
		 **/ 

		initAjax: function() {
			var self = this;

			// Bind ajax on internal links
			$('body').on('click','a:internalLink:not(.no-ajax, #load-comments, .nav__dropdown-toggle, [href^="#"], [href*="wp-login"], [href*="wp-admin"])' , function(e) {

				// Prepare
				var $this = $(this);
				var url = $this.attr('href');
				var title = $this.attr('title') || null;

				// Discard ajax if CMD or Control is pressed while clicking
				if ( event.which == 2 || event.metaKey ) return true;

				// Ajaxify the shit out of it
				History.pushState( null, title, url);

				return false;
			});

			// Set active class on loader
			$(self.settings.loader).addClass('has-loaded');

			// Activate hook on state change
			self.bindStateChange();
		},


		/**
		 * Bind on window statechange
		 **/ 

		bindStateChange: function() {
			var self = this;

			$window.on('statechange', function() {

				// Prepare
				var state = History.getState();
				var url = state.url;
				relativeUrl = url.replace( rootUrl, '' );

				// Make sure the navigation closes
				self.closeNav();
				self.closeDropdown($('.is-open .nav__link'));

				// Scroll to top and activate loader
				$('html, body').animate({ 
					scrollTop: 0 
				}, 'normal', self.activateLoader());

				// Perform actual AJAX request
				self.ajaxGetPage(url);
			});
		},


		/**
		 * Perform actual ajax function and replace all content with new page content
		 * @param {string} url URL of which to load via ajax
		 **/ 

		ajaxGetPage: function(url) {
			var self = this;

			// Imitate promise
			var promise = $.get( url, function(data) {

				// If no data available, continue
				if (!data) {
					document.location.href = url;
					return false;
				}

				// Get data ready for filtering
				var $data = $(data);

				// Meta
				var $dataMeta = $data.filter('meta');
				var $dataTitle = $data.filter('title').first().text(); 

				// Scripts and stylesheets
				var $dataStyles = $data.filter('style');
				var $dataScripts = $data.filter('.document-footer').find('script');
				var $dataStylesheets = $data.filter('.document-footer').find('link');

				// Content
				var $dataNavigation = $data.find(self.settings.navList);
				var $dataContent = $data.filter(self.settings.contentSelector);
				var $dataContentHtml = $dataContent.html() || $dataBody.html();
			
				// Update methods immediately
				self.ajaxUpdateTitle( $dataTitle );

				// Set timeout used for mimicking loading
				setTimeout(function() {
					
					// Update content
					self.ajaxUpdateMeta( $dataMeta );
					self.ajaxUpdateBodyClass( data );
					self.ajaxUpdateNavigation( $dataNavigation );
					self.ajaxUpdateContent( $dataContentHtml);
					self.ajaxUpdateScripts( $dataScripts);
					self.ajaxUpdateStylesheets( $dataStylesheets);

					// Trigger state change and update analytics tracking
					$window.trigger('statechangecomplete');
					self.updateGoogleAnalytics(url);
					self.updateFacebookPixel(url);

					// Deactivate and clear loader
					self.deactivateLoader();
					setTimeout(function() {
						self.clearLoader();
					}, 3000);

				}, 1500);	
			});

			promise.done(function(data) {

			});

			promise.fail(function(data) {
				self.ajaxUpdateContent(false);
			});
		},


		/**
		 * Update meta tags in head section
		 * @param {object} meta A collection of meta objects
		 **/ 

		ajaxUpdateMeta: function(meta) {
			var self = this;
			var currentMeta = $('meta');
			var newMeta = meta;

			currentMeta.remove();
			$('head').append(newMeta);
		},


		/**
		 * Update page title
		 * @param {string} title New page title
		 **/ 

		ajaxUpdateTitle: function(title) {
			document.title = title;
		},

	
		/**
		 * Update content with new page content
		 * @param {string} content HTML markup from new page 
		 **/ 

		ajaxUpdateContent: function(content) {
			var self = this;
			$(self.settings.contentSelector).html(content);
		},


		/**
		 * Updates body class with classes from new page
		 * @param {string} data String of classes
		 **/ 

		ajaxUpdateBodyClass: function(data) {
			var matches = data.match( /<body.*class=["']([^"']*)["'].*>/ );
			var classes = matches && matches[1];

			$('body').removeClass().addClass(classes);
		},


		/**
		 * Update navigation
		 * @param {string} data Navigation markup from new page (updates active classes etc.)
		 **/ 

		ajaxUpdateNavigation: function(data) {
			var self = this;
			var s = self.settings;

			$(s.navList).html(data);
		},


		/**
		 * Update scripts in footer
		 * @param {object} Collection of script objects
		 **/ 

		ajaxUpdateScripts: function(scripts) {
			var self = this;
			var currentScripts = $('.document-footer script').get();
			// $('.document-footer script').remove();

			// Loop trough all new scripts
			$.each(scripts, function() {

				// Prepare variables
				var scriptLoaded = false;
				var $newScript = $(this).get(0);
				var newScriptSrc = $newScript.src;
				var newScriptHTML = $newScript.innerHTML;

				// Loop through existing scripts
				$.each(currentScripts, function() {
					var $oldScript = $(this).get(0);
					var oldScriptSrc = $oldScript.src;
					var oldScriptHTML = $oldScript.innerHTML;

					// Compare script src
					if ( newScriptSrc !== '' && oldScriptSrc !== '' ) {
						if ( newScriptSrc === oldScriptSrc ) {
							scriptLoaded = true;
							return;
						}
					}

					// Compare inner HTML of script
					if ( newScriptHTML !== '' && oldScriptHTML !== '' ) {
						if ( newScriptHTML === oldScriptHTML ) {
							scriptLoaded = true;
							return;
						}
					}

				});

				// If new script does not exist, create a script element
				if ( !scriptLoaded ) {
					var scriptNode = document.createElement('script');

					// Check for script src
					if ( newScriptSrc ) {
						if ( !$newScript.async ) { 
							scriptNode.async = false; 
						}
						scriptNode.src = newScriptSrc;
					}
					
					// Insert innerHMTL
					scriptNode.appendChild(document.createTextNode(newScriptHTML));

					// Append to document footer
					$('.document-footer').append(scriptNode);	
				}
			});
		},


		/**
		 * Update stylesheets in footer
		 * @param {object} Collection of link objects
		 **/ 

		ajaxUpdateStylesheets: function(stylesheets) {
			var self = this;
			var currentStyles = $('.document-footer link').get();

			// Loop trough all new scripts
			$.each(stylesheets, function() {

				// Prepare variables
				var styleLoaded = false;
				var $newstyle = $(this).get(0);
				var newstyleHref = $newstyle.href;

				// Loop through existing styles
				$.each(currentStyles, function() {
					var $oldstyle = $(this).get(0);
					var oldstyleHref = $oldstyle.href;

					// Compare style Href
					if ( newstyleHref !== '' && oldstyleHref !== '' ) {
						if ( newstyleHref === oldstyleHref ) {
							styleLoaded = true;
							return;
						}
					}

				});

				// If new style does not exist, create a style element
				if ( !styleLoaded ) {
					var styleNode = document.createElement('link');

					styleNode.rel = 'stylesheet';

					// Check for style src
					if ( newstyleHref ) {
						styleNode.href = newstyleHref;
					}
					
					// Append to document footer
					$('.document-footer').append(styleNode);	
				}
			});
		},


		/**
		 * Update Facebook Pixel to track new URL
		 * @param {string} url The visited url
		 **/ 
	
		updateGoogleAnalytics: function(url) {
			if ( typeof window.ga !== 'undefined' ) {
				window.ga('send', 'pageview', url);
			}
		},


		/**
		 * Update Facebook Pixel to track new URL
		 * @param {string} url The visited url
		 **/ 

		updateFacebookPixel: function(url) {
			if ( typeof window.fbq !== 'undefined' ) {
				window.fbq('track', 'PageView');
			}
		},


		/**
		 * Legacy methods
		 **/ 

		// Retrieve page content
		getPageLegacy: function(location) {
			var self = this;

			self.closeNav();
			$('html, body').animate({ 
				scrollTop: 0 
			}, 'normal', self.activateLoader());

			// Regular GET request
			var promise = $.get( location, function(data) {
				var content = $(data).filter(self.settings.ajaxDynamic);
				$(self.settings.loader).onCSSTransitionEnd( function() {
					self.updateContent(content);
				});
			});

			promise.done( function(data) {
				document.title = $(data).filter(document.title).text();
				setTimeout( function() {
					self.deactivateLoader();
				}, 1500);
			});

			promise.fail( function(data) {

			});
		},


		/**
		 * Update content with new content
		 * @param {string} content Content HTML
		 **/ 

		updateContent: function(content) {
			$(this.settings.ajaxDynamic).html(content);
		},


		/**
		 * Loader methods
		 **/ 

		// Activate loader
		activateLoader: function() {
			if ( !this.isLoading ) {
				this.isLoading = true;
				$('body').addClass(this.settings.states.ajax);
				$(this.settings.loader).removeClass('has-loaded').addClass('is-loading');
			}
		},


		// Deactivate loader
		deactivateLoader: function() {
			if ( this.isLoading ) {
				this.isLoading = false;
				$('body').removeClass(this.settings.states.ajax);
				$(this.settings.loader).addClass('has-loaded');
			}
		},

		// Clear loader
		clearLoader: function() {
			$(this.settings.loader).removeClass('is-loading');
		},
	});


	/**
	 * Plugin instatiation
	 **/ 

	$.fn.atwebNavigation = function( options ) {
		return this.each( function() {
			if ( !$.data( this, 'atwebNavigation' ) ) {
				$.data( this, 'atwebNavigation', new atwebNavigation( this, options ) );
			}
		});
	};

})( jQuery, window, document );