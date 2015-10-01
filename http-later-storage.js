var EventEmitter = require("events").EventEmitter,
    prop = require("propertize"),
    mixin = require("objektify").mixin;

/**
 * Log task callback.
 * @callback doneCallback
 * @param {Error} err
 */

/**
 * Queue task callback
 * @callback queueTaskCallback
 * @param {Error} err
 * @param {string} key
 */

/**
 * Queue task.
 * @callback queueTask
 * @param {object} task
 * @param {queueTaskCallback} done
 */

/**
 * Unqueue task callback
 * @callback unqueueTaskCallback
 * @param {Error} err
 * @param {object} task
 * @param {string} key
 */

/**
 * Unqueue a task.
 * @callback unqueueTask
 * @param {unqueueTaskCallback} done
 */

/**
 * Log task result
 * @callback logResult
 * @param {string} key
 * @param {object} result
 * @param {doneCallback} done
 */

/**
 * Create http-later storage driver.
 * @param {object} [defaults]
 * @param {queueTask} queue
 * @param {unqueueTask} unqueue
 * @param {logResult} log
 * @returns {function}
 */
function createStorage(defaults, queue, unqueue, log) {
    if (typeof defaults !== "object") {
        log = unqueue;
        unqueue = queue;
        queue = defaults;
        defaults = {};
    }

    /**
     * @constructor
     * @param {object} [opts]
     */
    function Storage(opts) {
        mixin(mixin(this, opts), defaults);
    }

    /**
     * @name Storage#queue
     * @method
     * @param {object} task
     * @param {queueTaskCallback} [done]
     */
    Storage.prototype.queue = function(task, done) {
        switch (arguments.length) {
            case 0: throw new TypeError("expected task");
            case 1: arguments[1] = function() {};
        }
        
        queue.apply(this, arguments);
    };

    /**
     * @name Storage#unqueue
     * @method
     * @param {unqueueTaskCallback} [done]
     */
    Storage.prototype.unqueue = function(done) {
        switch (arguments.length) {
            case 0: arguments[0] = function() {};
        }

        unqueue.apply(this, arguments);
    };

    /**
     * @name Storage#log
     * @method
     * @param {string} key
     * @param {object} result
     * @param {functon} [done]
     */
    Storage.prototype.log = function(key, result, done) {
        switch (arguments.length) {
            case 0: throw new TypeError("expected key");
            case 1: throw new TypeError("expected results");
            case 2: arguments[2] = function() {};
        }

        log.apply(this, arguments);
    };

    // return new Storage class
    return Storage;

};

/** export factory function */
module.exports = createStorage;
