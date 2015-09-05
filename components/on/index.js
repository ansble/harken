var eventStore = require('../store')
    , emptyScope = {}
    , compare = function (item, listenerItem) {
        'use strict';
        var same = true
            , type = typeof item
            , listenerType = typeof listenerItem;

        if (type !== 'undefined' && listenerType !== 'undefined') {
            if(type === 'object'){
                //this is scope and if the structure is the same that is
                //  not enough. The actual object must be the same here
                same = (item === listenerItem);
            } else if (type === 'function') {
                same = item.toString() === listenerItem.toString();
            } else {
                same = item === listenerItem;
            }
        }

        return same;
    }

    , on = function(eventNameIn, handlerIn, scopeIn, onceIn){
        'use strict';

        var newCheck = true

            //attribute holders and such
            , eventName = eventNameIn
            , handler = handlerIn
            , scope = scopeIn || emptyScope
            , once = onceIn || false

            //variables for later
            , eventStack;

        if (typeof eventNameIn === 'object') {
            //we have an object to split up dude
            eventName = eventNameIn.eventName;
            handler = eventNameIn.handler;
            scope = eventNameIn.scope || scope;
            once = eventNameIn.once || false;
        }

        eventStack = eventStore[eventName];

        if (typeof eventStack !== 'undefined') {
            //already exists check to see if the function is already bound
            eventStack.some(function (listener) {
                if(compare(handler, listener.call) && compare(once, listener.once) && compare(scope, listener.scope)){
                    newCheck = false;
                    return true;
                }
            });

            if (newCheck) {
                eventStack.push({once: once, call: handler, scope: scope, created: new Date()});
            }

        } else {
            //new event
            eventStore[eventName] = [{once: once, call: handler, scope: scope, created: new Date()}];
        }
    };

module.exports = on;
