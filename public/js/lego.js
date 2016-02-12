$(window).konami({
    cheat: function() {
    	api_url = 'https://randomuser.me/api/0.4/?lego&randomapi';
    	getNewUser(api_url);
    	$('header h1').html('Random Lego Generator');
    	$('body').addClass('lego');

    	window.scrollTo(0, 0);
    }
});
