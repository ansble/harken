var eventStore = require('../store')

    , off = function (eventNameIn, handlerIn, onceIn, scopeIn) {
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

            if (typeof eventStore[eventName] !== 'undefined') {
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
        };

module.exports = off;
