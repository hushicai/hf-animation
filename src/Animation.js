/**
 * @file 动画调度器，在具体的业务中，全局应该只有一个Animation实例。
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function (require) {
        var extend = require('hf-util/extend');
        var timeline = require('./timeline');

        function Animator(options) {
            this.target = null;
            this.keyframe = null;
            extend(this, options);
        }

        Animator.prototype.start = function (options) {
            this.keyframe.addTarget(this.target);
            timeline.add(this.keyframe);
            return this;
        };
        Animator.prototype.stop = function () {};

        /**
         * 动画
         *
         * @constructor
         * @param {Object} options 配置项
         */
        function Animation(options) {
            extend(this, options);
        }

        Animation.prototype.animate = function (target, keyframes, timingInput) {
            var options = extend({}, timingInput);
            options.keyframes = keyframes;

            var Keyframe = require('./Keyframe');
            var keyframe = new Keyframe(options);

            // 是否可以接管target的frame？
            // 统一在stage中update？

            return new Animator({
                target: target,
                keyframe: keyframe
            });
        };

        // 开启动画主循环
        Animation.prototype.start = function () {
            timeline.start();
            return this;
        };

        return Animation;
    }
);
