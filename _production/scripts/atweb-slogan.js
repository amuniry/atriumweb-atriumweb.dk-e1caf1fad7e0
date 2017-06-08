/**
 * atriumWeb Slogan
 **/ 

;( function( $, window, document, undefined ) {

	'use strict';

	/**
	 * Plugin defaults
	 **/ 

	var defaults = {
		words: ['borg', 'bowlingborg'],
		delay: 3000,
		classes: {
			typer: 'typer',
			placeholder: 'placeholder',
			inactive: 'is-inactive',
			active: 'is-active',
		}
	};


	/**
	 * Plugin constructor
	 **/ 

	function atwebSlogan( element, options ) {
		this.element = element;
		this.settings = $.extend( true, {}, defaults, options );

		this.interval = null;
		this.init();
	}


	/**
	 * Helper functions
	 **/ 

	/**
	 * Get selector from string
	 * @param {string} str
	 * @return {mixed} false|jQuery Object
	 **/ 

	function getSelector(str) {
		if ( typeof str !== 'string' ) {
			console.log('A string must be passed to this function: ' + this);
			return false; 
		} else {
			return $('.' + str);
		}
	}


	/**
	 * Plugin methods
	 **/ 

	$.extend( atwebSlogan.prototype, {

		/**
		 * Initialize
		 **/ 

		init: function() {
			var $defaultWord = getSelector(this.settings.classes.typer);

			$defaultWord.remove();
			this.appendWords(this.settings.words);
		},


		/**
		 * appendWords
		 * @param {object} wordList Array of words
		 **/ 

		appendWords: function(wordList) {
			var $sloganPlaceholder = getSelector(this.settings.classes.placeholder);

			// Loop through wordlist
			for (var i = 0; i < wordList.length ; i++) {
				$sloganPlaceholder.append( '<span class="' + this.settings.classes.typer + '">' + wordList[i] + '</span>' );
			}

			// Add active class (sets up appropriate styling for words)
			$(this.element).addClass('slogan--loaded');
			this.startAnimation(wordList.length);
		},
		 

		/**
		 * Start animation
		 * @param {integer} listLength Length of wordList array of objects
		 **/ 

		startAnimation: function(listLength) {
			var self = this;
			var i = 1;
			var activeClass = self.settings.classes.active;
			var inactiveClass = self.settings.classes.inactive;
			var $word = getSelector(self.settings.classes.typer);
			$word.eq(0).addClass(self.settings.classes.active);

			self.interval = setInterval( function() {

				$word.eq(i).addClass(activeClass);

				if ( i !== 0 ) {
					$word.eq(i - 1).removeClass(activeClass).addClass(inactiveClass);
				}

				i++;

				if ( i === listLength ) {
					clearInterval(self.interval);
				}
			}, self.settings.delay);
		},


		/**
		 * End the animation
		 **/ 

		endAnimation: function() {
			clearInterval(this.interval);
		}
	});


	/**
	 * Plugin instatiation
	 **/ 

	$.fn.atwebSlogan = function( options ) {
		return this.each( function() {
			if ( !$.data( this, 'atwebSlogan' ) ) {
				$.data( this, 'atwebSlogan', new atwebSlogan( this, options ) );
			}
		});
	};

})( jQuery, window, document );