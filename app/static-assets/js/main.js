'use strict';
/*global $, Foundation, NLForm, Modernizr, ga, BMBF*/

// FitText after fonts have loaded.
$(window).load(function(){
	$('#header-slider .slide h2').fitText(1, {minFontSize: '40px', maxFontSize: '80px'});
});

// start jquery onready
$(function() {
	function noop(){}
	var modals = {
		success: $('#successModal'),
		error: $('#errorModal')
	};

	// show slides, prevents some flickering from happening
	$('header .slide').show();

	// placeholder polyfill for ie9
	if(!Modernizr.input.placeholder) {
		$('input, textarea').placeholder();
	}

	// nlform init
	var $nl_header_form = $('#nl-form-header').show();
	if($nl_header_form.length) {
		new NLForm($nl_header_form[0]);
	}

	$(document).foundation({
		// Orbit is set to be deprecated, use https://github.com/kenwheeler/slick in the future
		orbit: {
			animation: 'slide', // Sets the type of animation used for transitioning between slides, can also be 'fade'
			timer_speed: 0, // Sets the amount of time in milliseconds before transitioning a slide
			pause_on_hover: false, // Pauses on the current slide while hovering
			resume_on_mouseout: false, // If pause on hover is set to true, this setting resumes playback after mousing out of slide
			next_on_click: false, // Advance to next slide on click
			animation_speed: 300, // Sets the amount of time in milliseconds the transition between slides will last
			stack_on_small: false,
			navigation_arrows: false,
			slide_number: false,
			slide_number_text: 'of',
			container_class: 'orbit-container',
			stack_on_small_class: 'orbit-stack-on-small',
			next_class: 'orbit-next', // Class name given to the next button
			prev_class: 'orbit-prev', // Class name given to the previous button
			timer_container_class: 'orbit-timer', // Class name given to the timer
			timer_paused_class: 'paused', // Class name given to the paused button
			timer_progress_class: 'orbit-progress', // Class name given to the progress bar
			slides_container_class: 'orbit-slides-container', // Class name given to the slide container
			preloader_class: 'preloader', // Class given to the perloader
			slide_selector: 'div', // Default is '*' which selects all children under the container
			bullets_container_class: 'orbit-bullets',
			bullets_active_class: 'active', // Class name given to the active bullet
			slide_number_class: 'orbit-slide-number', // Class name given to the slide number
			caption_class: 'orbit-caption', // Class name given to the caption
			active_slide_class: 'active', // Class name given to the active slide
			orbit_transition_class: 'orbit-transitioning',
			bullets: false, // Does the slider have bullets visible?
			circular: true, // Does the slider should go to the first slide after showing the last?
			timer: false, // Does the slider have a timer active? Setting to false disables the timer.
			variable_height: true, // Does the slider have variable height content?
			swipe: false,
			before_slide_change: noop, // Execute a function before the slide changes
			after_slide_change: noop // Execute a function after the slide changes
		},
		abide: {
			live_validate: false,
			timeout: 1200
		},
		topbar: {
			sticky_class: 'sticky',
			custom_back_text: true, // Set this to false and it will pull the top level link name as the back text
			back_text: 'Back', // Define what you want your custom back text to be if custom_back_text: true
			is_hover: false,
			mobile_show_parent_link: false, // will copy parent links into dropdowns for mobile navigation
			scrolltop: true // jump to top when sticky nav menu toggle is clicked
		}
	});

	// force close the topbar expanded view on small/med when the Login / Signup button is pressed.
	$('#reg-btn-dropdown')
		.on('click.fndtn.dropdown', function () {
		Foundation.libs.topbar.toggle($('.top-bar'));
	});

	// Open the dropdown and slider on the supplied hash, default to login (#slide=login, #slide=signup, #slide=reset, #slide=forgot)
	var openRegistrationDropdownToSlide = function(slide) {
		var $tb = $('.top-bar');
		// turn animations off
		$.fx.off = true;

		// go to hashed slide
		$('#registration').trigger('goto.fndtn.orbit', [slide]);

		// show menu to see our dropdown in the menu
		if(!$tb.hasClass('expanded')) {
			Foundation.libs.topbar.toggle($tb);
		}
		
		// Force open dropdown (dropdown content, dropdown trigger (button))
		Foundation.libs.dropdown.open($('#reg-dropdown'), $('#reg-btn-dropdown'));

		// hide menu
		Foundation.libs.topbar.toggle($tb);
		
		// turn animations back on
		$.fx.off = false;

		// reflow
		$('#reg-dropdown').foundation('orbit', 'reflow');
	};

	// check hashes on load
	if(location.hash.indexOf('#slide=') !== -1) {
		openRegistrationDropdownToSlide(location.hash.substr(7));
	}
	// listen to hashchange events universally 
	$(window).on('hashchange', function() {
		if(location.hash.indexOf('#slide=') !== -1) {
			openRegistrationDropdownToSlide(location.hash.substr(7));
		}
	});

	// fix for dynamic height change on the 'orbit' container, yesh a ton of listeners :/
	$('#reg-dropdown form')
		.on('valid.fndtn.abide invalid.fndtn.abide', function () {
			$('#reg-dropdown').foundation('orbit', 'reflow');
		})
		.find('input, textarea, select')
			.on('keydown.fndtn.abide change.fndtn.abide blur.fndtn.abide', function() {
				setTimeout(function(){
					$('#reg-dropdown').foundation('orbit', 'reflow');
				}, 0);
			});


	// reset error messages when dropdown is closed
	$('#reg-dropdown').on('closed.fndtn.dropdown', function() {
		var abideForms = $(this).find('form');

		$(abideForms).children('div').removeClass('error');
		$(abideForms).each(function(){
			this.reset();
		});
		
		// reset server errors
		$('.server-message small').text('');
		$('.server-message').removeClass('success').removeClass('error').hide();

		// reflow
		$('#reg-dropdown').foundation('orbit', 'reflow');

		// go back to the (login) slide
		$.fx.off = true;
		$('#registration').trigger('goto.fndtn.orbit', ['login']);
		$.fx.off = false;
	});

	// close registration dropdown and go back to login
	$('#registration .close').click(function() {
		$('#registration').trigger('goto.fndtn.orbit', ['login']);
		Foundation.libs.dropdown.close($('#reg-dropdown'));
	});

	// open registration dropdown to any slide
	$('button.open-registration').click(function() {
		var slide = $(this).data('slide');

		openRegistrationDropdownToSlide(slide);

		return false;
	});

	var displayError = function($target, data) {
		var msg;

		if(typeof data === 'undefined' || data && typeof data.message === 'undefined') {
			msg = 'An unexpected error occured. Please try again.';
		} else {
			msg = data.message;
		}

		switch(msg) {
			case 'User is disabled':
				msg = 'Sorry, we were unable to log you in';
				break;
			case 'The user already exists':
				msg = 'Your email is already associated with an account.';
				break;
		}

		$target.find('.server-message').removeClass('success').addClass('error').show();
		$target.find('.server-error').text(msg).addClass('error').show();

		// reflow just in case
		$('#reg-dropdown').foundation('orbit', 'reflow');
	};
	
	var displayConfirmSlide = function(title, msg, showLoginBtn) {
		var $slide = $('#reg-dropdown .confirm');
		var $btn = $slide.find('.login-btn-container');
		$slide.find('h2').text(title);
		$slide.find('.msg').text(msg);

		if(showLoginBtn) {
			$btn.show();
		} else {
			$btn.hide();
		}

		$('#registration').trigger('goto.fndtn.orbit', ['confirm']);
	};

	var resetAbideErrorsWhileTyping = function($el) {
		$el.closest('div.columns').removeClass('error');
		$el.removeAttr('data-invalid').removeClass('error');
	};

	$('.login-form').on('valid.fndtn.abide', function () {
		var $self = $(this);

		$.ajax({
			type: 'POST',
			url: '/crafter-security-rest-login',
			data: $self.serialize(),
			success: function() {
				if($self.find('input.remember').get(0).checked) {
					var ticket = $.cookie('ticket');
					var profileLastUpdate = $.cookie('profile-last-modified');

					$.cookie('ticket', ticket, {expires: 15});
					$.cookie('profile-last-modified', profileLastUpdate, {expires: 15});
				}

				// if getSignupCampaignId is set redirect to it's page
				try {
					var redirectURI = BMBF.user.campaignRedirects[BMBF.user.getSignupCampaignId()];
					if(typeof redirectURI !== 'undefined') {
						BMBF.user.clearSignupCampaignId();
						window.location.href = redirectURI;
					} else {
						window.location.href = '/';
					}
				}
				catch(e) {
					window.location.href = '/';
				}
			},
			error: function(jqXHR) {
				displayError($self, jqXHR.responseJSON);
			}
		});

		return false;
	});

	// logout buttons
	$('.logout').click(function() {
		$.ajax({
			type: 'GET',
			url: '/crafter-security-rest-logout',
			cache: false,
			complete: function() {
				window.location.href = '/';
			}
		});
		
		return false;
	});
	
	$('#facebook-connect-btn').click(function(e) {
		e.preventDefault();

		var top = (screen.height / 2) - (300/ 2);
		var left = (screen.width / 2) - (500 / 2);
		var fbDialog = window.open('/connect/facebook_dialog', 'fbDialog', 'width=500, height=300, top=' + top + ', left=' + left);
		var interval = setInterval(function() {
			if (fbDialog === null || fbDialog.closed) {
				clearInterval(interval);
				
				location.reload();
			}
		}, 1000);
	});

	$('.signup-form').on('valid.fndtn.abide', function () {
		var $self = $(this);
		var email = $self.find('input[type="email"]').val();

		$.ajax({
			type: 'POST',
			url: '/api/1/services/registration.json',
			data: $self.serialize(),
			success: function() {
				displayConfirmSlide('Email Sent','Thanks for signing up! An email has been sent to ' +
					email + '. Please follow the instructions to activate your new account.');

				// setSignupCampaignId cookie to be read in the next login state
				if(location.href.indexOf('lps/movie-nights') !== -1) {
					BMBF.user.setSignupCampaignId('movie-nights');
				}
			},
			error: function(jqXHR) {
				displayError($self, jqXHR.responseJSON);
			}
		});

		return false;
	});

	$('.forgot-form').on('valid.fndtn.abide', function () {
		var $self = $(this);

		$.ajax({
			type: 'POST',
			url: '/api/1/services/forgotpswd.json',
			data: $self.serialize(),
			success: function() {
				displayConfirmSlide('Email Sent','We sent you an email with a link for you to reset your password.');
			},
			error: function(jqXHR) {
				displayError($self, jqXHR.responseJSON);
			}
		});

		return false;
	});

	$('.reset-form').on('valid.fndtn.abide', function () {
		var $self = $(this);
		var token = '';

		if(location.search.indexOf('?token=') !== -1) {
			token = location.search.substr(7);
		}

		$.ajax({
			type: 'POST',
			url: '/api/1/services/resetpswd.json?token='+token,
			data: $self.serialize(),
			success: function() {
				displayConfirmSlide('Success!','You have successfully changed your password. Please login by clicking the button below.', true);
			},
			error: function(jqXHR) {
				displayError($self, jqXHR.responseJSON);
			}
		});

		return false;
	});

	$('#change-password-form').on('valid.fndtn.abide', function () {
		var $self = $(this);

		$.ajax({
			type: 'POST',
			url: '/api/1/services/profile/profile.json?action=changepassword',
			data: $self.serialize(),
			success: function() {
				var msg = '<div data-alert class="alert-box success">You have successfully changed your password!<a href="#" class="close">&times;</a></div>';
				if($self.find('.alert-box.success').length) {
					$self.find('.alert-box.success').fadeOut(function() {
						$(this).remove();
						$(msg).foundation('alert').prependTo($self).hide().fadeIn();
					});
				} else {
					$self.prepend(msg).foundation('alert');
				}
			},
			error: function(jqXHR) {
				displayError($self, jqXHR.responseJSON);
			}
		});
		
		return false;
	});

	$('#edit-profile-form').on('valid.fndtn.abide', function () {
		var $self = $(this);

		$.ajax({
			type: 'POST',
			url: '/api/1/services/profile/profile.json?action=update',
			data: $self.serialize(),
			success: function() {
				var msg = '<div data-alert class="alert-box success">You have successfully updated your profile!<a href="#" class="close">&times;</a></div>';
				if($self.find('.alert-box.success').length) {
					$self.find('.alert-box.success').fadeOut(function() {
						$(this).remove();
						$(msg).foundation('alert').prependTo($self).hide().fadeIn();
					});
				} else {
					$self.prepend(msg).foundation('alert');
				}
			},
			error: function(jqXHR) {
				displayError($self, jqXHR.responseJSON);
			}
		});
		
		return false;
	});
	

	// search form
	$('#search-form').submit(function() {
		var query = $('#search').val();
		if(query) {
			window.location.href = '//'+window.location.host+'/search?q='+encodeURIComponent(query);
		}
		
		return false;
	});

	// Simple email validation using Foundation Abide + jQuery Ajax Post returns
	$('#newsletter-form').on('valid.fndtn.abide', function () {
		var subscription = {
			email: $(this).find('[type="email"]').val()
		};

		$.post('//bmbf-cms.herokuapp.com/subscribe/', subscription)
			.done(function() {
				$('#errorModal').foundation('reveal', 'close');
				modals.success.foundation('reveal', 'open');
			})
			.fail(function() {
				modals.error.foundation('reveal', 'open');
			});
	});

	// movie of the week form
	$('#motw-form').on('valid.fndtn.abide', function () {
		var subscription = {
			email: $(this).find('input[type="email"]').val()
		};

		$.post('//bmbf-cms.herokuapp.com/subscribe/', subscription)
			.done(function() {
				$('#errorModal').foundation('reveal', 'close');
				modals.success.foundation('reveal', 'open');
				ga('send', 'event', 'movie-of-the-week', 'subscribe', 'success');
			})
			.fail(function() {
				modals.error.foundation('reveal', 'open');
				ga('send', 'event', 'movie-of-the-week', 'subscribe', 'input error');
			});
	})
	.on('invalid.fndtn.abide', function () {
		ga('send', 'event', 'movie-of-the-week', 'subscribe', 'input error');
	});

	// NLForm submit
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

	// remove wish list items from profile page
	$('.remove-watch-list-item').click(function() {
		// grab the id of the movie for use in any AJAX calls.
		var movieId = $(this).closest('li').data('id');
		//var $self = $(this);

		$.ajax({
			type: 'POST',
			url: '/api/1/services/profile/profile.json?action=removeMovie',
			data: {movieId: movieId}
		}).complete(function() {
			// reload page to get updated list and pagination
			window.location.reload();
		});

		return false;
	});


	// reset abide while typing
	$('form[data-abide]').find('input, textarea')
	.on('keydown.fndtn.abide', function (e) {
		var self = $(e.target);
		resetAbideErrorsWhileTyping(self);
	});
});