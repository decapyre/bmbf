'use strict';
/*global jQuery, BMBF, NLForm*/
(function($, document, window, undefined) {
	var _private;

	_private = {
		$form: '',

		setup: function() {
			this.$form = $('#nl-form-header');
			this.$form.show();

			if(this.$form.length) {
				new NLForm(this.$form[0]);
			}
		},

		bind: function() {
			$('.nl-form').submit(function() {
				return false;
			});

			$('.nl-form a.submit').click(function() {
				var $form = $(this).closest('.nl-form');

				// disable empty values so they don't get serialized.
				$form.find('select').each(function() {
					this.disabled = (this.value === '') ? true : false;
				});
				var query = $form.serialize();

				// re-enable disabled inputs
				$form.find('select:disabled').prop('disabled', false);

				window.location.href = (query === '') ? '/movie_list' : '/movie_list?' + query;

				return false;
			});
		}
	};

	BMBF.libs.nlform = {
		init: function() {
			_private.setup();
			_private.bind();
		}
	};

	return BMBF.libs.nlform;
})(jQuery, document, window);