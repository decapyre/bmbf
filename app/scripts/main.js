'use strict';
/*global $, Foundation, Typekit*/

$(function(){
	function noop(){}

	// typekit
	Typekit.load();

	// fit text
	$('.slide .title h2').fitText(0.9, {maxFontSize: '100px'});

	// show slides, prevents some flickering from happening
	$('.slide').show();

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
			live_validate: true,
			timeout: 300
		},
		topbar: {
			sticky_class: 'sticky',
			custom_back_text: true, // Set this to false and it will pull the top level link name as the back text
			back_text: 'Back', // Define what you want your custom back text to be if custom_back_text: true
			is_hover: false,
			mobile_show_parent_link: false, // will copy parent links into dropdowns for mobile navigation
			scrolltop: false // jump to top when sticky nav menu toggle is clicked
		}
	});

	// force close the topbar expanded view on small/med when the Login / Signup button is pressed.
	$('#reg-btn-dropdown')
		.on('click.fndtn.dropdown', function () {
		Foundation.libs.topbar.toggle($('.top-bar'));
	});


	// Open the dropdown and slider on the supplied hash, default to login (#slide=login, #slide=signup, #slide=reset, #slide=forgot)
	if(location.hash.indexOf('#slide') !== -1) {
		// turn animations off
		$.fx.off = true;

		// go to hashed slide
		$('#reg-dropdown [data-orbit-link="'+location.hash.substr(7)+'"]').click();

		// Force open dropdown (dropdown content, dropdown trigger (button))
		Foundation.libs.dropdown.open($('#reg-dropdown'), $('#reg-btn-dropdown'));
		
		// turn animations back on
		$.fx.off = false;
	}

	// fix for dynamic height change on the 'orbit' container, yesh a ton of listeners :/
	$('#reg-dropdown form')
		.on('valid.fndtn.abide invalid.fndtn.abide', function () {
			$(document).foundation('orbit', 'reflow');
		})
		.find('input, textarea, select')
			.on('keydown.fndtn.abide blur.fndtn.abide change.fndtn.abide', function () {
				setTimeout(function(){
					$(document).foundation('orbit', 'reflow');
				}, 300);
			});


	// reset error messages when modal is closed
	$('#reg-dropdown').on('closed.fndtn.dropdown', function() {
		var abideForms = $(this).find('form');

		$(abideForms).children('div').removeClass('error');
		$(abideForms).each(function(){
			this.reset();
		});

		// reflow
		$(document).foundation('orbit', 'reflow');

		// go back to the (login) slide
		$.fx.off = true;
		$('#reg-dropdown [data-orbit-link="login"]').click();
		$.fx.off = false;
	});
});