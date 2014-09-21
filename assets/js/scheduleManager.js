var scheduleManager = {
    
    table: '#schedule > article > table',
    speakers: {},
    
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
        }
    },
    
    // Constructing the widget
    loadSection: function() {
        speakerManager.getSpeakers(function(speakers) {
            scheduleManager.initSpeakers(speakers);
            scheduleManager.getSchedule(function(schedule) {
                var roomNames = scheduleHelper.getRoomNames(schedule);
                scheduleManager.displayRoomNames(roomNames, function() {
                    var timeLines = scheduleHelper.getTimelines(schedule);
                    scheduleManager.displayTimelines(timeLines, function() {
                        scheduleManager.displayWidget();
                    });
                });
            });
        });
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
                    output += '<td class="content">';
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
};