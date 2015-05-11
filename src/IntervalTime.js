/**
 * @file IntervalTime
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function (require) {
        var inherits = require('hf-util/inherits');
        var Time = require('./Time');
        var easing = require('./easing');

        function IntervalTime(options) {
            options = options || {};
            options.duration = options.duration || 1000;

            Time.call(this, options);

            if (typeof this.easing === 'function') {
                this._timingFunction = this.easing;
            }
            else {
                this._timingFunction = easing[this.easing];
            }
        }

        /**
         * @override
         */
        IntervalTime.prototype.update = function (dt) {
            this._elapsedTime += dt;

            var elapsedTime = this._elapsedTime;
            var beginDelay = this.beginDelay;
            var endDelay = this.endDelay;
            var activeDuration = this._activeDuration;

            // 修正时间
            if (elapsedTime < beginDelay) {
                elapsedTime = 0;
            }
            else if (elapsedTime < beginDelay + activeDuration) {
                elapsedTime -= beginDelay;
            }
            else if (elapsedTime < this._endTime) {
                elapsedTime -= beginDelay - endDelay;
            }
            else {
                elapsedTime = activeDuration;
            }

            var duration = this.duration;
            var isAtEndOfIterations = (elapsedTime === activeDuration);
            var localTime = isAtEndOfIterations
                ? duration
                : (elapsedTime % duration);

            // 比例
            this._timeFraction = this._timingFunction(localTime / duration);
        };

        /**
         * @override
         */
        IntervalTime.prototype.isFinished = function () {
            return this._elapsedTime >= this._endTime;
        };

        inherits(IntervalTime, Time);

        return IntervalTime;
    }
);
