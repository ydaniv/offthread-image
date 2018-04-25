/*!
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = self.console.log.bind(self.console);

var Compositor = function () {
    function Compositor(workerContext) {
        _classCallCheck(this, Compositor);

        this.queue = [];
        this.workerContext = workerContext;
    }

    _createClass(Compositor, [{
        key: 'enqueue',
        value: function enqueue(data) {
            // Bail if this URL is already enqueued.
            if (this.queue.indexOf(data.src) >= 0) {
                return;
            }

            this.queue.push(data);
            this.processQueue();
        }
    }, {
        key: 'processQueue',
        value: function processQueue() {
            var _this = this;

            if (this.queue.length === 0) {
                return;
            }

            var _queue$shift = this.queue.shift(),
                src = _queue$shift.src,
                canvas = _queue$shift.canvas,
                options = _queue$shift.options;

            // Fetch the image.


            return fetch(src).then(function (response) {
                _this.workerContext.postMessage({
                    url: src,
                    load: true
                });

                if (response.status !== 200) {
                    return _this.workerContext.postMessage({
                        error: 'Unable to load resource with url ' + src
                    });
                }

                return response.blob();
            })

            // Turn it into an ImageBitmap.
            .then(function (blobData) {
                return createImageBitmap(blobData);
            })

            // Do pixel manipulation and commit
            .then(function (imageBitmap) {
                _this.setCanvasDimensions_(canvas, imageBitmap, options);

                _this.composite(canvas, imageBitmap, options);
            })

            // Notify to main thread.
            .then(function () {
                _this.workerContext.postMessage({ url: src, done: true });
            }, function (err) {
                _this.workerContext.postMessage({
                    error: err.toString()
                });
            })

            // Check the queue.
            .then(function () {
                return _this.processQueue();
            }).catch(function () {
                return _this.processQueue();
            });
        }
    }, {
        key: 'composite',
        value: function composite(canvas, bitmap, options) {
            var ctx = canvas.getContext('2d');

            if (options && options.filter) {
                ctx.filter = options.filter;
            }

            ctx.drawImage(bitmap, 0, 0, options.drawWidth, options.drawHeight);

            ctx.commit();
        }
    }, {
        key: 'setCanvasDimensions_',
        value: function setCanvasDimensions_(canvas, imageBitmap_, options) {
            if (options.background) {
                options.drawWidth = imageBitmap_.width;
                options.drawHeight = imageBitmap_.height;

                var ratio = 1;

                switch (options.backgroundSize) {

                    case 'contain':
                        ratio = Math.min(options.width / options.drawWidth, options.height / options.drawHeight);
                        break;

                    case 'cover':
                        ratio = Math.max(options.width / options.drawWidth, options.height / options.drawHeight);
                        break;

                }

                options.drawWidth *= ratio;
                options.drawHeight *= ratio;
            } else {

                // This is an inline image so now we need to account for it as such.
                // Firstly, if the width is set, but not the height, set the height based
                // on the width. And then do the same in reverse for height but not width
                // and finally default to whatever the image's natural dimensions were.
                if (options.width !== null && options.height === null) {
                    options.height = options.width * (imageBitmap_.height / imageBitmap_.width);
                } else if (options.width === null && options.height !== null) {
                    options.width = options.height * (imageBitmap_.width / imageBitmap_.height);
                } else if (options.width === null && options.height === null) {
                    options.width = imageBitmap_.width;
                    options.height = imageBitmap_.height;
                }

                options.width = parseInt(options.width);
                options.height = parseInt(options.height);

                options.drawWidth = options.width;
                options.drawHeight = options.height;
            }

            // Now resize the canvas appropriately.
            canvas.width = options.width;
            canvas.height = options.height;
        }
    }]);

    return Compositor;
}();

var compositor = new Compositor(self);

self.onmessage = function (evt) {
    return compositor.enqueue(evt.data);
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvb2Zmc2NyZWVuLWltZy9vZmZzY3JlZW4taW1nLXdvcmtlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7Ozs7QUFFQSxJQUFJLE1BQU0sS0FBSyxPQUFMLENBQWEsR0FBYixDQUFpQixJQUFqQixDQUFzQixLQUFLLE9BQTNCLENBQVY7O0lBRU0sVTtBQUVGLHdCQUFhLGFBQWIsRUFBNEI7QUFBQTs7QUFDeEIsYUFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUssYUFBTCxHQUFxQixhQUFyQjtBQUNIOzs7O2dDQUVRLEksRUFBTTtBQUNYO0FBQ0EsZ0JBQUssS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixLQUFLLEdBQXhCLEtBQWdDLENBQXJDLEVBQXlDO0FBQ3JDO0FBQ0g7O0FBRUQsaUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEI7QUFDQSxpQkFBSyxZQUFMO0FBQ0g7Ozt1Q0FFZTtBQUFBOztBQUNaLGdCQUFLLEtBQUssS0FBTCxDQUFXLE1BQVgsS0FBc0IsQ0FBM0IsRUFBK0I7QUFDM0I7QUFDSDs7QUFIVywrQkFLaUIsS0FBSyxLQUFMLENBQVcsS0FBWCxFQUxqQjtBQUFBLGdCQUtQLEdBTE8sZ0JBS1AsR0FMTztBQUFBLGdCQUtGLE1BTEUsZ0JBS0YsTUFMRTtBQUFBLGdCQUtNLE9BTE4sZ0JBS00sT0FMTjs7QUFPWjs7O0FBQ0EsbUJBQU8sTUFBTSxHQUFOLEVBQ0YsSUFERSxDQUNHLG9CQUFZO0FBQ2Qsc0JBQUssYUFBTCxDQUFtQixXQUFuQixDQUErQjtBQUMzQix5QkFBSyxHQURzQjtBQUUzQiwwQkFBTTtBQUZxQixpQkFBL0I7O0FBS0Esb0JBQUksU0FBUyxNQUFULEtBQW9CLEdBQXhCLEVBQTZCO0FBQ3pCLDJCQUFPLE1BQUssYUFBTCxDQUFtQixXQUFuQixDQUErQjtBQUNsQyxxRUFBMkM7QUFEVCxxQkFBL0IsQ0FBUDtB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R0FBaUIsYUFBYSxNQUE5QjtBQUNIOztBQUVELHdCQUFRLEtBQVIsR0FBZ0IsU0FBUyxRQUFRLEtBQWpCLENBQWhCO0FBQ0Esd0JBQVEsTUFBUixHQUFpQixTQUFTLFFBQVEsTUFBakIsQ0FBakI7O0FBRUEsd0JBQVEsU0FBUixHQUFvQixRQUFRLEtBQTVCO0FBQ0Esd0JBQVEsVUFBUixHQUFxQixRQUFRLE1BQTdCO0FBQ0g7O0FBRUQ7QUFDQSxtQkFBTyxLQUFQLEdBQWUsUUFBUSxLQUF2QjtBQUNBLG1CQUFPLE1BQVAsR0FBZ0IsUUFBUSxNQUF4QjtBQUNIOzs7Ozs7QUFHTCxJQUFJLGFBQWEsSUFBSSxVQUFKLENBQWUsSUFBZixDQUFqQjs7QUFFQSxLQUFLLFNBQUwsR0FBaUIsVUFBQyxHQUFEO0FBQUEsV0FBUyxXQUFXLE9BQVgsQ0FBbUIsSUFBSSxJQUF2QixDQUFUO0FBQUEsQ0FBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsIid1c2Ugc3RyaWN0JztcblxubGV0IGxvZyA9IHNlbGYuY29uc29sZS5sb2cuYmluZChzZWxmLmNvbnNvbGUpO1xuXG5jbGFzcyBDb21wb3NpdG9yIHtcblxuICAgIGNvbnN0cnVjdG9yICh3b3JrZXJDb250ZXh0KSB7XG4gICAgICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICAgICAgdGhpcy53b3JrZXJDb250ZXh0ID0gd29ya2VyQ29udGV4dDtcbiAgICB9XG5cbiAgICBlbnF1ZXVlIChkYXRhKSB7XG4gICAgICAgIC8vIEJhaWwgaWYgdGhpcyBVUkwgaXMgYWxyZWFkeSBlbnF1ZXVlZC5cbiAgICAgICAgaWYgKCB0aGlzLnF1ZXVlLmluZGV4T2YoZGF0YS5zcmMpID49IDAgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnF1ZXVlLnB1c2goZGF0YSk7XG4gICAgICAgIHRoaXMucHJvY2Vzc1F1ZXVlKCk7XG4gICAgfVxuXG4gICAgcHJvY2Vzc1F1ZXVlICgpIHtcbiAgICAgICAgaWYgKCB0aGlzLnF1ZXVlLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB7c3JjLCBjYW52YXMsIG9wdGlvbnN9ID0gdGhpcy5xdWV1ZS5zaGlmdCgpO1xuXG4gICAgICAgIC8vIEZldGNoIHRoZSBpbWFnZS5cbiAgICAgICAgcmV0dXJuIGZldGNoKHNyYylcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmtlckNvbnRleHQucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHNyYyxcbiAgICAgICAgICAgICAgICAgICAgbG9hZDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLndvcmtlckNvbnRleHQucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGBVbmFibGUgdG8gbG9hZCByZXNvdXJjZSB3aXRoIHVybCAke3NyY31gXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5ibG9iKCk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLyBUdXJuIGl0IGludG8gYW4gSW1hZ2VCaXRtYXAuXG4gICAgICAgICAgICAudGhlbigoYmxvYkRhdGEpID0+IGNyZWF0ZUltYWdlQml0bWFwKGJsb2JEYXRhKSlcblxuICAgICAgICAgICAgLy8gRG8gcGl4ZWwgbWFuaXB1bGF0aW9uIGFuZCBjb21taXRcbiAgICAgICAgICAgIC50aGVuKChpbWFnZUJpdG1hcCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2FudmFzRGltZW5zaW9uc18oY2FudmFzLCBpbWFnZUJpdG1hcCwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvc2l0ZShjYW52YXMsIGltYWdlQml0bWFwLCBvcHRpb25zKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vIE5vdGlmeSB0byBtYWluIHRocmVhZC5cbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmtlckNvbnRleHQucG9zdE1lc3NhZ2UoeyB1cmw6IHNyYywgZG9uZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmtlckNvbnRleHQucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vIENoZWNrIHRoZSBxdWV1ZS5cbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMucHJvY2Vzc1F1ZXVlKCkpXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4gdGhpcy5wcm9jZXNzUXVldWUoKSk7XG4gICAgfVxuXG4gICAgY29tcG9zaXRlIChjYW52YXMsIGJpdG1hcCwgb3B0aW9ucykge1xuICAgICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICBpZiAoIG9wdGlvbnMgJiYgb3B0aW9ucy5maWx0ZXIgKSB7XG4gICAgICAgICAgICBjdHguZmlsdGVyID0gb3B0aW9ucy5maWx0ZXI7XG4gICAgICAgIH1cblxuICAgICAgICBjdHguZHJhd0ltYWdlKGJpdG1hcCwgMCwgMCwgb3B0aW9ucy5kcmF3V2lkdGgsIG9wdGlvbnMuZHJhd0hlaWdodCk7XG5cbiAgICAgICAgY3R4LmNvbW1pdCgpO1xuICAgIH1cblxuICAgIHNldENhbnZhc0RpbWVuc2lvbnNfIChjYW52YXMsIGltYWdlQml0bWFwXywgb3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy5iYWNrZ3JvdW5kKSB7XG4gICAgICAgICAgICBvcHRpb25zLmRyYXdXaWR0aCA9IGltYWdlQml0bWFwXy53aWR0aDtcbiAgICAgICAgICAgIG9wdGlvbnMuZHJhd0hlaWdodCA9IGltYWdlQml0bWFwXy5oZWlnaHQ7XG5cbiAgICAgICAgICAgIGxldCByYXRpbyA9IDE7XG5cbiAgICAgICAgICAgIHN3aXRjaCAob3B0aW9ucy5iYWNrZ3JvdW5kU2l6ZSkge1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnY29udGFpbic6XG4gICAgICAgICAgICAgICAgICAgIHJhdGlvID0gTWF0aC5taW4ob3B0aW9ucy53aWR0aCAvIG9wdGlvbnMuZHJhd1dpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5oZWlnaHQgLyBvcHRpb25zLmRyYXdIZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvdmVyJzpcbiAgICAgICAgICAgICAgICAgICAgcmF0aW8gPSBNYXRoLm1heChvcHRpb25zLndpZHRoIC8gb3B0aW9ucy5kcmF3V2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmhlaWdodCAvIG9wdGlvbnMuZHJhd0hlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9wdGlvbnMuZHJhd1dpZHRoICo9IHJhdGlvO1xuICAgICAgICAgICAgb3B0aW9ucy5kcmF3SGVpZ2h0ICo9IHJhdGlvO1xuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYW4gaW5saW5lIGltYWdlIHNvIG5vdyB3ZSBuZWVkIHRvIGFjY291bnQgZm9yIGl0IGFzIHN1Y2guXG4gICAgICAgICAgICAvLyBGaXJzdGx5LCBpZiB0aGUgd2lkdGggaXMgc2V0LCBidXQgbm90IHRoZSBoZWlnaHQsIHNldCB0aGUgaGVpZ2h0IGJhc2VkXG4gICAgICAgICAgICAvLyBvbiB0aGUgd2lkdGguIEFuZCB0aGVuIGRvIHRoZSBzYW1lIGluIHJldmVyc2UgZm9yIGhlaWdodCBidXQgbm90IHdpZHRoXG4gICAgICAgICAgICAvLyBhbmQgZmluYWxseSBkZWZhdWx0IHRvIHdoYXRldmVyIHRoZSBpbWFnZSdzIG5hdHVyYWwgZGltZW5zaW9ucyB3ZXJlLlxuICAgICAgICAgICAgaWYgKG9wdGlvbnMud2lkdGggIT09IG51bGwgJiYgb3B0aW9ucy5oZWlnaHQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmhlaWdodCA9IG9wdGlvbnMud2lkdGggKiAoaW1hZ2VCaXRtYXBfLmhlaWdodCAvIGltYWdlQml0bWFwXy53aWR0aCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMud2lkdGggPT09IG51bGwgJiYgb3B0aW9ucy5oZWlnaHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLndpZHRoID0gb3B0aW9ucy5oZWlnaHQgKiAoaW1hZ2VCaXRtYXBfLndpZHRoIC8gaW1hZ2VCaXRtYXBfLmhlaWdodCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMud2lkdGggPT09IG51bGwgJiYgb3B0aW9ucy5oZWlnaHQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLndpZHRoID0gaW1hZ2VCaXRtYXBfLndpZHRoO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuaGVpZ2h0ID0gaW1hZ2VCaXRtYXBfLmhlaWdodDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3B0aW9ucy53aWR0aCA9IHBhcnNlSW50KG9wdGlvbnMud2lkdGgpO1xuICAgICAgICAgICAgb3B0aW9ucy5oZWlnaHQgPSBwYXJzZUludChvcHRpb25zLmhlaWdodCk7XG5cbiAgICAgICAgICAgIG9wdGlvbnMuZHJhd1dpZHRoID0gb3B0aW9ucy53aWR0aDtcbiAgICAgICAgICAgIG9wdGlvbnMuZHJhd0hlaWdodCA9IG9wdGlvbnMuaGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm93IHJlc2l6ZSB0aGUgY2FudmFzIGFwcHJvcHJpYXRlbHkuXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IG9wdGlvbnMud2lkdGg7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcbiAgICB9XG59XG5cbmxldCBjb21wb3NpdG9yID0gbmV3IENvbXBvc2l0b3Ioc2VsZik7XG5cbnNlbGYub25tZXNzYWdlID0gKGV2dCkgPT4gY29tcG9zaXRvci5lbnF1ZXVlKGV2dC5kYXRhKTtcbiJdfQ==
