'use strict';
//quick check to bounce anyone using IE 9 or less
//this should be replaced with some proper feature detection
(function () {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf('MSIE ');

	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
		var ver = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)));
		
		if(ver <= 9){
			window.location = 'http://www1.bestmoviesbyfarr.com/badbrowser/index.html';
		}
	}
}());