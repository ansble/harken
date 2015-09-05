var on = require('./components/on')
    , off = require('./components/off');

module.exports = {
        emit: require('./components/emit')

        , cleanup: require('./components/cleanup')
        , listeners: require('./components/listeners')

        , required: require('event-state')

        , on: on
        , addListener: on
        , once: function (eventNameIn, handlerIn, scopeIn) {
            'use strict';

            //same thing as .on() but is only triggered once
            if (typeof eventNameIn === 'object') {
                eventNameIn.once = true;
                on(eventNameIn);
            } else {
                on({
                    eventName: eventNameIn
                    , handler: handlerIn
                    , scope: scopeIn
                    , once: true
                });
            }
        }

        , off: off
        , removeListener: off
        , removeAllListeners: function (eventNameIn) {
            'use strict';

            off(eventNameIn);
        }
    };
