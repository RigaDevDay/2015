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
            return React.createElement(SpeakersList, {speakers: this.state.speakers})
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
                        React.createElement(Speaker, {speaker: this.props.speakers[i], key: i})
                    );
                }
            }

            return (
                React.createElement("ul", {className: "als-wrapper"}, speakerNodes)
            )
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
                React.createElement("li", {className: "als-item speaker"}, 
                    React.createElement("div", {className: "photo"}, 
                        React.createElement("img", {src: this.speakerLogoUrl(this.props.speaker.id)})
                    ), 
                    React.createElement("div", {className: "country"}, 
                        React.createElement("img", {src: this.speakerCountryIcon(this.props.speaker.country)})
                    ), 
                    React.createElement("div", {className: "name"}, this.props.speaker.name), 
                    React.createElement("div", {className: "company"}, this.props.speaker.company), 
                    React.createElement("div", {className: "description", dangerouslySetInnerHTML: {__html: this.props.speaker.bio}})
                )
            );
        }
    });

    React.render(
        React.createElement(SpeakersSection, null),
        document.getElementById('speakers-list')
    );
}());