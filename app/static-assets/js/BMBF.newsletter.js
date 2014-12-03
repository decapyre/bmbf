'use strict';
/*global jQuery, BMBF*/
(function($, document, window, undefined) {
	var _private;

	_private = {
		modals: {
			success: $('#successModal'),
			error: $('#errorModal')
		},

		bind: function() {
			// newsletter on HP form
			$('#newsletter-form').on('valid.fndtn.abide', function () {
				_private.postToMailchimpService(this, 'newsletter');
			});

			// movie of the week LP form
			$('#motw-form').on('valid.fndtn.abide', function () {
				_private.postToMailchimpService(this, 'movie-of-the-week');
			});
		},

		// post to the herokuapp mailchimp subscribe service and track results
		postToMailchimpService: function(self, eventName) {
			var subscription = {
				email: $(self).find('[type="email"]').val()
			};

			$.post('//bmbf-cms.herokuapp.com/subscribe/', subscription)
				.done(function() {
					_private.modals.error.foundation('reveal', 'close');
					_private.modals.success.foundation('reveal', 'open');

					BMBF.libs.tracking.track(eventName, 'subscribe', 'success');
				})
				.fail(function() {
					_private.modals.error.foundation('reveal', 'open');
					BMBF.libs.tracking.track(eventName, 'subscribe', 'input error');
				});
		}
	};

	BMBF.libs.newsletter = {
		init: function() {
			_private.bind();
		}
	};

	return BMBF.libs.newsletter;
})(jQuery, document, window);