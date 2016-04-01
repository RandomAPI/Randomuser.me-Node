$(document).ready(function(){
	$('.nav_toggle').bind('click touchstart', function(){
		$('body').toggleClass('active');
	})
});