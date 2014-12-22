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
                bio: null,
                contacts: {
                    twitter: null,
                    blog: null
                }
            }
        };
    },
    render: function () {
        if (this.props.speaker.type !== 'speaker') return <div className="not-speaker"/>;

        var twitterLink = "",
            blogLink = "";

        if (this.props.speaker.contacts.twitter) {
            var twitterUrl = "https://twitter.com/" + this.props.speaker.contacts.twitter;
            twitterLink = (
                <a href={twitterUrl} className="twitter-follow-button" data-show-count="true" data-lang="en">
                    Follow @twitterapi
                </a>
            );
        }
        if (this.props.speaker.contacts.blog) {
            blogLink = (
                <a href={this.props.speaker.contacts.blog} target="_blank">
                    {this.props.speaker.contacts.blog}
                </a>
            );
        }

        return (
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
                <div className="speaker-contacts">
                    {twitterLink}
                    {blogLink}
                </div>
            </div>
        );
    }
});

React.render(
    <SpeakersBox/>,
    document.getElementById('speakers-box')
);