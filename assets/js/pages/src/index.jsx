/*
 * Global setup
 */
(function () {
    $("#map-description").find(".photos a").fancybox({
        closeBtn: false,
        nextEffect: 'elastic',
        prevEffect: 'elastic'
    });

    var rightSidePanel = {
        element: $('#right-menu'),
        visible: false,

        changeVisibility: function () {
            if (this.visible) {
                this.element.stop(true).fadeOut(500);
            } else {
                this.element.stop(true).fadeIn(500);
            }
            this.visible = !this.visible;
        },

        listen: function (identifier) {
            var self = this;
            $(window).scroll(function () {
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

    $("nav a").click(function (e) {
        var anchor = $(this).attr('href');
        if (anchor.indexOf("#") == 0) {
            e.preventDefault();
            $('html, body').animate({
                'scrollTop': $(anchor).offset().top
            }, 1000, function () {
                location.hash = anchor;
            });
        }
    });

    $("#place").click(function () {
        $('html, body').animate({
            'scrollTop': $('#venue').offset().top
        }, 1000);
    });

    $('#countdown').flipcountdown({
        size: 'lg',
        beforeDateTime: '01/22/2015 09:45:00',
        speedFlip: 60
    });
}());

/*
 * Map (google) initialization
 */
(function () {
    function initialize() {
        var myLatlng = new google.maps.LatLng(56.92562599999999, 24.105833800000028);
        var mapOptions = {
            zoom: 13,
            center: myLatlng,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            mapTypeControl: false,
            streetViewControl: false,
            panControl: false,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('map-container'), mapOptions);

        var styles = [{"stylers": [{"hue": "#00aaff"}, {"saturation": -23}, {"gamma": 1.37}, {"lightness": -5}]}];
        map.setOptions({styles: styles});

        var multikinoMarker = new MarkerWithLabel({
            position: myLatlng,
            map: map,
            title: 'Riga Dev Day 2015',
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            labelContent: 'Multikino',
            labelAnchor: new google.maps.Point(35, -5),
            labelClass: 'map-label'
        });

        var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<div id="bodyContent">' +
            '<a href="http://www.islandehotel.lv/"><img src="assets/img/islande.jpg"></a>' +
            '</div>' +
            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        var hotelCoordinates = new google.maps.LatLng(56.951178, 24.08415, 17);

        var hotelMarker = new MarkerWithLabel({
            position: hotelCoordinates,
            map: map,
            title: 'Islande Hotel',
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            labelContent: 'Islande Hotel',
            labelAnchor: new google.maps.Point(48, -5),
            labelClass: 'map-label'
        });

        google.maps.event.addListener(hotelMarker, 'click', function () {
            infowindow.open(map, hotelMarker);
        });

        var pachoLatlng = new google.maps.LatLng(56.9462052, 24.1098639);
        var pachoMarker = new MarkerWithLabel({
            position: pachoLatlng,
            map: map,
            title: 'Pacho music cafe',
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            labelContent: 'Pacho music cafe',
            labelAnchor: new google.maps.Point(58, -5),
            labelClass: 'map-label'
        });
        var pachoInfowindow = new google.maps.InfoWindow({
            content: '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<div id="bodyContent">' +
            '<a href="http://www.pacho.lv" target="_blank">http://www.pacho.lv</a>' +
            '</div>' +
            '</div>'
        });
        google.maps.event.addListener(pachoMarker, 'click', function () {
            pachoInfowindow.open(map, pachoMarker);
        });


    }

    var image = new Image();
    image.src = 'assets/img/islande.jpg';

    google.maps.event.addDomListener(image, 'load', initialize);
}());

/*
 * Speakers section
 */
(function () {
    var SpeakersSection = React.createClass({
        displayName: 'SpeakersSection',
        loadSpeakers: function () {
            storage.getSpeakers(function (speakers) {
                this.setState({speakers: speakers});
            }.bind(this));
        },
        getInitialState: function () {
            return {speakers: []};
        },
        componentWillMount: function () {
            this.loadSpeakers();
        },
        render: function () {
            if(this.state.speakers.length > 0) {
                return <SpeakersList speakers={this.state.speakers}/>;
            } else {
                return null;
            }
        }
    });

    var SpeakersList = React.createClass({
        displayName: 'SpeakersList',
        componentDidMount: function () {
            var visible = 3;
            $("#speakers-als-wrapper").als({
                visible_items: visible,
                scrolling_items: 1,
                orientation: "horizontal",
                circular: "yes",
                autoscroll: "yes",
                interval: 1400 * visible,
                speed: 250 * visible,
                easing: "linear"
            });
        },
        render: function () {
            var speakerNodes = [];
            for (var i = 0; i < this.props.speakers.length; i++) {
                if (this.props.speakers[i].type == 'speaker') {
                    speakerNodes.push(
                        <Speaker speaker={this.props.speakers[i]} key={i} />
                    );
                }
            }

            return (
                <ul className="als-wrapper">{speakerNodes}</ul>
            );
        }
    });

    var Speaker = React.createClass({
        displayName: 'Speaker',
        speakerCountryIcon: function (countryName) {
            return "assets/img/countries/" + country.nameToShortcode(countryName) + ".png"
        },
        speakerLogoUrl: function (id) {
            return "assets/img/speaker-photos/" + id + ".png";
        },
        getInitialState: function () {
            return {
                speaker: {
                    id: null,
                    country: null,
                    name: null,
                    company: null,
                    bio: null
                }
            };
        },
        render: function () {
            return (
                <li className="als-item speaker">
                    <div className="photo">
                        <img src={this.speakerLogoUrl(this.props.speaker.id)} />
                    </div>
                    <div className="country">
                        <img src={this.speakerCountryIcon(this.props.speaker.country)} />
                    </div>
                    <div className="name">{this.props.speaker.name}</div>
                    <div className="company">{this.props.speaker.company}</div>
                    <div className="description" dangerouslySetInnerHTML={{__html: this.props.speaker.bio}} />
                </li>
            );
        }
    });

    React.render(
        <SpeakersSection/>,
        document.getElementById('speakers-list')
    );
}());

/*
 * Schedule section
 */
(function () {
    React.render(
        <Schedule/>,
        document.getElementById('schedule')
    );
}());