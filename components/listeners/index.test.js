var assert = require('chai').assert
    , subject = require('./index')
    , eventStore = require('../store');

describe('listeners::tests', function () {
    'use strict';

    it('should have  be a function', function () {
        assert.isFunction(subject);
    });

    it('should return an array of all listeners', function () {
        eventStore['some-event'] = [{call: function () {}}];

        assert.isArray(subject('some-event'));
        assert.lengthOf(subject('some-event'), 1);
    });
});
