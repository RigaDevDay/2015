(function (root, factory) {
    "use strict";
    root.storage = factory();
}(this, function () {
    "use strict";
    var _simpleStorageAvailable = simpleStorage.canUse(),
        _defaultTTL = 1000 * 60 * 30; // 30 minutes

    // Speakers parts
    var speakersEndpoint = 'data/speakers.json';

    function _sortSpeakers(speaker1, speaker2) {
        return speaker1.order < speaker2.order ? -1 : 1;
    }

    function _loadSpeakersFromLocalStorage(callback) {
        var speakers = simpleStorage.get(speakersEndpoint);
        if (speakers === undefined) {
            console.log("Speakers not available in local storage. Load.")
            _loadSpeakersFromRemote(callback);
        } else {
            console.log("Get speakers from local storage");
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

    return {
        getSpeakers: function (callback) {
            _loadSpeakers(callback);
        }
    };
}));
