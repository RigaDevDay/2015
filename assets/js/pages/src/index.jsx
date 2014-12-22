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
            return <SpeakersList speakers={this.state.speakers}/>
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