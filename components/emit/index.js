var eventStore = require('../store')
    , off = require('../off')
    , cleanup = require('../cleanup')

    , emit = function (eventNameIn, eventDataIn) {
        'use strict';

        var eventStack = eventStore[eventNameIn];

        //emit the event
        if (typeof eventStack !== 'undefined') {
            eventStack.forEach(function (listener) {

                listener.call.apply(listener.scope,[eventDataIn]);

                if (listener.once) {
                    off({
                        eventName: eventNameIn
                        , scope: listener.scope
                        , handler: listener.call
                        , once: listener.once
                    });
                }
            });
        }

        cleanup();
    };

module.exports = emit;
