var assert = require('chai').assert
    , subject = require('./index');

describe('store::tests', function () {
    'use strict';

    it('should export an object function', function () {
        assert.isObject(subject);
    });
});
