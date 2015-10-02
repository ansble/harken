var compare = function (item, listenerItem) {
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
    };

module.exports = compare;
