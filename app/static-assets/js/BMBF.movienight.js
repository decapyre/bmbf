'use strict';
/*global jQuery, BMBF, Foundation*/
(function($, document, window, undefined) {
	var _private;
	var topButtons, printButtons;

	_private = {
		headerHeight: 420,
		cache: function() {
			topButtons = $('.scrollToTop');
			printButtons = $('.print');
		},

		bind: function() {
			_private.bindToTop();
			printButtons.click(function() {
				window.print();
				return false;
			});
		},

		bindToTop: function() {
			//Check to see if the window is top if not then display button
			var thresholdHeight = $(document).height() / 10;

			$(window).on('scroll', Foundation.utils.throttle(function() {
				if ( $(this).scrollTop() > thresholdHeight ) {
					topButtons.fadeIn();
				} else {
					topButtons.fadeOut();
				}
			}, 250));

			topButtons.click(function() {
				$('html, body').animate({scrollTop : 0},0);
				$(document).foundation('magellan-expedition','set_expedition_position');
				
				return false;
			});
		}
	};

	BMBF.libs.movienight = {
		init: function() {
			_private.cache();
			_private.bind();
		}
	};

	return BMBF.libs.movienight;
})(jQuery, document, window);