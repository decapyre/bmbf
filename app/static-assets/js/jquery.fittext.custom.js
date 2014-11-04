'use strict';

/*global jQuery */
/*!
* FitText.js 1.0
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/

(function( $ ){

	$.fn.fitText = function( kompressor, options ) {

		$(this).css({
			'display': 'inline-block',
			'clear': 'both',
			'white-space': 'pre'
		});

		var settings = $.extend({
			'minFontSize' : 1,
			'maxFontSize' : Number.POSITIVE_INFINITY
		}, options || {} );

		return this.each(function(){
			var $this = $(this);              // store the object
			var compressor = kompressor || 1; // set the compressor

			// Resizer() resizes items based on the object width divided by the compressor * 10
			var resizer = function () {
				// get proportional size of text to fit in its parent
				var size = ( parseInt( $this.css('font-size'), 10 ) / $this.width() ) * $this.parent().width();
				size = Math.max( parseFloat( settings.minFontSize ), size );
				size = Math.min( parseFloat( settings.maxFontSize ), size );
				size *= compressor;

				// allow for white-space multiline after proper font-size is set
				$this.css({
					'font-size': Math.floor(size),
					'white-space': 'inherit'
				});
			};

			// Call once to set.
			resizer();

			// Call on resize. Opera debounces their resize by default.
			$(window).resize(resizer);

		});

	};

})( jQuery );