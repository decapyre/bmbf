'use strict';
/*global jQuery, BMBF, Foundation*/
(function($, document, window, undefined) {
	var _private;

	_private = {
		$regBtn: $('#reg-btn-dropdown'),
		$regDropdown: $('#reg-dropdown'),
		$regDropdownForm: $('#reg-dropdown form'),
		$reg: $('#registration'),
		$topBar: $('.top-bar'),
		$close: $('#registration .close'),
		$openReg: $('button.open-registration'),
		$confirmSlide: $('#reg-dropdown .confirm'),

		setup: function() {
			// check hashes on init
			this.checkLocationHash();
		},

		bind: function() {
			// listen to hashchange events universally 
			$(window).on('hashchange', function() {
				_private.checkLocationHash();
			});

			_private.$regBtn.on('click.fndtn.dropdown', function () {
				Foundation.libs.topbar.toggle(_private.$topBar);
			});

			// fix for dynamic height change on the 'orbit' container, yesh a ton of listeners :/
			this.$regDropdownForm
				.on('valid.fndtn.abide invalid.fndtn.abide', function () {
					_private.$regDropdown.foundation('orbit', 'reflow');
				})
				.find('input, textarea, select')
					.on('keydown.fndtn.abide change.fndtn.abide blur.fndtn.abide', function() {
						setTimeout(function(){
							_private.$regDropdown.foundation('orbit', 'reflow');
						}, 0);
					});

			// reset error messages when dropdown is closed
			this.$regDropdown.on('closed.fndtn.dropdown', Foundation.utils.debounce(function() {
				var abideForms = $(this).find('form');

				$(abideForms).children('div').removeClass('error');
				$(abideForms).each(function(){
					this.reset();
				});
				
				// reset server errors
				$('.server-message small').text('');
				$('.server-message').removeClass('success').removeClass('error').hide();

				// reflow
				_private.$regDropdown.foundation('orbit', 'reflow');

				// go back to the (login) slide
				$.fx.off = true;
				_private.$reg.trigger('goto.fndtn.orbit', ['login']);
				$.fx.off = false;
			}, 300, true));

			// close registration dropdown and go back to login
			this.$close.click(function() {
				_private.$reg.trigger('goto.fndtn.orbit', ['login']);
				Foundation.libs.dropdown.close(_private.$regDropdown);
			});

			// open registration dropdown to any slide
			this.$openReg.click(function() {
				var $target = $(this);
				var slide = $target.data('slide');
				_private.openRegistrationDropdownToSlide(slide);

				// if this signup button contains proper data-track attributes, track it
				BMBF.libs.tracking.trackClick($target);

				return false;
			});
		},


		/*
		*
		* Bind Services
		*
		*/

		bindServices: function() {
			$('.logout').click(function() {
				_private.postToLogoutService();
				return false;
			});

			$('#facebook-connect-btn').click(function() {
				_private.facebookLogin();
				return false;
			});

			$('.login-form').on('valid.fndtn.abide', function () {
				_private.postToLoginService($(this));
				return false;
			});

			$('.signup-form').on('valid.fndtn.abide', function () {
				_private.postToSignupService($(this));
				return false;
			});

			$('.forgot-form').on('valid.fndtn.abide', function () {
				_private.postToForgotService($(this));
				return false;
			});

			$('.reset-form').on('valid.fndtn.abide', function () {
				_private.postToResetService($(this));
				return false;
			});
		},


		/*
		*
		* Methods
		*
		*/

		checkLocationHash: function() {
			if(location.hash.indexOf('#slide=') !== -1) {
				_private.openRegistrationDropdownToSlide(location.hash.substr(7));
			}
		},

		// Open the dropdown and slider on the supplied hash, default to login (#slide=login, #slide=signup, #slide=reset, #slide=forgot)
		openRegistrationDropdownToSlide: function(slide) {

			console.log('openRegistrationDropdownToSlide', slide);
			// turn animations off
			$.fx.off = true;
			// go to hashed slide
			_private.$reg.trigger('goto.fndtn.orbit', [slide]);
			$.fx.off = false;

			// hide menu if its open
			if(_private.$topBar.hasClass('expanded')) {
				Foundation.libs.topbar.toggle(_private.$topBar);
			}
			
			// Force open dropdown (dropdown content, dropdown trigger (button))
			Foundation.libs.dropdown.open(_private.$regDropdown, _private.$regBtn);

			// go to top on mobile/tablet
			if(! (matchMedia(Foundation.media_queries.large).matches ||
				matchMedia(Foundation.media_queries.xlarge).matches ||
				matchMedia(Foundation.media_queries.xxlarge).matches)) {

				// HACK: fix for Safari on iOS (window.scrollTo(0,0) seems to auto hide the dropdown)
				$('body, html')
					.animate({scrollTop: 0}, 500);
			}

			_private.$regDropdown.foundation('orbit', 'reflow');
		},

		facebookLogin: function() {
			var top = (screen.height / 2) - (300/ 2);
			var left = (screen.width / 2) - (500 / 2);
			var fbDialog = window.open('/connect/facebook_dialog', 'fbDialog', 'width=500, height=300, top=' + top + ', left=' + left);
			var interval = setInterval(function() {
				if (fbDialog === null || fbDialog.closed) {
					clearInterval(interval);
					location.reload();
				}
			}, 1000);
		},

		postToLogoutService: function() {
			$.ajax({
				type: 'GET',
				url: '/crafter-security-rest-logout',
				cache: false,
				complete: function() {
					// clear any old campaign cookies
					BMBF.user.clearSignupCampaignId();

					// track
					BMBF.libs.tracking.track('registration', 'logout', 'success');

					// redirect
					window.location.href = '/';
				}
			});
		},

		postToLoginService: function($self) {
			$.ajax({
				type: 'POST',
				url: '/crafter-security-rest-login',
				data: $self.serialize(),
                cache:false,
				success: function() {
					if($self.find('input.remember').get(0).checked) {
						var ticket = $.cookie('ticket');
						var profileLastUpdate = $.cookie('profile-last-modified');

						$.cookie('ticket', ticket, {expires: 15});
						$.cookie('profile-last-modified', profileLastUpdate, {expires: 15});
					}

					// if getSignupCampaignId is set redirect to it's page
					try {
						var campaignId = BMBF.user.getSignupCampaignId();
						var redirectURI = BMBF.user.campaignRedirects[campaignId];
						if(typeof redirectURI !== 'undefined') {
							BMBF.user.clearSignupCampaignId();
							
							// log login event for getSignupCampaignId
							BMBF.libs.tracking.track('registration', 'login', 'Campaign Login - ' + campaignId);
							window.location.href = redirectURI;
						} else {
                            debugger;
							BMBF.libs.tracking.track('registration', 'login', 'Normal Login');
                            var goTo=$self.find('input.redirectTo').val();
                            console.log("go to Is "+goTo);
                            if(goTo===undefined){
                                console.log("Going To Reload");
                                window.location.reload();
                            }else{
                                console.log("Going To "+goTo);
                                window.location.href = goTo;
                            }
						}
					}
					catch(e) {
						window.location.href = '/';
					}
				},
				error: function(jqXHR) {
					BMBF.libs.foundation.handleAbideError($self, jqXHR.responseJSON);
					BMBF.libs.tracking.track('registration', 'login', 'error');
				}
			});
		},

		postToSignupService: function($self) {
			var email = $self.find('input[type="email"]').val();

			$.ajax({
				type: 'POST',
				url: '/api/1/services/registration.json',
				data: $self.serialize(),
				success: function() {
					_private.displayConfirmSlide('Email Sent','Thanks for signing up! An email has been sent to ' +
						email + '. Please follow the instructions to activate your new account.');

					// setSignupCampaignId cookie to be read in the next login state
					if(location.href.indexOf('lps/movie-nights') !== -1) {
						BMBF.user.setSignupCampaignId('movie-nights');
						
						// track raw event
						BMBF.libs.tracking.track('registration', 'signup', 'Campaign Signup - movie-nights');

						// track conversion, load google async script
						$.getScript('//www.googleadservices.com/pagead/conversion_async.js')
							// script loaded
							.done(function() {
								// call global google async track method
								BMBF.libs.tracking.trackConversion(969517115, 'Gli5CKDZiVgQu9CmzgM');
							});
					} else if(location.href.indexOf('lps/membership') !== -1) {
						BMBF.user.setSignupCampaignId('membership');
						BMBF.libs.tracking.track('registration', 'signup', 'Campaign Signup - membership page');
					} else {
						BMBF.libs.tracking.track('registration', 'signup', 'Normal Signup');
					}
				},
				error: function(jqXHR) {
					BMBF.libs.foundation.handleAbideError($self, jqXHR.responseJSON);
					BMBF.libs.tracking.track('registration', 'signup', 'error');
				}
			});

			return false;
		},

		postToForgotService: function($self) {
			$.ajax({
				type: 'POST',
				url: '/api/1/services/forgotpswd.json',
				data: $self.serialize(),
				success: function() {
					_private.displayConfirmSlide('Email Sent','We sent you an email with a link for you to reset your password.');
					BMBF.libs.tracking.track('registration', 'forgot password', 'success');
				},
				error: function(jqXHR) {
					BMBF.libs.foundation.handleAbideError($self, jqXHR.responseJSON);
					BMBF.libs.tracking.track('registration', 'forgot password', 'error');
				}
			});
		},

		postToResetService: function($self) {
			var token = '';

			if(location.search.indexOf('?token=') !== -1) {
				token = location.search.substr(7);
			}

			$.ajax({
				type: 'POST',
				url: '/api/1/services/resetpswd.json?token='+token,
				data: $self.serialize(),
				success: function() {
					_private.displayConfirmSlide('Success!','You have successfully changed your password. Please login by clicking the button below.', true);
					BMBF.libs.tracking.track('registration', 'reset password', 'success');
				},
				error: function(jqXHR) {
					BMBF.libs.foundation.handleAbideError($self, jqXHR.responseJSON);
					BMBF.libs.tracking.track('registration', 'reset password', 'error');
				}
			});
		},

		displayConfirmSlide: function(title, msg, showLoginBtn) {
			var $btn = _private.$confirmSlide.find('.login-btn-container');
			_private.$confirmSlide.find('h2').text(title);
			_private.$confirmSlide.find('.msg').text(msg);

			if(showLoginBtn) {
				$btn.show();
			} else {
				$btn.hide();
			}

			_private.$reg.trigger('goto.fndtn.orbit', ['confirm']);
		}
	};

	BMBF.libs.registration = {
		init: function() {
			_private.setup();
			_private.bind();
			_private.bindServices();
		}
	};

	return BMBF.libs.registration;
})(jQuery, document, window);