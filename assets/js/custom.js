$(document).ready(function() {
    
    $("#map-description .photos a").fancybox({
        closeBtn: false,
        nextEffect: 'elastic',
        prevEffect: 'elastic'
    });
    
    var rightSidePanel = {
        element: $('#right-menu'),
        visible: false,

        changeVisibility: function() {
            if (this.visible) {
                this.element.stop(true).fadeOut(500);
            } else {
                this.element.stop(true).fadeIn(500);
            }
            this.visible = !this.visible;
        },

        listen: function(identifier) {
            var self = this;
            $(window).scroll(function() {
                var currentPos = $(window).scrollTop();
                var identBot = $(identifier).position().top + $(identifier).outerHeight(true);
                // Need to show
                if (currentPos > identBot && !self.visible) {
                    self.changeVisibility();
                }
                // Need to hide
                if (currentPos < identBot && self.visible) {
                    self.changeVisibility();
                }
            });
        }
    };

    rightSidePanel.listen('header nav');

    $("nav a").click(function(e) {
        e.preventDefault();
        var anchor = $(this).attr('href');
        $('html, body').animate({
            'scrollTop': $(anchor).offset().top
        }, 1000);
    });
	
	$("#date").click(function() {
		 window.location.href='http://lanyrd.com/2015/rigadevday/save-to-calendar/';
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
        window.location.href='mailto:info@rigadevday.lv';
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

    //$("#speakers-list").als();
});
