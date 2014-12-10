'use strict';
/*global jQuery, BMBF*/
(function($, document, window, undefined) {
	var _private;

	_private = {
		$watchListItems: $('.remove-watch-list-item'),

		bind: function() {
			this.$watchListItems.click(function() {
				var movieId = $(this).closest('li').data('id'); // new code will probably be a div
				_private.removeWatchListItem(movieId);
				return false;
			});

			$(document).on('click', '.add-watch-overlay, .add-watch-overlay-fixed', function() {
				var movieId = $(this).data('id');

				if(typeof movieId === 'undefined') {
					movieId = $('#movie').data('id');
				}

				_private.addWatchListItem($(this), movieId);
				return false;
			});

			$('#change-password-form').on('valid.fndtn.abide', function () {
				_private.updatePassword($(this));
				return false;
			});

			$('#edit-profile-form').on('valid.fndtn.abide', function () {
				_private.updateProfile($(this));
				return false;
			});
		},

		addWatchListItem: function($self, movieId) {
			if(typeof movieId === 'undefined') { return; }

			if($self.hasClass('active')) {
				_private.removeWatchListItem(movieId, function() {
					$self.removeClass('active').find('span').remove();
					BMBF.utils.updateTooltip($self, 'Click to add this movie to your Watch List.');
				});
			} else {
				$.ajax({
					type: 'POST',
					url: '/api/1/services/profile/profile.json?action=addMovie',
					data: {movieId: movieId}
				})
				.done(function() {
					$self.addClass('active').append(' <span>Added to Watch List</span>');
					BMBF.utils.updateTooltip($self, 'Click to remove this movie from your Watch List.');
					BMBF.libs.tracking.track('profile', 'Added Watchlist item', movieId);
				});
			}
		},

		removeWatchListItem: function(movieId, cb) {
			$.ajax({
				type: 'POST',
				url: '/api/1/services/profile/profile.json?action=removeMovie',
				data: {movieId: movieId}
			}).complete(function() {
				BMBF.libs.tracking.track('profile', 'Removed Watchlist item', movieId);
				
				if(cb) {
					// fire call back if defined
					cb();
				} else {
					// else reload page to get updated list and pagination
					window.location.reload();
				}
			});
		},

		updatePassword: function($self) {
			_private.postUpdateToProfileService(
				$self,
				'updatePassword',
				'/api/1/services/profile/profile.json?action=changepassword',
				'<div data-alert class="alert-box success">You have successfully changed your password!<a href="#" class="close">&times;</a></div>'
			);
		},

		updateProfile: function($self) {
			_private.postUpdateToProfileService(
				$self,
				'updateProfile',
				'/api/1/services/profile/profile.json?action=update',
				'<div data-alert class="alert-box success">You have successfully updated your profile!<a href="#" class="close">&times;</a></div>'
			);
		},

		postUpdateToProfileService: function($self, eventName, url, msg) {
			$.ajax({
				type: 'POST',
				url: url,
				data: $self.serialize(),
				success: function() {
					_private.handleOnSuccess($self, msg);
					BMBF.libs.tracking.track('postUpdateToProfileService', eventName, 'success');
				},
				error: function(jqXHR) {
					BMBF.libs.foundation.handleAbideError($self, jqXHR.responseJSON);
					BMBF.libs.tracking.track('postUpdateToProfileService', eventName, 'error');
				}
			});
		},

		handleOnSuccess: function($self, msg) {
			if($self.find('.alert-box.success').length) {
				$self.find('.alert-box.success').fadeOut(function() {
					$(this).remove();
					$(msg).foundation('alert').prependTo($self).hide().fadeIn();
				});
			} else {
				$self.prepend(msg).foundation('alert');
			}
		}
	};

	BMBF.libs.profile = {
		init: function() {
			_private.bind();
		}
	};

	return BMBF.libs.profile;
})(jQuery, document, window);