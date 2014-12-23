(function (root, factory) {
    "use strict";
    root.storage = factory();
}(this, function () {
    "use strict";
    var _simpleStorageAvailable = simpleStorage.canUse(),
        _defaultTTL = 1000 * 60 * 30; // 30 minutes

    var speakersEndpoint = 'data/speakers.json?v=2';
    var scheduleEndpoint = 'data/schedule.json?v=2';
    // TODO: Too much duplication?

    // Speakers
    function _sortSpeakers(speaker1, speaker2) {
        return speaker1.order < speaker2.order ? -1 : 1;
    }

    function _loadSpeakersFromLocalStorage(callback) {
        var speakers = simpleStorage.get(speakersEndpoint);
        if (speakers === undefined) {
            _loadSpeakersFromRemote(callback);
        } else {
            callback(speakers);
        }
    }

    function _loadSpeakersFromRemote(callback) {
        $.getJSON(speakersEndpoint, function (speakers) {
            speakers.sort(_sortSpeakers);
            simpleStorage.set(speakersEndpoint, speakers, _defaultTTL);
            callback(speakers);
        });
    }

    function _loadSpeakers(callback) {
        if (_simpleStorageAvailable) {
            _loadSpeakersFromLocalStorage(callback);
        } else {
            _loadSpeakersFromRemote(callback);
        }
    }

    // Schedule
    function _loadScheduleFromRemote(callback) {
        $.getJSON(scheduleEndpoint, function (schedule) {
            simpleStorage.set(scheduleEndpoint, schedule, _defaultTTL);
            callback(schedule);
        });
    }

    function _loadScheduleFromLocalStorage(callback) {
        var schedule = simpleStorage.get(scheduleEndpoint);
        if (schedule === undefined) {
            _loadScheduleFromRemote(callback);
        } else {
            callback(schedule);
        }
    }

    function _loadSchedule(callback) {
        if (_simpleStorageAvailable) {
            _loadScheduleFromLocalStorage(callback);
        } else {
            _loadScheduleFromRemote(callback);
        }
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
