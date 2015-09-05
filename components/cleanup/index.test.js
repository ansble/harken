var assert = require('chai').assert
    , subject = require('./index')
    , eventStore = require('../store');

describe('cleanup::tests', function () {
    'use strict';

    it('should have  be a function', function () {
        assert.isFunction(subject);
    });

    it('should remove any lingering listeners over the age of 120000ms');
});
