/**
 * atriumWeb Social share buttons
 **/ 

;( function( $, window, document, undefined ) {

	'use strict';

	/**
	 * Defaults
	 **/ 

	var defaults = {
		appendScriptsTo: '.document-scripts',
		services: {
			facebook: true,
			twitter: true,
			linkedin: true,
			googleplus: true
		}
	};


	/**
	 * Plugin constructor
	 **/ 

	function atwebSocial( element, options ) {
		this.element = element;
		this.settings = $.extend( true, {}, defaults, options );

		this.init();
	}


	/**
	 * Plugin methods
	 **/ 

	$.extend( atwebSocial.prototype, {

		/**
		 * Init method
		 **/ 
	
		init: function() {
			var self = this;
			var services = self.settings.services;
			
			if ( services.facebook ) {
				self.initFacebook();
			}

			if ( services.twitter ) {
				self.initTwitter();
			}

			if ( services.linkedin ) {
				self.initLinkedIn();
			}

			if ( services.googleplus ) {
				self.initGooglePlus();
			}

		},


		/**
		 * Facebook
		 **/ 

		initFacebook: function() {

			if ( !$('#fb_root').length ) {
				$('body').append('<div id="fb-root"></div>');
			}

			if ( typeof FB !== 'undefined' ) {
				FB.init({
					appId: '855130884595916',
					version: 'v2.5',
					xfbml: 1
				});
			} else {
				$.getScript('//connect.facebook.net/da_DK/sdk.js', function() {
					FB.init({
						appId: '855130884595916',
						version: 'v2.5',
						xfbml: 1
					});
				});
			}
		},


		/**
		 * Twitter
		 **/ 

		initTwitter: function() {

			// Instantiate Twitter if scripts is available
			if (typeof twttr !== 'undefined'){
				twttr.widgets.load();
			} else {
				$.getScript('//platform.twitter.com/widgets.js');
			}
		},


		/**
		 * LinkedIn
		 **/ 

		initLinkedIn: function() {
			var self = this;

			// Instantiate LinkedIn if it is available
			if ( typeof IN !== 'undefined'  ) {
				IN.parse();
			} else {
				$.getScript('//platform.linkedin.com/in.js', function() {
					IN.init({
						lang: 'da_DK'
					});
				});
			}
		},


		/**
		 * Google+
		 **/ 

		initGooglePlus: function() {
			var self = this;

			// Instantiate Google API if it is available
			if ( typeof gapi != 'undefined') {
				$(".g-plus").each(function () {
					gapi.plusone.render($(this).get(0));
				});
			} else {
				$.getScript('https://apis.google.com/js/platform.js', function() {
				});
			}
		}

	});


	/**
	 * Plugin instatiation
	 **/ 

	$.fn.atwebSocial = function( options ) {
		return this.each( function() {
			if ( !$.data( this, 'atwebSocial' ) ) {
				$.data( this, 'atwebSocial', new atwebSocial( this, options ) );
			}
		});
	};

})( jQuery, window, document );