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

            // 当前迭代
            this._currentIteration = isAtEndOfIterations
                ? (elapsedTime / duration - 1)
                : Math.floor(elapsedTime / duration);

            var localTime = isAtEndOfIterations
                ? duration
                : (elapsedTime % duration);

            localTime = this.isCurrentDirectionForwards()
                ? localTime
                : duration - localTime;

            // 比例
            this._timeFraction = this._timingFunction(localTime / duration);
        };

        Time.prototype.isCurrentDirectionForwards = function () {
            var isForwards;

            switch (this.direction) {
                // 正向
                case 'normal':
                    isForwards = true;
                    break;
                // 反向
                case 'reverse':
                    isForwards = false;
                    break;
                // 偶数次正向，奇数次反向
                case 'alternate':
                    isForwards = this._currentIteration % 2 === 0;
                    break;
                // 偶数次相反向，奇数次正向
                case 'alternate-reverse':
                    isForwards = (this._currentIteration + 1) % 2 === 0;
                    break;
            }

            return isForwards;
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
