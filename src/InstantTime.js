/**
 * @file 即时
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function (require) {
        var inherits = require('hf-util/inherits');
        var Time = require('./Time');

        function InstantTime(options) {
            options = options || {};
            options.duration = 0;
            options.iterations = 1;
            Time.call(this, options);
        }

        InstantTime.prototype.update = function () {
            this._timeFraction = 1;
        };

        InstantTime.prototype.isFinished = function () {
            return true;
        };
        inherits(InstantTime, Time);
        return InstantTime;
    }
);
