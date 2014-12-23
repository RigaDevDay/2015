var ScheduleRoomNames = React.createClass({
    displayName: 'ScheduleRoomNames',
    render: function () {
        var roomNameNodes = [];
        roomNameNodes.push(<th key="-2"></th>); // Cell for time
        roomNameNodes.push(<th key="-1"></th>); // Cell for icon
        this.props.roomNames.forEach(function (name, i) {
            roomNameNodes.push(<th key={i}>{name}</th>);
        });
        return <tr>{roomNameNodes}</tr>;
    }
});

var Timeline = React.createClass({
    getDefaultProps: function () {

    },
    collectSpeakerNames: function (speakerIds) {
        var speakerNames = [];
        speakerIds.forEach(function (speakerId) {
            speakerNames.push(this.props.speakers[speakerId].name);
        }.bind(this));

        return speakerNames.join(", <br />");
    },
    getEventCellClassName: function (clickable) {
        return (clickable ? "clickable" : "unique") + " content";
    },
    getEventCellSize: function (single) {
        return single ? "5" : "1";
    },
    getEventHeader: function (event) {
        return event.title ? event.title : this.collectSpeakerNames(event.speakers);
    },
    getEventSubtitle: function (event) {
        return event.subtitle ? event.subtitle : "";
    },
    getEventId: function (i) {
        return this.props.timelineId + "#" + i;
    },
    render: function () {
        var timelineNodes = [];

        timelineNodes.push(<td className="time" key="time">{this.props.timeline.time}</td>);
        timelineNodes.push(
            <td className={this.props.timeline.icon + " icon"} key="icon">
                <div/>
            </td>
        );

        var single = this.props.timeline.events.length == 1;
        var clickable = !!this.props.timeline.events[0].speakers;

        var self = this;

        function buildEventCell(event, i) {
            var cellClassName = self.getEventCellClassName(clickable);
            var cellColSpan = self.getEventCellSize(single);
            var eventHeader = self.getEventHeader(event);
            var eventSubtitle = self.getEventSubtitle(event);
            var eventId = self.getEventId(i);

            timelineNodes.push(
                <td className={cellClassName} colSpan={cellColSpan} key={i} data-event-id={eventId}>
                    <header dangerouslySetInnerHTML={{__html: eventHeader}} />
                    <div className="desc">{eventSubtitle}</div>
                </td>
            );
        }

        this.props.timeline.events.forEach(buildEventCell);

        return (
            <tr className={this.props.timeline.color}>
                {timelineNodes}
            </tr>
        );
    }
});

var EventPopup = React.createClass({
    displayName: "EventPopup",
    render: function () {
        return (
            <div id="schedule-popup">
                <header>
                    <div className="close"></div>
                    <img src="assets/img/logo2.png"/>
                </header>
                <section className="content">
                    <div className="title"></div>
                    <div className="description"></div>
                    <ul className="speakers"></ul>
                </section>
            </div>
        );
    }
});

var TimelineList = React.createClass({
    getEvent: function (eventId) {
        var eventIdParts = eventId.split("#");
        var timelinePosition = eventIdParts[0];
        var eventPosition = eventIdParts[1];

        var event = this.props.timelines[timelinePosition].events[eventPosition];

        var eventSpeakers = [];
        if (event.speakers) {
            var self = this;

            function getSpeaker(speakerId) {
                eventSpeakers.push(self.props.speakers[speakerId]);
            }

            event.speakers.forEach(getSpeaker);
        }

        event.speakers = eventSpeakers;

        return event;
    },
    buildSpeakerHTMLs: function (speakers) {
        var results = [];

        function buildSpeaker(speaker) {
            var output = '<li>';
            output += '<div class="name">' + speaker.name + '</div>';
            output += '<div class="photo"><img src="assets/img/speaker-photos/' + speaker.photo + '"></div>';
            if (speaker.twitter) {
                output += '<div class="twitter"> <a href="https://twitter.com/' + speaker.twitter + '" class="twitter-follow-button" data-show-count="true" data-show-screen-name="false" data-lang="en">Follow @twitterapi</a></div>';
            }
            output += '</li>';
            results.push(output);
        }

        speakers.forEach(buildSpeaker);
        return results;
    },
    componentDidMount: function () {
        var self = this;
        $(this.getDOMNode()).on("click", "td.clickable", function () {
            var eventId = $(this).data('event-id');
            var event = self.getEvent(eventId);

            var $schedulePopup = $("#schedule-popup");
            $schedulePopup.find(".close").click($.modal.close);

            $schedulePopup.find('.speakers').html('');
            $schedulePopup.find('.title').html(event.subtitle);
            $schedulePopup.find('.description').html(event.description);
            //var speakerHTMLs = scheduleHelper.buildSpeakerHTMLs(eventInfo.speakers);
            //for (var i in speakerHTMLs) {
            //    var speakerHTML = speakerHTMLs[i];
            //    $schedulePopup.find('.speakers').append(speakerHTML);
            //}

            $schedulePopup.modal({
                onOpen: function (dialog) {
                    dialog.overlay.fadeIn('fast', function () {
                        dialog.container.slideDown('fast', function () {
                            dialog.data.fadeIn('fast');
                        });
                    });
                },
                opacity: 60,
                overlayCss: {backgroundColor: '#000000'}
            });
            $schedulePopup.css('top', '100px');
            //twttr.widgets.load();
        });
    },
    render: function () {
        var timelineRows = [];
        var self = this;

        function buildTimeline(timeline, i) {
            timelineRows.push(<Timeline timelineId={i} timeline={timeline} speakers={self.props.speakers} key={i}/>);
        }

        this.props.timelines.forEach(buildTimeline);

        return <tbody>{timelineRows}</tbody>
    }
});

var Schedule = React.createClass({
    displayName: 'Schedule',
    componentWillMount: function () {
        var self = this;
        storage.getSpeakers(function (speakers) {
            var speakersMap = {};
            speakers.forEach(function (speaker) {
                speakersMap[speaker['id']] = speaker;
            });
            storage.getSchedule(function (schedule) {
                schedule['speakers'] = speakersMap;
                self.setState(schedule);
            });
        });
    },
    render: function () {
        return (
            <div>
                <header className="huge blue">
                    <h1>Schedule</h1>
                </header>
                <article className="schedule-section">
                    <table>
                        <ScheduleRoomNames roomNames={this.state.roomNames}/>
                        <TimelineList timelines={this.state.schedule} speakers={this.state.speakers}/>
                    </table>
                </article>
                <EventPopup/>
            </div>
        );
    }
});

