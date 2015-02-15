(function (root, factory) {
    "use strict";
    root.storage = factory();
}(this, function () {
    "use strict";

    var speakersEndpoint = 'data/speakers.json?v=3';
    var scheduleEndpoint = 'data/schedule.json?v=3';
    // TODO: Too much duplication?

    function _sortSpeakers(speaker1, speaker2) {
        return speaker1.order < speaker2.order ? -1 : 1;
    }

    function _loadSpeakers(callback) {
        $.getJSON(speakersEndpoint, function (speakers) {
            speakers.sort(_sortSpeakers);
            callback(speakers);
        });
    }

    function _loadSchedule(callback) {
        $.getJSON(scheduleEndpoint, function (schedule) {
            callback(schedule);
        });
    }

    return {
        getSpeakers: function (callback) {
            _loadSpeakers(callback);
        },
        getSchedule: function (callback) {
            _loadSchedule(callback);
        }
    };
}));
