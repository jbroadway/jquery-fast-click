/**
 * jQuery.fastClick.js
 * 
 * Work around some mobile browser's 300ms delay on the click event.
 * 
 * Code based on <http://code.google.com/mobile/articles/fast_buttons.html>
 * 
 * @usage
 * $('button').fastClick(function() {alert('clicked!');});
 * 
 * @license Under Creative Commons Attribution 3.0 License
 * @author Dave Hulbert (dave1010)
 * @version 0.1 2011-03-07
 */

/*global document, window, jQuery */

(function($) {

$.fn.fastClick = function(handler) {
	return $(this).each(function(){
		$.FastButton($(this)[0], handler);
	});
};

$.FastButton = function(element, handler) {
	var startX, startY;
	
	var reset = function() {
		$(element).unbind('touchend');
		$(document.body).unbind('touchmove');
	};

	var onClick = function(event) {
		event.stopPropagation();
		reset();
		handler(event);
	
		if (event.type === 'touchend') {
			$.clickbuster.preventGhostClick(startX, startY);
		}
	};
	
	var onTouchMove = function(event) {
		if (Math.abs(event.touches[0].clientX - startX) > 10 ||
			Math.abs(event.touches[0].clientY - startY) > 10) {
			reset();
		}
	};
	
	var onTouchStart = function(event) {
		event.stopPropagation();
	
		$(element).bind('touchend', onTouchStart);
		$(document.body).bind('touchmove', onTouchMove);
	
		startX = event.touches[0].clientX;
		startY = event.touches[0].clientY;
	};
	
	$(element).bind({
		touchstart: onTouchStart,
		click: onClick
	});
};

$.clickbuster = {
	coordinates: [],

	preventGhostClick: function(x, y) {
		$.clickbuster.coordinates.push(x, y);
		window.setTimeout($.clickbuster.pop, 2500);
	},

	pop: function() {
		$.clickbuster.coordinates.splice(0, 2);
	},

	onClick: function(event) {
		var x, y, i;
		for (i = 0; i < $.clickbuster.coordinates.length; i += 2) {
			x = $.clickbuster.coordinates[i];
			y = $.clickbuster.coordinates[i + 1];
			if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
				event.stopPropagation();
				event.preventDefault();
			}
		}
	}
};

$(function(){
	document.addEventListener('click', $.clickbuster.onClick, true);
});

}(jQuery));
