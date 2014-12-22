$(document).ready(function() {

    $("#map-description").find(".photos a").fancybox({
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
        var anchor = $(this).attr('href');
        if(anchor.indexOf("#") == 0) {
            e.preventDefault();
            $('html, body').animate({
                'scrollTop': $(anchor).offset().top
            }, 1000, function () {
                location.hash = anchor;
            });
        }
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

    $("#speaker-popup").find(".close").click(function() {
        $.modal.close();
    });

    $("#schedule-popup").find(".close").click(function() {
        $.modal.close();
    });

    scheduleManager.loadSection();
});
