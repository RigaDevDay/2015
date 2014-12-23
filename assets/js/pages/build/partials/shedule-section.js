var ScheduleRoomNames = React.createClass({
    displayName: 'ScheduleRoomNames',
    render: function () {
        var roomNameNodes = [];
        roomNameNodes.push(React.createElement("th", {key: "-2"})); // Cell for time
        roomNameNodes.push(React.createElement("th", {key: "-1"})); // Cell for icon
        this.props.roomNames.forEach(function (name, i) {
            roomNameNodes.push(React.createElement("th", {key: i}, name));
        });
        return React.createElement("tr", null, roomNameNodes);
    }
});

var Timeline = React.createClass({displayName: "Timeline",
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

        timelineNodes.push(React.createElement("td", {className: "time", key: "time"}, this.props.timeline.time));
        timelineNodes.push(
            React.createElement("td", {className: this.props.timeline.icon + " icon", key: "icon"}, 
                React.createElement("div", null)
            )
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
                React.createElement("td", {className: cellClassName, colSpan: cellColSpan, key: i, "data-event-id": eventId}, 
                    React.createElement("header", {dangerouslySetInnerHTML: {__html: eventHeader}}), 
                    React.createElement("div", {className: "desc"}, eventSubtitle)
                )
            );
        }

        this.props.timeline.events.forEach(buildEventCell);

        return (
            React.createElement("tr", {className: this.props.timeline.color}, 
                timelineNodes
            )
        );
    }
});

var EventPopup = React.createClass({
    displayName: "EventPopup",
    render: function () {
        return (
            React.createElement("div", {id: "schedule-popup"}, 
                React.createElement("header", null, 
                    React.createElement("div", {className: "close"}), 
                    React.createElement("img", {src: "assets/img/logo2.png"})
                ), 
                React.createElement("section", {className: "content"}, 
                    React.createElement("div", {className: "title"}), 
                    React.createElement("div", {className: "description"}), 
                    React.createElement("ul", {className: "speakers"})
                )
            )
        );
    }
});

var TimelineList = React.createClass({displayName: "TimelineList",
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
            timelineRows.push(React.createElement(Timeline, {timelineId: i, timeline: timeline, speakers: self.props.speakers, key: i}));
        }

        this.props.timelines.forEach(buildTimeline);

        return React.createElement("tbody", null, timelineRows)
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
            React.createElement("div", null, 
                React.createElement("header", {className: "huge blue"}, 
                    React.createElement("h1", null, "Schedule")
                ), 
                React.createElement("article", {className: "schedule-section"}, 
                    React.createElement("table", null, 
                        React.createElement(ScheduleRoomNames, {roomNames: this.state.roomNames}), 
                        React.createElement(TimelineList, {timelines: this.state.schedule, speakers: this.state.speakers})
                    )
                ), 
                React.createElement(EventPopup, null)
            )
        );
    }
});

