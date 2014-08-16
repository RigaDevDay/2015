$(document).ready(function() {

    $("nav a").click(function(e) {
        e.preventDefault();
        var anchor = $(this).attr('href');
        $('html, body').animate({
            'scrollTop': $(anchor).offset().top
        }, 1000);
    });

	$('#countdown').flipcountdown({
        size:'lg',
        beforeDateTime:'09/15/2014 00:00:00',
        speedFlip:60
    });

	$('section header')
        .positionSticky()
        .css('width', '100%');


    $('#call-for-papers').click(function() {
        window.location.href='https://docs.google.com/forms/d/1j8f-Zf1o9Jfo2zMH2B8dh4aIO5gSUc1FAQs0leE8tmA/viewform';
    });

    $('#sponsors').click(function() {
        window.location.href='http://rigadevday.lv';
    });

	$('#gdg-riga').click(function() {
		window.location.href = 'http://gdgriga.lv';
	});
	
	$('#jug').click(function() {
		window.location.href = 'http://jug.lv';
	});
	
	$('#lvoug').click(function() {
		window.location.href = 'http://lvoug.lv';
	});
});
