var speakerManager = {

    loadSection: function() {
        speakerManager.getSpeakers(function(list) {
            speakerManager.addSpeakers(list, function() {
                twttr.widgets.load();
                speakerManager.initEventHandlers();
                speakerManager.alsSpeakers();
                speakerManager.displayWidget();

                $("#left-arrow, #right-arrow").hover(function() {
                    $.fn.als('stop', 'als-wrapper_0');
                }, function() {
                	$.fn.als('start', 'als-wrapper_0');
                });
            });
        });
    },

    getSpeakers: function(callback) {
        $.getJSON('data/speakers.json', function(speakers) {
            for (var i=0; i<speakers.length; i++) {
                if (speakers[i].hidden) {
                    speakers.splice(i, 1);
                }
            }

            function compare(speaker1, speaker2) {
                if (speaker1.order < speaker2.order) {
                    return -1;
                }
                return 1;
            }
            speakers.sort(compare);

            if (callback) {
               callback(speakers);
            }
        });
    },

    addSpeakers: function(speakers, callback) {
        var count = speakers.length;
        var i = 0;

        var loadNext = function() {
            var speaker = speakers[i];
            if (speaker.type !== 'speaker') {
                i++;
                loadNext();
                return;
            }

            if (i < count - 1) {
                speakerManager.addSpeaker(speaker, loadNext);
            }

            if (i == count - 1) {
                if (callback) {
                    speakerManager.addSpeaker(speaker, callback);
                } else {
                    speakerManager.addSpeaker(speaker);
                }
            }
            i++;
        };

        loadNext();
    },

    addSpeaker: function(speaker, callback) {
        var flag = this.getImageByCountry(speaker.country);
        var img = new Image();
        img.src = 'assets/img/speaker-photos/' + speaker.id + '.png';
        img.onload = function() {
            var loadingContent = '';
            loadingContent += '<li class="als-item speaker">';
            loadingContent += '<div class="photo" data-id="' + speaker.id + '"><img src="assets/img/speaker-photos/' + speaker.id + '.png"></div>';
            loadingContent += '<div class="country"><img src="assets/img/countries/' + flag + '"></div>';
            loadingContent += '<div class="name">' + speaker.name + '</div>';
            loadingContent += '<div class="company">' + speaker.company + '</div>';
            loadingContent += '<div class="description">' + speaker.bio + '</div>';
            loadingContent += '<div class="read-more" data-id="' + speaker.id + '">read more+</div>';
            if (speaker.contacts.twitter) {
                loadingContent += '<div class="follow">';
                loadingContent += '<a href="https://twitter.com/' + speaker.contacts.twitter + '" class="twitter-follow-button" data-show-count="true" data-lang="en">Follow @twitterapi</a>';
            }
            loadingContent += '</div>';
            loadingContent += '</li>';
            $('.als-wrapper').append(loadingContent);
            if (callback) {
                callback();
            }
        }
    },

    alsSpeakers: function(callback) {
        var visible = 3;
        $("#speakers-list").als({
            visible_items: visible,
            scrolling_items: 1,
            orientation: "horizontal",
            circular: "yes",
            autoscroll: "yes",
            interval: 1400 * visible,
            speed: 250 * visible,
            easing: "linear"
        });
        if (callback) {
            callback();
        }
    },

    getImageByCountry: function(countryName) {
        switch (countryName) {
            case 'UK':
                return 'gb.png';
            case 'Russia':
                return 'ru.png';
            case 'Egypt':
                return 'eg.png';
            case 'Poland':
                return 'pl.png';
            case 'Finland':
                return 'fi.png';
            case 'France':
                return 'fr.png';
            case 'Belgium':
                return 'be.png';
            case 'Israel':
                return 'il.png';
            case 'USA':
                return 'us.png';
            case 'Estonia':
                return 'ee.png';
            case 'Spain':
                return 'es.png';
            case 'Czech Republic':
                return 'cz.png';
            case 'Netherlands':
                return 'nl.png';
            case 'Bulgaria':
                return 'bg.png';
            case 'Latvia':
                return 'lv.png';
            case 'Germany':
                return 'de.png';
            case 'Sweden':
                return 'se.png';
            case 'Greece':
                return 'gr.png';
        }
    },

    initEventHandlers: function() {
        $('.als-item.speaker .read-more,.photo').click(function() {
            var speakerId = $(this).data('id');
            speakerManager.getSpeakers(function(list) {
                for (var i=0; i<list.length; i++) {
                    var speaker = list[i];
                    if (speaker.id == speakerId) {
                        $("#speaker-popup .photo").html('<img src="assets/img/speaker-photos/' + speaker.id + '.png"></div>');
                        $("#speaker-popup .name").html(speaker.name);
                        $("#speaker-popup .description").html(speaker.bio);
                        if (speaker.contacts.twitter) {
                            $("#speaker-popup .contacts").html('<a href="https://twitter.com/' + speaker.contacts.twitter + '" class="twitter-follow-button" data-show-count="true" data-lang="en">Follow @twitterapi</a>');
                        }
                        if (speaker.contacts.blog) {
                            var html = $("#speaker-popup .contacts").html();
                            $("#speaker-popup .contacts").html(html + ' <a class="blog" href="' + speaker.contacts.blog + '">' + speaker.contacts.blog + '</a></div>');
                        }
                        twttr.widgets.load();
                    }
                }
            });

            $('#speaker-popup').modal({
                onOpen: function (dialog) {
                	dialog.overlay.fadeIn('fast', function () {
                		dialog.container.slideDown('fast', function () {
                			dialog.data.fadeIn('slow');
                		});
                	});
                },
                opacity: 60,
	            overlayCss: {backgroundColor: '#000000'}
            });
            $('#speaker-popup').css('top', '100px');
        });
    },

    displayWidget: function() {
        $('#speakers .loader').remove();
        $('#speakers-list').css('display', 'block');
    }
};
