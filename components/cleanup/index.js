var eventStore = require('../store')
    , off = require('../off')

    , cleanup =function () {
            'use strict';

            Object.keys(eventStore).forEach(function (event) {
                eventStore[event].forEach(function (item) {
                    if (item.created + 120000 <= new Date()) {
                        off({
                            eventName: event
                            , scope: item.scope
                            , handler: item.call
                            , once: item.once
                        });
                    }
                });
            });
        };

module.exports = cleanup;
