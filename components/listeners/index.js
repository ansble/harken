var eventStore = require('../store');

module.exports = function (eventName) {
    'use strict';

    return eventStore[eventName];
};
