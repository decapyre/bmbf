'use strict';
/*global jQuery, Modernizr*/
var BMBF = window.BMBF || (function($, document, window, undefined) {
	var app, _private;

	/**
	* The _private variable encapsulate all PRIVATE functions
	* and properties.
	*/
	_private = {
		config: {
			host: '//'+window.location.host,
			url: window.location.href,
			title: $(document).find('title').text(),
		},

		bind: function() {
			// FitText after fonts have loaded.
			$(window).load(function(){
				$('#header-slider .slide h2').fitText(1, {minFontSize: '40px', maxFontSize: '80px'});
			});

			$(function() {
				// on document ready
				_private.boot();
			});
		},

		boot: function() {
			// init all libraries
			for (var property in BMBF.libs) {
				if (BMBF.libs.hasOwnProperty(property)) {
					BMBF.libs[property].init();
				}
			}

			this.polyfills();
		},

		polyfills: function() {
			if(!Modernizr.input.placeholder) {
				$('input, textarea').placeholder();
			}
		}
	};

	/**
	* The app variable encapsulate all PUBLIC functions
	* and properties.
	*/
	app = {
		init: function() {
			_private.bind();
		},

		inherit: function (scope, methods) {
			var methods_arr = methods.split(' '),
			i = methods_arr.length;

			while (i--) {
				if (this.utils.hasOwnProperty(methods_arr[i])) {
					scope[methods_arr[i]] = this.utils[methods_arr[i]];
				}
			}
		},

		config: _private.config,

		utils: {},

		libs: {},

		user: {
			isLoggedIn: false, // set from freemarker

			campaignRedirects: {
				'movie-nights': _private.config.host + '/movie-nights'
			},

			getSignupCampaignId: function() {
				return $.cookie('BMBF.user.signupCampaignId') || null;
			},

			setSignupCampaignId: function(value) {
				$.cookie('BMBF.user.signupCampaignId', value, {path: '/' });
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