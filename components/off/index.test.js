var assert = require('chai').assert
    , subject = require('./index')
    , eventStore = require('../store');

describe('off::tests', function () {
    'use strict';

    beforeEach(function() {
        eventStore['test-event'] = [
            {
                call: function () {}
                , once: true
                , scope: {}
                , created: new Date()
            }
            , {
                call: function () {}
                , once: false
                , scope: {}
                , created: new Date()
            }
        ];

        eventStore['test-ey'] = [
            {
                call: function () {}
                , once: true
                , scope: {}
                , created: new Date()
            }
            , {
                call: function () {}
                , once: false
                , scope: {}
                , created: new Date()
            }
        ];
    });

    it('should have  be a function', function () {
        assert.isFunction(subject);
    });

    it('should eliminate all listeners to an event when called without function', function () {
        subject('test-event');
        assert.strictEqual(eventStore['test-event'].length, 0);
    });

    it('should eliminate only listeners that match the params passed in', function () {
        subject('test-event', function () {}, true);
        assert.strictEqual(eventStore['test-event'].length, 1);

        subject('test-ey', function () {});
        assert.strictEqual(eventStore['test-ey'].length, 0);
    });
});
