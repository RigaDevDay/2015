(function (root, factory) {
    "use strict";
    root.country = factory();
}(this, function () {
    "use strict";

    return {
        nameToShortcode: function (countryName) {
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
        }
    };
}));
