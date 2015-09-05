var eventStore = require('./components/store')
    , emitter = {
        emit: function (eventNameIn, eventDataIn) {
            'use strict';

            var eventStack = eventStore[eventNameIn];

            //emit the event
            if (typeof eventStack !== 'undefined') {
                eventStack.forEach(function (listener) {
                    if (typeof listener.scope !== 'undefined') {
                        listener.call.apply(listener.scope,[eventDataIn]);
                    } else {
                        listener.call(eventDataIn);
                    }

                    if (listener.once) {
                        emitter.off({
                            eventName: eventNameIn
                            , scope: listener.scope
                            , handler: listener.call
                            , once: listener.once
                        });
                    }
                });
            }

            emitter.cleanup();
        }

        , cleanup: function () {
            'use strict';

            Object.keys(eventStore).forEach(function (event) {
                eventStore[event].forEach(function (item) {
                    if (item.created + 120000 <= new Date()) {
                        emitter.off({
                            eventName: event
                            , scope: item.scope
                            , handler: item.call
                            , once: item.once
                        });
                    }
                });
            });
        }

        , listeners: require('./components/listeners')
        , on: require('./components/on')

        , once: function (eventNameIn, handlerIn, scopeIn) {
            'use strict';

            //same thing as .on() but is only triggered once
            var that = this;

            if (typeof eventNameIn === 'object') {
                eventNameIn.once = true;
                that.on(eventNameIn);
            } else {
                that.on({
                    eventName: eventNameIn
                    , handler: handlerIn
                    , scope: scopeIn
                    , once: true
                });
            }
        }

        , removeAllListeners: function (eventNameIn) {
            'use strict';

            this.off(eventNameIn);
        }

        , off:  function (eventNameIn, handlerIn, onceIn, scopeIn) {
            'use strict';
            //localize variables
            var eventName = eventNameIn
                , handler = handlerIn
                , once = onceIn
                , scope = scopeIn;

            if (typeof eventNameIn === 'object') {
                // passed in a collection of params instead of params
                eventName = eventNameIn.eventName;
                handler = eventNameIn.handler;
                once = eventNameIn.once;
                scope = eventNameIn.scope;
            }

            if (typeof eventStore[eventName] === 'undefined') {
                //if there is no event with that name... return nothing
                return;
            }

            if (typeof handler !== 'undefined') {
                //there is an event that matches... proceed
                eventStore[eventName] = eventStore[eventName].filter(function(listener){
                    var isMatch = (handler.toString() === listener.call.toString());

                    //function is passed in
                    if (typeof scope !== 'undefined') {
                        //scope is passed in...
                        isMatch = !!(isMatch && scope);

                        if (typeof once === 'boolean') {
                            // function + scope + once provides the match
                            isMatch = !!(isMatch && once === listener.once);
                        }
                    } else if (typeof once === 'boolean'){
                        isMatch = !!( isMatch && listener.once === once);
                    }

                    return !isMatch;
                });

            } else {
                //no function unbind everything by resetting
                eventStore[eventName] = [];
            }
        }

        , required: require('event-state')
    };

emitter.addListener = emitter.on;
emitter.removeListener = emitter.off;

module.exports = emitter;
