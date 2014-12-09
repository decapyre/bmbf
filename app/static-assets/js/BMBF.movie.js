'use strict';
/*global jQuery, BMBF*/
(function($, document, window, undefined) {
	var _private;
	var movie = $('section#movie');
	var gwiid = movie.data('gwi-id');
	var gowatchit = $('.gowatchit');
	var movieTitle = $('.title').text();//$('meta[property="og\\:title"]').attr('content');
	var markup = '';
	var amazonId = 'bemobyfa09-20';

	_private = {
		bind: function() {
			$(document).on('click', '.gw-service', function() {
				var service = $(this).data('service');
				BMBF.libs.tracking.track('link', 'click', 'GoWatchIt-' + service);
				return false;
			});
		},

		setupGoWatchIt: function() {
			if(!movie) {
				// not on a movie page hack
				return;
			}

			if(movie && gwiid) {
				//var gwiUrl = "https://api.gowatchit.com/api/v2/movies/"+gwiid+"/availabilities?api_key=" + "c053d5c31fcc562e8106f35d&callback=?"
				var gwiUrl = '//bmbf-cms.herokuapp.com/gwi?gwiid=' + gwiid;
				//var items = {};
				$.get(gwiUrl, function(data) {
					if(typeof data.movie !== 'undefined' || data.movie !== null && data.movie.available) {
						// if movie is available
						if(data.movie.onlines !== null) {
							$.each(data.movie.onlines, function(key, value) {
								var serviceName = value.name.toLowerCase().replace(/\s+/g, '');
								markup += '<li><a href="'+value.watch_now+'" title="'+value.name+'" class="gw-service" data-service="'+serviceName+'"><i class="bmbf bmbf-gw-'+serviceName+'"></i></a></li>';
							});

							// render list
							gowatchit.html(markup);
						} else {
							// no online versions available
							_private.goWatchItNotFound();
						}
					} else {
						// no movie available at all
						_private.goWatchItNotFound();
					}
				}).fail(function() {
					// service error
					_private.goWatchItNotFound();
				});
			} else {
				// no gwiid found
				_private.goWatchItNotFound();
			}
		},

		goWatchItNotFound: function() {
			BMBF.libs.tracking.track('link', 'click', 'NO GoWatchIt- ' + window.location);

			// at the very least provide a link to an Amazon search result if nothing is found(yes even on amazon from GW)
			var render = (markup === '') ? true : false;
			var amazonURI = 'http://www.amazon.com/gp/search?ie=UTF8&camp=1789&creative=9325&index=dvd&keywords='+encodeURIComponent(movieTitle)+'&linkCode=ur2&tag='+amazonId;//+'&linkId=OPSO2DBSGMFPHDYH';
			markup += '<li><a href="'+amazonURI+'" title="'+movieTitle+'"><i class="bmbf bmbf-6x bmbf-gw-amazon"></i></a></li>';

			if(render) {
				gowatchit.html(markup);
			}
		}
	};

	BMBF.libs.movie = {
		init: function() {
			_private.bind();
			_private.setupGoWatchIt();
		}
	};

	return BMBF.libs.movie;
})(jQuery, document, window);