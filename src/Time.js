/**
 * @file Time
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function (require) {
        /**
         * Time
         *
         * @constructor
         * @param {Object} options 配置项
         */
        function Time(options) {
            this.duration = options.duration || 0;
            this.easing = options.easing || 'linear';
            this.direction = options.direction || 'normal';
            this.iterations = options.iterations || 1;
            this.beginDelay = options.beginDelay || 0;
            this.endDelay = options.endDelay || 0;

            this._activeDuration = this.duration * this.iterations;
            this._elapsedTime = 0.0;
            this._startTime = 0.0;
            this._endTime = this._startTime + this.beginDelay + this._activeDuration + this.endDelay;

            this._currentIteration = 0;

            this._timeFraction = 0.0;
        }

        /**
         * 更新时间戳
         *
         * @param {number} dt 时间戳
         * @virtual
         */
        Time.prototype.update = function (dt) {};

        /**
         * 每一帧
         *
         * @virtual
         */
        Time.prototype.frame = function () {
            this.emit('frame', this._timeFraction);
        };

        Time.prototype.done = function () {
            this.emit('done');
        };

        /**
         * 是否结束
         *
         * @virtual
         */
        Time.prototype.isFinished = function () {};

        require('hf-emitter').mixin(Time.prototype)

        return Time;
    }
);
