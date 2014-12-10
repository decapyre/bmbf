'use strict';
/*global jQuery, BMBF, FB*/
(function($, document, window, undefined) {
	var _private;

	_private = {
		msgPrefix: 'Check out ',

		bind: function() {
			$(document).on('click', '.social.icons [class^="bmbf-"], .social.icons [class*="bmbf-"]', function() {
				var service = this.className.split('bmbf-')[1].trim();

				BMBF.libs.tracking.track('link', 'click', 'Social-' + service);

				switch(service) {
					case 'facebook':
						_private.shareFB();
						break;
					case 'twitter':
						_private.tweet();
						break;
					case 'google-plus':
						_private.shareGoogle();
						break;
				}

				return false;
			});
		},

		shareFB: function() {
			if (typeof FB.ui === 'function') {
				FB.ui({
					method: 'share',
					href: BMBF.config.url,
					action_type: 'og.likes',
					action_properties: JSON.stringify({
						object: window.location,
					})
				}, function() {

				});
			}
		},

		tweet: function() {
			var w = 550;
			var h = 275;

			//We trigger a new window with the Twitter dialog, in the middle of the page
			window.open('http://twitter.com/share?url=' + BMBF.config.url + '&text=' + encodeURIComponent(_private.msgPrefix + BMBF.config.title) + '&', 'twitterwindow', 'height='+h+', width='+w+', top='+($(window).height()-h)/2 +', left='+($(window).width()-w)/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
		},

		shareGoogle: function() {
			var w = 680;
			var h = 460;

			//We trigger a new window with the Google Plus dialog, in the middle of the page
			window.open('http://plus.google.com/share?url=' + BMBF.config.url + '&content=' + encodeURIComponent(_private.msgPrefix + BMBF.config.title) + '&', 'googlepluswindow', 'height='+h+', width='+w+', top='+($(window).height()-h)/2 +', left='+($(window).width()-w)/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
		}
	};

	BMBF.libs.social = {
		init: function() {
			_private.bind();
		},
	};

	return BMBF.libs.social;
})(jQuery, document, window);