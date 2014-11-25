'use strict';
/*global jQuery*/
var BMBF = window.BMBF || (function($, document, window, undefined) {
	var app, _private;

	/**
	* The _private variable encapsulate all PRIVATE functions
	* and properties.
	*/
	_private = {
		config: {
			host: '//'+window.location.host
		},
		cache: function() {
			// cache things like jquery selectors
		},
		bind: function() {
			// bind events
		}
	};

	/**
	* The app variable encapsulate all PUBLIC functions
	* and properties.
	*/
	app = {
		init: function() {
			_private.cache();
			_private.bind();
		},

		libs: {},

		user: {
			campaignRedirects: {
				'movie-nights': _private.config.host + '/movie-nights'
			},
			getSignupCampaignId: function() {
				return $.cookie('BMBF.user.signupCampaignId') || null;
			},

			setSignupCampaignId: function(value) {
				$.cookie('BMBF.user.signupCampaignId', value);
				return value;
			},

			clearSignupCampaignId: function() {
				return $.removeCookie('BMBF.user.signupCampaignId');
			}
		}
	};

	return app;
})(jQuery, document, window);

(function() {
	BMBF.init();
})();