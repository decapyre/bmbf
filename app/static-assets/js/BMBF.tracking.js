'use strict';
/*global jQuery, BMBF, ga*/
(function($, document, window, undefined) {
	var _private;

	_private = {
	};

	BMBF.libs.tracking = {
		init: function() {
		},

		// GA events | category, action, label, value
		track: function(category, action, label, value) {
			// call GA tracking if available
			if (typeof ga === 'function') {
				return ga('send', 'event', category, action, label, (value)?value:null );
			}
		}
	};

	return BMBF.libs.tracking;
})(jQuery, document, window);
