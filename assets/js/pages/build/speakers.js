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
        console.log(this.twttr);
    },
    render: function () {
        var speakerNodes = this.props.speakers.map(function (speaker, index) {
            return (
                React.createElement(Speaker, {speaker: speaker, key: index}
                )
            );
        });

        return (
            React.createElement("div", {className: "speakers-list"}, 
            speakerNodes
            )
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
                id: null,
                country: null,
                name: null,
                company: null,
                bio: null,
                contacts: {
                    twitter: null,
                    blog: null
                }
            }
        };
    },
    render: function () {
        if (this.props.speaker.type !== 'speaker') return React.createElement("div", {className: "not-speaker"});

        var twitterLink = "",
            blogLink = "";

        if (this.props.speaker.contacts.twitter) {
            var twitterUrl = "https://twitter.com/" + this.props.speaker.contacts.twitter;
            twitterLink = (
                React.createElement("a", {href: twitterUrl, className: "twitter-follow-button", "data-show-count": "true", "data-lang": "en"}, 
                    "Follow @twitterapi"
                )
            );
        }
        if (this.props.speaker.contacts.blog) {
            blogLink = (
                React.createElement("a", {href: this.props.speaker.contacts.blog, target: "_blank"}, 
                    this.props.speaker.contacts.blog
                )
            );
        }

        return (
            React.createElement("div", {className: "speaker-item"}, 
                React.createElement("div", {className: "speaker-left-block"}, 
                    React.createElement("div", {className: "speaker-logo"}, 
                        React.createElement("img", {src: this.speakerLogoUrl(this.props.speaker.id)})
                    ), 
                    React.createElement("div", {className: "speaker-country"}, 
                        React.createElement("img", {src: this.speakerCountryIcon(this.props.speaker.country)})
                    ), 
                    React.createElement("div", {className: "speaker-name"}, 
                    this.props.speaker.name
                    ), 
                    React.createElement("div", {className: "speaker-company"}, 
                    this.props.speaker.company
                    )
                ), 
                React.createElement("div", {className: "speaker-right-block"}, 
                    React.createElement("div", {className: "speaker-bio", dangerouslySetInnerHTML: {__html: this.props.speaker.bio}})
                ), 
                React.createElement("div", {className: "speaker-contacts"}, 
                    blogLink, 
                    twitterLink
                )
            )
        );
    }
});

React.render(
    React.createElement(SpeakersBox, null),
    document.getElementById('speakers-box')
);