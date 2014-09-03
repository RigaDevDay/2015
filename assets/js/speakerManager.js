var speakerManager = {
    
    loadSection: function() {
        speakerManager.getSpeakers(function(list) {
            speakerManager.addSpeakers(list, function() {
                twttr.widgets.load();
                speakerManager.initEventHandlers();
                speakerManager.alsSpeakers();
                $('#speakers .description').dotdotdot();
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
            if (i < count - 1) {
                speakerManager.addSpeaker(speakers[i], loadNext);
            }
            
            if (i == count - 1) {
                if (callback) {
                    speakerManager.addSpeaker(speakers[i], callback);
                } else {
                    speakerManager.addSpeaker(speakers[i]);
                }
                $('#speakers .loader').remove();
                $('#speakers-list').css('display', 'block');
            }
            i++;
        }
        
        loadNext();
    },
    
    addSpeaker: function(speaker, callback) {
        var flag = this.getImageByCountry(speaker.country);
        var img = new Image();
        img.src = 'assets/img/speaker-photos/' + speaker.id + '.jpg';
        img.onload = function() {
            var loadingContent = '';
            loadingContent += '<li class="als-item speaker">';
            loadingContent += '<div class="photo"><img src="assets/img/speaker-photos/' + speaker.id + '.jpg"></div>';
            loadingContent += '<div class="country"><img src="assets/img/countries/' + flag + '"></div>';
            loadingContent += '<div class="name">' + speaker.name + '</div>';
            loadingContent += '<div class="company">' + speaker.company + '</div>';
            loadingContent += '<div class="description">' + speaker.bio + '</div>';
            loadingContent += '<div class="read-more" data-id="' + speaker.id + '">read more+</div>';
            loadingContent += '<div class="follow">';
            loadingContent += '<a href="https://twitter.com/' + speaker.contacts.twitter + '" class="twitter-follow-button" data-show-count="true" data-lang="en">Follow @twitterapi</a>';
            loadingContent += '</div>';
            loadingContent += '</li>';
            $('.als-wrapper').append(loadingContent);
            if (callback) {
                callback();
            }
        }
    },
    
    alsSpeakers: function(callback) {
        $("#speakers-list").als({
            visible_items: 3,
            scrolling_items: 1,
            orientation: "horizontal",
            circular: "no",
            autoscroll: "no",
            speed: 150,
            easing: "linear",
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
        }
    },
    
    initEventHandlers: function() {
        $('.als-item.speaker .read-more').click(function() {
            var speakerId = $(this).data('id');
            speakerManager.getSpeakers(function(list) {
                for (var i=0; i<list.length; i++) {
                    var speaker = list[i];
                    if (speaker.id == speakerId) {
                        $("#speaker-popup .photo").html('<img src="assets/img/speaker-photos/' + speaker.id + '.jpg"></div>');
                        $("#speaker-popup .name").html(speaker.name);
                        $("#speaker-popup .description").html(speaker.bio);
                        $("#speaker-popup .contacts").html('<a href="https://twitter.com/' + speaker.contacts.twitter + '" class="twitter-follow-button" data-show-count="true" data-lang="en">Follow @twitterapi</a>');
                        if (speaker.contacts.blog) {
                            var html = $("#speaker-popup .contacts").html();
                            $("#speaker-popup .contacts").html(html + ' <a class="blog" href="' + speaker.contacts.blog + '">' + speaker.contacts.blog + '</a></div>');
                        }
                        twttr.widgets.load();
                    }
                }
            });

            $('#speaker-popup').modal({
                opacity: 60,
	            overlayCss: {backgroundColor: '#000000'}
            });
            $('#speaker-popup').css('top', '100px');
        });
    }
};