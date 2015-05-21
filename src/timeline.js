/**
 * @file 时间轴
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function (require) {
        var raf = require('hf-raf');
        var caf = require('hf-caf');

        function Timeline() {
            this._anims = [];
            this._running = false;
        }

        /**
         * 开始时间轴
         *
         * @public
         * @return {Timeline}
         */
        Timeline.prototype.start = function () {
            if (this._running) {
                return this;
            }
            this._running = true;

            var lastTime = +new Date();
            var DT = 1000 / 60;
            var accumator = 0;

            var self = this;

            /**
            * 循环
            *
            * @inner
            */
            function loop() {
                if (self._running) {
                    var timestamps = +new Date();
                    var deltaTime = timestamps - lastTime;
                    lastTime = timestamps;
                    accumator += deltaTime;
                    while (accumator >= DT) {
                        self._update(DT);
                        accumator -= DT;
                    }
                    self._frame();
                }
                this._rafId = raf(loop);
            }
            this._rafId = raf(loop);

            return this;
        };

        Timeline.prototype.stop = function () {
            caf(this._rafId);
            this._rafId = null;
            this._running = false;
            return this;
        };

        Timeline.prototype._update = function (delta) {
            var anims = this._anims;
            for (var i = 0, len = anims.length; i < len; i++) {
                var anim = anims[i];
                anim.update(delta);
            }
        };

        Timeline.prototype._frame = function () {
            var anims = this._anims;
            var finishes = [];
            for (var i = 0, len = anims.length; i < len; i++) {
                var anim = anims[i];
                anim.frame();

                var isFinished = anim.isFinished();

                if (isFinished) {
                    finishes.push(anim);
                    anim.done();
                }
            }

            for (var j = 0, jlen = finishes.length;  j < jlen; j++) {
                var finishItem = finishes[j];
                this.remove(finishItem);
            }
        };

        Timeline.prototype.add = function (anim) {
            !this.hasAnim(anim) && this._anims.push(anim);
            return this;
        };

        Timeline.prototype.hasAnim = function (anim) {
            return this._anims.indexOf(anim) >= 0;
        };

        Timeline.prototype.remove = function (anim) {
            var anims = this._anims;
            var idx = anims.indexOf(anim);
            anims.splice(idx, 1);
            return this;
        };

        require('hf-emitter').mixin(Timeline.prototype);

        // 返回一个单例
        var timeline = new Timeline();

        return timeline;
    }
);
