var SpeakersBox = React.createClass({
    displayName: 'SpeakersBox',
    loadSpeakers: function () {
        storage.getSpeakers(function (speakers) {
            this.setState({speakers: speakers});
        }.bind(this));
    },
    getInitialState: function () {
        return {speakers: []};
    },
    componentDidMount: function () {
        this.loadSpeakers();
    },
    render: function () {
        return <SpeakersList speakers={this.state.speakers}/>
    }
});

var SpeakersList = React.createClass({
    displayName: 'SpeakersList',
    render: function () {
        var speakerNodes = this.props.speakers.map(function (speaker, index) {
            return (
                <Speaker speaker={speaker} key={index}>
                </Speaker>
            );
        });

        return (
            <div className="speakers-list">
            {speakerNodes}
            </div>
        )
    }
});

var Speaker = React.createClass({
    displayName: 'Speaker',
    getCountryShortname: function (countryName) {
        var countryShortcodeMap = {
            'UK': 'gb',
            'Russia': 'ru',
            'Egypt': 'eg',
            'Poland': 'pl',
            'Finland': 'fi',
            'France': 'fr',
            'Belgium': 'be',
            'Israel': 'il',
            'USA': 'us',
            'Estonia': 'ee',
            'Spain': 'es',
            'Czech Republic': 'cz',
            'Netherlands': 'nl',
            'Bulgaria': 'bg',
            'Latvia': 'lv',
            'Germany': 'de',
            'Sweden': 'se',
            'Greece': 'gr'
        };

        // ToDo: Check for existance?
        return countryShortcodeMap[countryName];
    },
    speakerCountryIcon: function (countryName) {
        return "assets/img/countries/" + this.getCountryShortname(countryName) + ".png"
    },
    speakerLogoUrl: function (id) {
        return "assets/img/speaker-photos/" + id + ".png";
    },
    getInitialState: function () {
        return {
            speaker: {
                id: "",
                country: "",
                name: "",
                company: "",
                bio: ""
            }
        };
    },
    render: function () {
        return (this.props.speaker.type == 'speaker' ?
            <div className="speaker-item">
                <div className="speaker-left-block">
                    <div className="speaker-logo">
                        <img src={this.speakerLogoUrl(this.props.speaker.id)}/>
                    </div>
                    <div className="speaker-country">
                        <img src={this.speakerCountryIcon(this.props.speaker.country)}/>
                    </div>
                    <div className="speaker-name">
                    {this.props.speaker.name}
                    </div>
                    <div className="speaker-company">
                    {this.props.speaker.company}
                    </div>
                </div>
                <div className="speaker-right-block">
                    <div className="speaker-bio" dangerouslySetInnerHTML={{__html: this.props.speaker.bio}} />
                </div>
            </div>
            : <div className="no-speaker"/>
        );
    }
});

React.render(
    <SpeakersBox/>,
    document.getElementById('speakers-box')
);