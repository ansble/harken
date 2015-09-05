var assert = require('chai').assert
    , subject = require('./index')
    , eventStore = require('../store');

describe('emit::tests', function () {
    'use strict';
    var numberArray = [];

    beforeEach(function () {
        eventStore['test-event'] = [
            {
                call: function (numberIn) {
                    numberArray[0] = numberIn + 2;
                }
                , scope: {}
                , once: true
                , created: new Date()
            }
            , {
                call: function (numberIn) {
                    numberArray[1] = numberIn + 1;
                }
                , scope: {}
                , once: false
                , created: new Date('12/10/1983')
            }
            , {
                call: function (numberIn) {
                    numberArray[2] = numberIn + 3;
                }
                , scope: {}
                , once: true
                , created: new Date('12/10/1983')
            }
            , {
                call: function (numberIn) {
                    numberArray[3] = this.num + 3;
                }
                , scope: {
                    num: 2
                }
                , once: false
                , created: new Date('12/10/1983')
            }
        ];
    });

    it('should  be a function', function () {
        assert.isFunction(subject);
    });

    it('should execute all of the listeners for a given event', function (done) {
        subject('test-event', 1);

        setTimeout(function () {
            assert.strictEqual(numberArray[0], 3);
            assert.strictEqual(numberArray[1], 2);
            assert.strictEqual(numberArray[2], 4);
            done();
        }, 0);
    });

    it('should execute remove "once" and expired listeners for a given event after executing', function (done) {
        subject('test-event', 1);

        setTimeout(function () {
            assert.strictEqual(numberArray[0], 3);
            assert.strictEqual(numberArray[1], 2);
            assert.strictEqual(numberArray[2], 4);

            assert.strictEqual(eventStore['test-event'].length, 2);
            done();
        }, 0);
    });

    it('should execute all of the listeners for a given event with correct scope', function (done) {
        subject('test-event', 1);

        setTimeout(function () {
            assert.strictEqual(numberArray[0], 3);
            assert.strictEqual(numberArray[1], 2);
            assert.strictEqual(numberArray[2], 4);
            assert.strictEqual(numberArray[3], 5);
            done();
        }, 0);
    });
});
