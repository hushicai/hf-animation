/**
 * @file Animation
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function (require) {
        var easing = require('./easing');
        var inherits = require('hf-util/inherits');
        var IntervalTime = require('./IntervalTime');

        var timeline = require('./timeline');

        /**
         * 动画
         *
         * @constructor
         * @param {Object} options 配置项
         */
        function Animation(options) {
            IntervalTime.call(this, options);
            this._targetList = [];
        }

        Animation.prototype.frame = function () {
            var targetList = this._targetList;
            for (var i = 0, len = targetList.length; i < len; i++) {
                this.sampleForTarget(targetList[i]);
            }
        };

        Animation.prototype.sampleForTarget = function (target) {};

        Animation.prototype.startWithTarget = function (target) {
            if (!this.hasTarget(target)) {
                this._targetList.push(target);
            }

            // add to timeline
            timeline.play(this);

            return this;
        };

        Animation.prototype.hasTarget = function (target) {
            return this._targetList.indexOf(target) >= 0;
        };

        Animation.prototype.dispose = function () {
            this._targetList.length = 0;
            this._targetList = null;
        };

        inherits(Animation, IntervalTime);

        return Animation;
    }
);
