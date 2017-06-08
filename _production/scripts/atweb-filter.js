/**
 * atriumWeb Filter
 **/

;( function( $, window, document, undefined ) {

	'use strict';

	/**
	 * Plugin defaults
	 **/

	var defaults = {

		// Form
		form: '#filter-form',
		input: '.filter__input',
		selectList: '#filter-select-list',
		selectCurrent: '#filter-select-current',

		// Grid
		masonry: false,
		fixItUp: false,
		gridContainer: '#filter-grid',
		gridHidden: '#filter-hidden',
		gridItems: '.grid__item',
		columns: 6,
		breakAt: {},

		// Lazy loading
		lazyLoad: false,
		lazyLoadSelector: '.is-lazy',
		lazyLoadSucces: 'has-loaded'
	};


	/**
	 * Plugin constructor
	 **/

	function atwebFilter( element, options ) {
		this.element = element;
		this.settings = $.extend( true, {}, defaults, options );
		this.lazy = false;
		this.init();
	}


	/**
	 * Plugin methods
	 **/

	$.extend( atwebFilter.prototype, {

		/**
		 * Initialize
		 **/

		init: function() {
			this.bindEvents();
		},


		/**
		 * bindEvents
		 **/

		bindEvents: function() {
			var self = this;
			var s = self.settings;

			/**
			 * Initialize macy if supported and available
			 **/

			if ( s.masonry ) {
				if ( typeof Macy !== 'undefined' ) {
					self.initGrid();
				} else {
					console.log('Macy.js is required to enable masonry.');
				}
			}


			/**
			 * Init lazy loading
			 **/

			if ( s.lazyLoad ) {
				self.initLazyLoad();
			}


			/**
			 * Perform filtering on form input change
			 **/

			$(s.input).on('change', function() {
				var values = $(s.form).serializeArray();

				if ( values.length ) {
					self.filterItems(values);
					self.repackItems();

					if ( s.lazyLoad ) {
						self.revalidateLazyLoad();
					}
				} else {
					self.resetItems();
				}

			});
		},


		/**
		 * Initialize masonry grid
		 **/

		initGrid: function() {
			var s = this.settings;

			setTimeout(function() {
				Macy.init({
					container: s.gridContainer,
					waitForImages: true,
					columns: s.columns,
					breakAt: s.breakAt
				});
			}, 100);
		},


		/**
		 * Repack grid items
		 * @todo Create bLazy revalidation
		 **/

		repackItems: function() {
			var s = this.settings;

			if ( s.masonry ) {
				Macy.recalculate();
			}
		},


		/**
		 * Hide grid items
		 **/

		hideItems: function() {
			var s = this.settings;
			$(s.gridItems).addClass('is-hidden');
			if(s.fixItUp){
				$(s.gridItems).remove();
				Macy.recalculate();
			}
		},


		/**
		 * Reset grid
		 * @todo Setup listener on transition end
		 **/

		resetItems: function() {
			var self = this;
			var s = self.settings;

			$(s.gridItems).removeClass('is-hidden');
			//Macy.recalculate();
		},


		/**
		 * Lazy load images
		 **/

		initLazyLoad: function() {
			var self = this;
			var s = self.settings;

			setTimeout( function() {
				self.lazy = new Blazy({
					selector: s.lazyLoadSelector,
					offset: 100,
					successClass: s.lazyLoadSucces,
					// success: function(ele){
					// 	console.log(ele + ' has loaded');
					// },
					// error: function(ele, msg){
					// 	if(msg === 'missing'){
					// 		console.log('Data-src is missing');
					// 	}
					// 	else if(msg === 'invalid'){
					// 		console.log('Data-src is invalid');
					// 	}
					// }
				});
			}, 300);
		},


		/**
		 * Revalidate lazy loading
		 **/

		revalidateLazyLoad: function() {
			var self = this;

			setTimeout( function() {
				self.lazy.revalidate();
			}, 250);

			if ( self.settings.masonry ) {
				Macy.recalculate();
			}
		},

		sortData: function(wrapper, item){
			var self = this;

			wrapper.find(item).sort(function (a, b) {
			    return +b.getAttribute('data-timestamp') - +a.getAttribute('data-timestamp');
			})
			.appendTo( wrapper );

		},
		/**
		 * Filter items
		 * @param {object} input A collection of form input objects
		 **/

		filterItems: function(input) {
			var self = this;
			var s = self.settings;
			var $items = $(s.gridItems);
			var $hidden = $(s.hiddenContainer);
			var $grid = $(s.gridContainer);
			var fixIt = s.fixItUp;

			$items.each(function() {
				var inFilter = true;
				var itemFilters = $(this).data('filter').split(' ');

				// Loop through input objects
				for ( var i = input.length - 1; i >= 0; i-- ) {
					var value = input[i].value;

					// Make sure the value exists in itemFilters array
					if ( $.inArray( value, itemFilters ) === -1 ) {
						inFilter = false;
						break;
					}
				}

				if ( inFilter ) {
					$(this).removeClass('is-hidden');
					if (fixIt) $(this).appendTo($grid);


				} else {
					$(this).addClass('is-hidden');
					if (fixIt) $(this).appendTo($hidden);
				}
			});
			if (fixIt) {
				self.sortData($grid ,$items);
				Macy.recalculate();
			}
		},
	});


	/**
	 * Plugin instatiation
	 **/

	$.fn.atwebFilter = function( options ) {
		return this.each( function() {
			if ( !$.data( this, 'atwebFilter' ) ) {
				$.data( this, 'atwebFilter', new atwebFilter( this, options ) );
			}
		});
	};

})( jQuery, window, document );
