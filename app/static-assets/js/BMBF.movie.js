'use strict';
/*global jQuery, BMBF*/
(function($, document, window, undefined) {
	var _private;
	var movie = $('section#movie');
	var gwiid = movie.data('gwi-id');
	var gowatchit = $('.gowatchit');

	_private = {
		bind: function() {
		},

		setupGoWatchIt: function() {
			if(!movie) {
				return;
			}

			if(movie && gwiid) {
				//var gwiUrl = "https://api.gowatchit.com/api/v2/movies/"+gwiid+"/availabilities?api_key=" + "c053d5c31fcc562e8106f35d&callback=?"
				var gwiUrl = '//bmbf-cms.herokuapp.com/gwi?gwiid=' + gwiid;
				//var items = {};
				var markup = '';

				$.get(gwiUrl, function(data) {
					if(typeof data.movie !== 'undefined' || data.movie !== null && data.movie.available) {
						// if movie is available
						if(data.movie.onlines !== null) {
							$.each(data.movie.onlines, function(key, value) {
								var serviceName = value.name.toLowerCase().replace(/\s+/g, '');
								markup += '<li><a href="'+value.watch_now+'" title="'+value.name+'"><i class="bmbf bmbf-5x bmbf-gw-'+serviceName+'"></i></a></li>';
								//markup += '<li><a href="'+value.watch_now+'" title="'+value.name+'"><img src="'+value.logos.dark+'" alt="Watch this movie on'+value.name+'"></a></li>';
							});
						} else {
							// no online versions available
							_private.goWatchItNotFound();
						}
						gowatchit.html(markup);
					} else {
						// no movie available at all
						_private.goWatchItNotFound();
					}
					//initGowatchitCarousel(items);
				}).fail(function(){
					_private.goWatchItNotFound();
				});
			} else {
				_private.goWatchItNotFound();
			}
		},

		goWatchItNotFound: function() {
			//
			console.log('goWatchItNotFound');
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