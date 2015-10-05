var eventStore = require('../store')
    , emptyScope = {}
    , compare = require('../compare')

    , on = function(eventNameIn, handlerIn, scopeIn, onceIn) {
        'use strict';

        var newCheck
            , eventStack

            //attribute holders and such
            , eventName = eventNameIn
            , handler = handlerIn
            , scope = scopeIn || emptyScope
            , once = onceIn || false;

        if (typeof eventNameIn === 'object') {
            //we have an object to split up dude
            eventName = eventNameIn.eventName;
            handler = eventNameIn.handler;
            scope = eventNameIn.scope || scope;
            once = eventNameIn.once || false;
        }

        eventStack = eventStore[eventName];

        if (Array.isArray(eventStack)) {
            //already exists check to see if the function is already bound
            //  using .find here to speed up detection of matchs
            //  .find gets returned as soon as it returns true
            //  the downside to this decision is it returns the object and not a bool
            //  I think the upside beats the downside of the comparison below
            //  especially as the size of the stack grows.
            newCheck = eventStack.find(function (listener) {
                return  (compare(handler, listener.call) && compare(once, listener.once) && compare(scope, listener.scope));
            });

            if (typeof newCheck !== 'object') {
                eventStack.push({once: once, call: handler, scope: scope, created: new Date()});
            }

        } else {
            //new event
            eventStore[eventName] = [{once: once, call: handler, scope: scope, created: new Date()}];
        }
    };

module.exports = on;
