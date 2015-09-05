var assert = require('chai').assert
    , eventStore = require('./components/store')
    , emitter = require('./index')
    , test;

describe('Event Tests', function () {
    'use strict';

    beforeEach(function () {
        test = true;
    });

    afterEach(function () {
        Object.keys(eventStore).forEach(function (key) {
            emitter.off(key);
        });
    });

    describe('.addListener tests', function () {
        it('should be the same function as .on', function () {
            assert.strictEqual(emitter.on, emitter.addListener);
        });
    });

    describe('.on tests', function () {
        it('should have  an "on" function', function () {
            assert.isFunction(emitter.on);
        });

        it('should execute the callback passed to "on" when an event is triggered', function (done) {
            emitter.on('some-event', function () {
                assert.strictEqual(true, true);
                done();
            });

            emitter.emit('some-event');
        });

        it('should execute the callback passed to "on" when an event is triggered and recieve data', function (done){
            emitter.on('some-event', function (data) {
                assert.isObject(data);
                done();
            });

            emitter.emit('some-event', {name: 'Tom Sawyer'});
        });

        it('should execute the callback passed to "on" with the scope passed in', function (done){
            emitter.on('some-event', function (data) {
                assert.strictEqual(data.name, this.name);
                done();
            }, {name: 'Tom Sawyer'});

            emitter.emit('some-event', {name: 'Tom Sawyer'});
        });

        it('should execute the callback passed to "on" with the scope passed only once when flagged', function (done){
            var count = 0;

            emitter.on('some-event', function () {
                count++;

            }, {}, true);

            emitter.on('some-other-event', function () {
                assert.strictEqual(count, 1);
                done();
            });

            emitter.emit('some-event');
            emitter.emit('some-event');

            emitter.emit('some-other-event');
        });

        it('should allow an object with named keys instead of function params', function (done) {
            var count = 0;

            emitter.on({
                eventName: 'some-event'
                , handler: function () {
                    count++;

                }
                , scope: {}
                , once: true
            });

            emitter.on('some-other-event', function () {
                assert.strictEqual(count, 1);
                done();
            });

            emitter.emit('some-event');
            emitter.emit('some-event');

            emitter.emit('some-other-event');
        });

        it('should allow an object with named keys instead of function params for just once and handler', function (done) {
            var count = 0;

            emitter.on({
                eventName: 'some-event'
                , handler: function () {
                    count++;

                }
                , once: true
            });

            emitter.on('some-other-event', function () {
                assert.strictEqual(count, 1);
                done();
            });

            emitter.emit('some-event');
            emitter.emit('some-event');

            emitter.emit('some-other-event');
        });

        it('should allow an object with named keys instead of function params for just handler', function (done) {
            var count = 0;

            emitter.on({
                eventName: 'some-event'
                , handler: function () {
                    count++;

                }
            });

            emitter.on('some-other-event', function () {
                assert.strictEqual(count, 2);
                done();
            });

            emitter.emit('some-event');
            emitter.emit('some-event');
            emitter.emit('some-other-event');
        });

        it('should be able to add additional listeners to the same event');
        it('should handle an object for params and use the correct scope for the callback');
    });

    describe('.once tests', function () {
        it('should have  a "once" function', function () {
            assert.isFunction(emitter.once);
        });

        it('should add an item to the eventStore with once set when called with positional params', function () {
            emitter.once('test', function () {}, {});

            assert.strictEqual(eventStore.test.length, 1);
            assert.strictEqual(eventStore.test[0].once, true);
        });

        it('should add an item to the eventStore with once set when called with object hash', function () {
            emitter.once({
                eventName: 'tests'
                , call: function () {}
                , scope: {}
            });

            assert.strictEqual(eventStore.tests.length, 1);
            assert.strictEqual(eventStore.tests[0].once, true);
        });
    });

    it('should have  an "removeListener" function', function () {
        assert.isFunction(emitter.removeListener);
    });

    it('should have  an "removeAllListeners" function', function () {
        assert.isFunction(emitter.removeAllListeners);
    });

    it('should have  an "emit" function', function () {
        assert.isFunction(emitter.emit);
    });

    describe('listeners function tests', function () {
        it('should have  an "listeners" function', function () {
            assert.isFunction(emitter.listeners);
        });

        it('should return an array of all listeners', function () {
            emitter.on('some-event', function () {
                test = false;
            });

            assert.isArray(emitter.listeners('some-event'));
            assert.lengthOf(emitter.listeners('some-event'), 1);
        });
    });

    it('should have  an "addListener" function', function () {
        assert.isFunction(emitter.addListener);
    });

    it('should have  a "required" function', function () {
        assert.isFunction(emitter.required);
    });

    describe('.off tests', function () {
        it('should have  an "off" function', function () {
            assert.isFunction(emitter.off);
        });

        it('should eliminate all listeners to an event when called without function', function (done) {
            emitter.on('some-event', function () {
                test = false;
            });

            emitter.off('some-event');

            emitter.emit('some-event');

            setTimeout(function () {
                assert.strictEqual(test, true);
                done();
            }, 1);
        });

    });

    describe('.removeListener tests', function () {
        it('should be the same function as .off', function () {
            assert.strictEqual(emitter.off, emitter.removeListener);
        });
    });

    describe('RemoveAllListeners tests', function () {
        it('should have  a "removeAllListeners" function', function () {
            assert.isFunction(emitter.removeAllListeners);
        });

        it('should eliminate all listeners to an event when called', function (done) {
            test = true;

            emitter.on('some-event', function () {
                test = false;
            });

            emitter.on('some-event', function () {
                test = !!test;
            });

            emitter.removeAllListeners('some-event');

            emitter.emit('some-event');

            setTimeout(function () {
                assert.strictEqual(test, true);
                done();
            }, 0);
        });

    });
});
