var scheduleManager = {

    table: '#schedule > article > table',
    speakers: {},
    schedule: null,

    // Adding cell captions to schedule table
    displayRoomNames: function(roomNames, callback) {
        var newRow = '';
        newRow += '<tr>';
        newRow += '<th></th>'; // Empty header cell for time
        newRow += '<th></th>'; // Empty header cell for icons
        for (var i in roomNames) {
            newRow += '<th>' + roomNames[i] + '</th>';
        }
        newRow += '</tr>';

        $(scheduleManager.table).append(newRow);

        if (typeof(callback) == typeof(Function)) {
            callback();
        }
    },

    displayTimelines: function(timeLines, callback) {
        for (var i in timeLines) {
            var timeLine = timeLines[i];

            var output = '<tr class="' + timeLine.color + '">';
            output += scheduleHelper.buildTimeCell(timeLine);
            output += scheduleHelper.buildIconCell(timeLine);
            output += scheduleHelper.buildEventCells(timeLine);
            output += '</tr>';

            $(scheduleManager.table).append(output);
        }

        if (typeof(callback) == typeof(Function)) {
            callback();
        }
    },

    initSpeakers: function(speakers) {
        for (var i in speakers) {
            var speaker = speakers[i];
            scheduleManager.speakers[speaker.id] = {};
            scheduleManager.speakers[speaker.id].name = speaker.name;
            scheduleManager.speakers[speaker.id].twitter = speaker.contacts.twitter;
        }
    },

    initEventHandlers: function() {
        $(scheduleManager.table + ' td').click(function() {
            var id = $(this).data('id');
            if (id) {
                $('#schedule-popup .speakers').html('');
                var eventInfo = scheduleManager.getEventInfo(id);
                $('#schedule-popup .title').html(eventInfo.title);
                $('#schedule-popup .description').html(eventInfo.description);
                var speakerHTMLs = scheduleHelper.buildSpeakerHTMLs(eventInfo.speakers);
                for (var i in speakerHTMLs) {
                    var speakerHTML = speakerHTMLs[i];
                    $('#schedule-popup .speakers').append(speakerHTML);
                }
                twttr.widgets.load();
                $('#schedule-popup').modal({
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
                $('#schedule-popup').css('top', '100px');
            }
        });
    },

    getEventInfo: function(id) {
        var schedule = scheduleManager.schedule.schedule;
        var event;
        // Getting event by id
        searchLoop: for (var i in schedule) {
            var timeLine = schedule[i];
            for (var j in timeLine.events) {
                if (timeLine.events[j].id == id) {
                    event = timeLine.events[j];
                    break searchLoop;
                }
            }
        }

        // Preparing event info result
        var result = {};
        result.speakers = [];
        for (var i in event.speakers) {
            var speakerId = event.speakers[i];
            result.speakers.push({
                name: scheduleManager.speakers[speakerId].name,
                photo: speakerId + '.png',
                twitter: scheduleManager.speakers[speakerId].twitter
            });
            result.title = event.subtitle;
            result.description = event.description;
        }
        return result;
    },

    // Constructing the widget
    loadSection: function() {
        speakerManager.getSpeakers(function(speakers) {
            scheduleManager.initSpeakers(speakers);
            scheduleManager.getSchedule(function(schedule) {
                scheduleManager.initSchedule(schedule);
                var roomNames = scheduleHelper.getRoomNames(scheduleManager.schedule);
                scheduleManager.displayRoomNames(roomNames, function() {
                    var timeLines = scheduleHelper.getTimelines(scheduleManager.schedule);
                    scheduleManager.displayTimelines(timeLines, function() {
                        scheduleManager.displayWidget();
                        scheduleManager.initEventHandlers();
                    });
                });
            });
        });
    },

    // Saving schedule to object property
    initSchedule: function(scheduleObj) {
        var schedule = scheduleObj.schedule;
        var id = 0;
        for (var i in schedule) {
            var timeLine = schedule[i];
            for (var j in timeLine.events) {
                var event = timeLine.events[j];
                if (event) {
                    event.id = ++id;
                }
                schedule[i].events[j] = event;
            }
        }
        scheduleObj.schedule = schedule;
        scheduleManager.schedule = scheduleObj;
    },

    // Getting schedule from JSON file
    getSchedule: function(callback) {
        $.getJSON('data/schedule.json', function(schedule) {
            if (typeof(callback) == typeof(Function)) {
                callback(schedule);
            }
        });
    },

    // Hidding loader, Showing schedule table
    displayWidget: function() {
        $("#schedule .loader").css('display', 'none');
        $(scheduleManager.table).css('display', 'table');
    }
};

// Helps to get data from schedule object
var scheduleHelper = {
    getRoomNames: function(jsonObj) {
        return jsonObj.roomNames;
    },

    getTimelines: function(jsonObj) {
        var timeLines = jsonObj.schedule;

        // If the event is common for all auditories,
        // Setting single to true
        for (var i in timeLines) {
            var timeLine = timeLines[i];
            if (timeLine.events.length == 1) {
                timeLine.single = true;
            }
            else {
                timeLine.single = false;
            }
            timeLines[i] = timeLine;
        }
        return timeLines;
    },

    buildTimeCell: function(timeLine) {
        return '<td class="time">' + timeLine.time + '</td>';
    },

    buildIconCell: function(timeLine) {
        return '<td class="' + timeLine.icon + ' icon"><div></div></td>';
    },

    buildEventCells: function(timeLine) {
        var output = '';

        if (timeLine.single) {
            output += '<td class="unique content" colspan="5">';
            output += '     <header>' + timeLine.events[0].title + '</header>';
            if (timeLine.events[0].subtitle) {
                output += '<div class="desc">' + timeLine.events[0].subtitle + '</div>';
            }
            output += '</td>';

        }
        else {
            for (var i in timeLine.events) {
                var event = timeLine.events[i];
                if (event) {
                    output += '<td class="clickable content" data-id="' + event.id + '">';
                    var speakerNames = [];
                    for (var i in event.speakers) {
                        speakerNames.push(scheduleManager.speakers[event.speakers[i]].name);
                    }
                    var title = speakerNames.join(',<br />');
                    output += '     <header>' + title + '</header>';
                    if (event.subtitle) {
                        output += '<div class="desc">' + event.subtitle + '</div>';
                    }
                    output += '</td>';
                }
                else {
                    output += '<td class="locked content">Unlocked Soon</td>';
                }
            }
        }

        return output;
    },

    buildSpeakerHTMLs: function(speakers) {
        var results = [];
        for (var i in speakers) {
            var output = '<li>';
            var speaker = speakers[i];
            output += '<div class="name">' + speaker.name + '</div>';
            output += '<div class="photo"><img src="assets/img/speaker-photos/' + speaker.photo + '"></div>';
            if(speaker.twitter) {
                output += '<div class="twitter"> <a href="https://twitter.com/' + speaker.twitter + '" class="twitter-follow-button" data-show-count="true" data-show-screen-name="false" data-lang="en">Follow @twitterapi</a></div>';
            }
            output += '</li>';
            results.push(output);
        }
        return results;
    },
};
