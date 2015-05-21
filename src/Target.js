/**
 * @file Target
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function (require) {
        var guid = 0;

        function Target(options) {
            this._guid = '_instance_' + (++guid);
            this._animation = null;
        }

        Target.prototype.getGuid = function () {
            return this._guid;
        };

        Target.prototype.frame = function (data) {
            this.emit('frame', data);
        };

        Target.prototype.done = function () {
            this.emit('done');
        };

        Target.prototype.run = function (anim) {
            this._animation = anim;
            anim.startWithTarget(this);
            return this;
        };

        Target.prototype.dispose = function () {};

        require('hf-emitter').mixin(Target.prototype);

        return Target;
    }
);
