'use strict';
/*global jQuery, BMBF, ga*/
(function($, document, window, undefined) {
	var _private;

	_private = {
	};

	BMBF.libs.tracking = {
		init: function() {
		},

		// GA events | category, action, label, value(int)
		track: function(category, action, label, value) {
			// call GA tracking if available
			if (typeof ga === 'function') {
				return ga('send', 'event', category, action, label, (value)?value:null );
			}
		},

		trackConversion: function(id, label) {
			if (typeof window.google_trackConversion === 'function') {
				window.google_trackConversion({
					google_conversion_id: id,
					google_conversion_language: 'en',
					google_conversion_format: '3',
					google_conversion_color: 'ffffff',
					google_conversion_label: label,
					google_remarketing_only: false
				});
			}
		}
	};

	return BMBF.libs.tracking;
})(jQuery, document, window);
