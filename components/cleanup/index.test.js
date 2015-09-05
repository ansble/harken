var assert = require('chai').assert
    , subject = require('./index')
    , eventStore = require('../store');

describe('cleanup::tests', function () {
    'use strict';

    it('should have  be a function', function () {
        assert.isFunction(subject);
    });

    it('should remove any lingering once listeners over the age of 1200000ms', function () {
        eventStore['test-event'] = [{
            handler: function(){}
            , scope: {}
            , once: true
            , created: new Date('12/10/1983')
        }];
        assert.strictEqual(eventStore['test-event'].length, 1);

        subject();

        assert.strictEqual(eventStore['test-event'].length, 0);
    });

    it('should not remove any lingering non-once listeners over the age of 1200000ms', function () {
        eventStore['test-event'] = [{
            handler: function(){}
            , scope: {}
            , once: false
            , created: new Date('12/10/1983')
        }];
        assert.strictEqual(eventStore['test-event'].length, 1);

        subject();

        assert.strictEqual(eventStore['test-event'].length, 1);
    });
});
