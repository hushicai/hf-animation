/**
 * @file DomTarget
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function (require) {
        var Target = require('./Target');
        var inherits = require('hf-util/inherits');

        function DomTarget(options) {
            Target.call(this, options);
            this.element = options.element;
        }

        DomTarget.prototype.frame = function (data) {
            require('hf-css/setStyles')(this.element, data);
            Target.prototype.frame.call(this, data);
        };

        inherits(DomTarget, Target);

        return DomTarget;
    }
);
