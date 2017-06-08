/**
 * atriumWeb Comments
 **/ 

;( function( $, window, document, undefined ) {

	'use strict';

	/**
	 * Defaults
	 **/ 

	var defaults = {
		loadComments: true,
		loadCommentsSelector: $('#comment-load'),

		postComment: true,
		formSelector: $('#comment-submit')
	};


	/**
	 * Plugin constructor
	 **/ 

	function atwebComments( element, options ) {
		this.element = element;
		this.settings = $.extend( {}, defaults, options );

		this.init();
	}


	/**
	 * Plugin methods
	 **/ 

	$.extend( atwebComments.prototype, {


		/**
		 * Initialize plugin
		 **/ 
	
		init: function() {
			var self = this;
			
			// Setup variables
			var loadCommentsSelector = self.settings.loadCommentsSelector;
			var formSelector = self.settings.formSelector;

			$(loadCommentsSelector).on( 'click', function(e) {
				var commentPage = $(this).data('comment-page');
				e.preventDefault();

				$(this).addClass('is-loading');
				self.getComments(commentPage);
			});
		},


		/**
		 * getComments
		 * @param {string} page The current page id
		 **/ 

		getComments: function(page) {
			var self = this;
			var loadCommentsSelector = self.settings.loadCommentsSelector;
			var ajax = WP.ajaxUrl;
			var data = {
				action: 'atweb_get_comments',
				page: page
			};

			var promise = $.get(ajax, data);

			promise.then(function(data) {
				$(loadCommentsSelector).removeClass('is-loading');
				self.replaceComments(data);
			});

			promise.fail(function(data) {
				console.log('Get request failed: ' + data);
			});
		},


		/**
		 * Replace comments
		 * @param {string} data Comment markup
		 **/ 

		replaceComments: function(data) {
			var self = this;
			$('#comments').find('.comment').remove();
			$('#comments').find('.comments__list > #respond').before(data);
			$(self.settings.loadCommentsSelector).parent().remove();
		}

	});


	/**
	 * Plugin instatiation
	 **/ 

	$.fn.atwebComments = function( options ) {
		return this.each( function() {
			if ( !$.data( this, 'atwebComments' ) ) {
				$.data( this, 'atwebComments', new atwebComments( this, options ) );
			}
		});
	};

})( jQuery, window, document );