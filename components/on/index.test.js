var assert = require('chai').assert
    , subject = require('./index')
    , eventStore = require('../store');

describe('on::tests', function () {
    'use strict';

    it('should have  an "on" function', function () {
        assert.isFunction(subject);
    });

    afterEach(function () {
        eventStore['some-event'] = [];
    });

    it('should allow an object with named keys instead of function params', function () {
        assert.strictEqual(eventStore['some-event'].length, 0);

        subject({
            eventName: 'some-event'
            , handler: function () {}
            , scope: {}
            , once: true
        });

        assert.strictEqual(eventStore['some-event'].length, 1);
    });

    it('should allow an object with named keys instead of function params for just once and handler', function () {
        assert.strictEqual(eventStore['some-event'].length, 0);

        subject({
            eventName: 'some-event'
            , handler: function () {}
            , once: true
        });

        assert.strictEqual(eventStore['some-event'].length, 1);
    });

    it('should allow an object with named keys instead of function params for just handler', function () {
        assert.strictEqual(eventStore['some-event'].length, 0);

        subject({
            eventName: 'some-event'
            , handler: function () {}
        });

        assert.strictEqual(eventStore['some-event'].length, 1);
    });

    it('should be able to add additional listeners to the same event', function () {
        assert.strictEqual(eventStore['some-event'].length, 0);

        subject({
            eventName: 'some-event'
            , handler: function () {}
        });

        subject({
            eventName: 'some-event'
            , handler: function () {
                console.log(this.some);
            }
            , scope: {some: true}
        });

        subject('some-event', function () {}, {test: true});

        assert.strictEqual(eventStore['some-event'].length, 3);
    });

    it('should not add a new listener that is indentical to an old listener', function () {
        var scope = {test: true};

        assert.strictEqual(eventStore['some-event'].length, 0);

        subject('some-event', function () {}, scope);
        subject('some-event', function () {}, scope);
        subject({
            eventName: 'some-event'
            , handler: function () {}
            , scope: scope
        });

        assert.strictEqual(eventStore['some-event'].length, 1);

        subject('some-event', function () {});
        subject({
            eventName: 'some-event'
            , handler: function () {}
        });

        assert.strictEqual(eventStore['some-event'].length, 2);
    });
});
