'use strict';
/*global jQuery, BMBF*/
(function($, document, window, undefined) {
	var _private;

	_private = {
		$form: '',

		cache: function() {
			this.$form = $('#search-form');
		},

		bind: function() {
			this.$form.submit(function() {
				var query = $('#search').val();

				if(query) {
					BMBF.libs.tracking.track('search', 'header search', query);
					window.location.href = BMBF.config.host + '/search?q=' + encodeURIComponent(query);
				}
				
				return false;
			});
		}
	};

	BMBF.libs.search = {
		init: function() {
			_private.cache();
			_private.bind();
		}
	};

	return BMBF.libs.search;
})(jQuery, document, window);