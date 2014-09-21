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
	
	$("#place").click(function() {
	    $('html, body').animate({
            'scrollTop': $('#venue').offset().top
        }, 1000);
	});

	$('#countdown').flipcountdown({
        size:'lg',
        beforeDateTime:'01/22/2015 00:00:00',
        speedFlip:60
    });

    $('#register').click(function() {
        window.location.href='http://www.kalevatravel.lv/celojumi/page.php?id=664';
    });

    $('#sponsors').click(function() {
        window.location.href='https://docs.google.com/file/d/0BxMQv-svniw_dnNWTV8tQXMyVmM/edit?pli=1';
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
	
    $('#oreilly').click(function() {
        window.location.href = 'http://www.oreilly.com/';
    });
	
    $('#ok').click(function() {
        window.location.href = 'http://ok.ru/';
    });

    $("#speaker-popup .close").click(function() {
	    $.modal.close(); 
    });
    
    speakerManager.loadSection();
    scheduleManager.loadSection();
});
