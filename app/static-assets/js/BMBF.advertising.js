'use strict';
/*global jQuery, BMBF*/
(function($, document, window, undefined) {
	var _private;

	_private = {
		list: [
			{
				'id': 'movie-of-the-week',
				'title':'DISCOVER A GREAT MOVIE THIS WEEK',
				'href':'/lps/movie-of-the-week',
				'src':'/static-assets/images/lps/MOW_BannerAd.jpg'
			},
			{
				'id': 'movie-nights',
				'title':'INTRODUCING: BEST MOVIE NIGHTS BY FARR',
				'href':'/movie-nights',
				'href_guest':'/lps/movie-nights',
				'src':'/static-assets/images/lps/movienights_ad_banner.jpg'
			}
		],

		getRandomAdObj: function() {
			return _private.list[Math.floor(Math.random()*_private.list.length)];
		},

		setBannerAd: function() {
			var anchor = $('.ad_rotator a');
			var img = anchor.find('img');
			var title = anchor.find('h2');
			var ad = _private.getRandomAdObj();

			if(BMBF.user.isLoggedIn || typeof ad.href_guest === 'undefined') {
				anchor.attr('href', ad.href);
			} else {
				anchor.attr('href', ad.href_guest);
			}
			
			img.attr('src', ad.src);
			title.text(ad.title);

			// bind click event for tracking
			anchor.click(function() {
				BMBF.libs.tracking.track('advertising', 'click', 'banner ad - ' + ad.id);
			});
		}
	};

	BMBF.libs.advertising = {
		init: function() {
			_private.setBannerAd();
		}
	};

	return BMBF.libs.advertising;
})(jQuery, document, window);