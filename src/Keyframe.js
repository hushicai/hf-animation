/**
 * @file Keyframe
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function (require) {
        var inherits = require('hf-util/inherits');

        function isDefinedAndNotNull(val) {
            return val !== undefined && val !== null;
        }

        function FrameInternal(options) {
            this.offset = options.offset === undefined ? null : options.offset;
            delete options.offset;

            this.properties = {};
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    this.properties[key] = options[key];
                }
            }
        }

        function distributedFrames(frames) {
            frames = frames || [];
            for (var i = 0, len = frames.length; i < len; i++) {
                frames[i] = new FrameInternal(frames[i]);
            }
            var length = frames.length;

            // 计算offset
            if (length > 1 && !(frames[0].offset)) {
                frames[0].offset = 0;
            }
            if (length > 0 && !(frames[length - 1].offset)) {
                frames[length - 1].offset = 1;
            }
            var lastOffsetIndex = 0;
            var nextOffsetIndex = 0;
            for (var i = 1; i < frames.length - 1; i++) {
                var frameInternal = frames[i];
                if (isDefinedAndNotNull(frameInternal.offset)) {
                    lastOffsetIndex = i;
                    continue;
                }
                if (i > nextOffsetIndex) {
                    nextOffsetIndex = i;
                    while (!isDefinedAndNotNull(frames[nextOffsetIndex].offset)) {
                        nextOffsetIndex++;
                    }
                }
                var lastOffset = frames[lastOffsetIndex].offset;
                var nextOffset = frames[nextOffsetIndex].offset;
                var unspecifiedKeyframes = nextOffsetIndex - lastOffsetIndex - 1;
                var localIndex = i - lastOffsetIndex;
                frames[i].offset = lastOffset + (nextOffset - lastOffset) * localIndex / (unspecifiedKeyframes + 1);
            }

            return frames;
        }

        function KeyframeStruct(options) {
            this.property = options.property;
            this.value = parseFloat(options.value, 10);
            this.offset = options.offset;
        }

        var Animation = require('./Animation');

        function Keyframe(options) {
            Animation.call(this, options);

            if (!options.keyframes) {
                console.log('No keyframes specificed!');
                return this;
            }

            // 初始化
            var keyframesDictionary = {};
            var frames = distributedFrames(options.keyframes);
            for (var i = 0, len = frames.length; i < len; i++) {
                var frame = frames[i];
                var properties = frame.properties;
                for (var property in properties) {
                    if (properties.hasOwnProperty(property)) {
                        keyframesDictionary[property] = keyframesDictionary[property] || [];
                        keyframesDictionary[property].push(
                            new KeyframeStruct({
                                property: property,
                                value: properties[property],
                                offset: frame.offset
                            })
                        );
                    }
                }
            }

            this._keyframesDictionary = keyframesDictionary;
        }

        /**
         * @override
         */
        Keyframe.prototype.sampleForTarget = function (target) {
            var result = {};
            var keyframesDictionary = this._keyframesDictionary;
            for (var property in keyframesDictionary) {
                if (keyframesDictionary.hasOwnProperty(property)) {
                    result[property] = this._sampleForTargetProperty(target, property, keyframesDictionary[property]);
                }
            }
            target.frame(result);
        };

        Animation.prototype._sampleForTargetProperty = function (target, property, keyframes) {
            var timeFraction = this._timeFraction;
            var startKeyframeIndex;
            var length = keyframes.length;

            if (timeFraction < 0.0) {
                startKeyframeIndex = 0;
            } 
            else if (timeFraction >= 1.0) {
                startKeyframeIndex = length - 2;
            } 
            else {
                for (var i = length - 1; i >= 0; i--) {
                    if (keyframes[i].offset <= timeFraction) {
                        startKeyframeIndex = i;
                        break;
                    }
                }
            }

            var startKeyframe = keyframes[startKeyframeIndex];
            var endKeyframe = keyframes[startKeyframeIndex + 1];

            var nowValue;

            if (startKeyframe.offset === timeFraction) {
                nowValue = startKeyframe.value;
            }
            else if (endKeyframe.offset === timeFraction) {
                nowValue = endKeyframe.value;
            }
            else {
                var f = (timeFraction - startKeyframe.offset) / (endKeyframe.offset - startKeyframe.offset);

                nowValue = startKeyframe.value + (endKeyframe.value - startKeyframe.value) * f;
            }

            return nowValue;
        };

        inherits(Keyframe, Animation);
        return Keyframe;
    }
);
