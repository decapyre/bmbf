'use strict';
/*global jQuery, BMBF, Foundation*/
(function($, document, window, undefined) {
	var _private;

	_private = {
		$regDropdown: $('#reg-dropdown'),
		$headerSlider: $('#header-slider'),

		setup: function() {
			// show slides, prevents some orbit flickering from happening
			$('header .slide').show();

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
					swipe: false
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
				},
				equalizer: {
					equalize_on_stack: false
				}
			});
		},

		bind: function() {
			// reset abide while typing
			$('form[data-abide]').find('input, textarea')
				.on('keydown.fndtn.abide', function (e) {
					var self = $(e.target);
					_private.resetAbideErrorsWhileTyping(self);
				});

			// stop header orbit after a full cycle, but still allow circular:true
			this.$headerSlider.on('after-slide-change.fndtn.orbit', function(event, orbit) {
				if(orbit.slide_number === orbit.total_slides-1) {
					// stop manually
					Foundation.libs.orbit.stop(_private.$headerSlider);
				}
			});
		},

		resetAbideErrorsWhileTyping: function($el) {
			$el.closest('div.columns').removeClass('error');
			$el.removeAttr('data-invalid').removeClass('error');
		}
	};

	BMBF.libs.foundation = {
		init: function() {
			_private.setup();
			_private.bind();
		},

		handleAbideError: function($target, data) {
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
			_private.$regDropdown.foundation('orbit', 'reflow');
		}
	};

	return BMBF.libs.foundation;
})(jQuery, document, window);