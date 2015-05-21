/**
 * @file Shape
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function (require) {
        var inherits = require('hf-util/inherits');
        var Target = require('./Target');
        function Shape(options) {
            Target.call(this, options);
        }
        inherits(Shape, Target);
        return Shape;
    }
);
