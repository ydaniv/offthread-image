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
                        error: 'Unable to load resource with url ' + url
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
                _this.setCanvasDimensions_(imageBitmap);
                _this.composite(canvas, imageBitmap, options);
            })

            // Notify to main thread.
            .then(function () {
                _this.workerContext.postMessage({ url: url });
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

            ctx.drawImage(bitmap, 0, 0);

            ctx.commit();
        }

        /**
         * Sets the canvas's dimensions based on the ImageBitmap data provided.
         *
         * @private
         * @param {ImageBitmap} imageBitmap - The ImageBitmap to use for resizing the
         *   canvas (if necessary).
         */

    }, {
        key: 'setCanvasDimensions_',
        value: function setCanvasDimensions_(imageBitmap_) {

            if (this.background_) {
                // If this is a background image, default the canvas to the dimensions of
                // the container element.
                this.width_ = this.element_.offsetWidth;
                this.height_ = this.element_.offsetHeight;

                this.drawWidth_ = imageBitmap_.width;
                this.drawHeight_ = imageBitmap_.height;

                var backgroundSize = window.getComputedStyle(this.element_).backgroundSize;
                var ratio = 1;

                switch (backgroundSize) {

                    case 'contain':
                        ratio = Math.min(this.width_ / this.drawWidth_, this.height_ / this.drawHeight_);
                        break;

                    case 'cover':
                        ratio = Math.max(this.width_ / this.drawWidth_, this.height_ / this.drawHeight_);
                        break;

                }

                this.drawWidth_ *= ratio;
                this.drawHeight_ *= ratio;
            } else {

                // This is an inline image so now we need to account for it as such.
                // Firstly, if the width is set, but not the height, set the height based
                // on the width. And then do the same in reverse for height but not width
                // and finally default to whatever the image's natural dimensions were.
                if (this.width_ !== null && this.height_ === null) {
                    this.height_ = this.width_ * (imageBitmap_.height / imageBitmap_.width);
                } else if (this.width_ === null && this.height_ !== null) {
                    this.width_ = this.height_ * (imageBitmap_.width / imageBitmap_.height);
                } else if (this.width_ === null && this.height_ === null) {
                    this.width_ = imageBitmap_.width;
                    this.height_ = imageBitmap_.height;
                }

                this.width_ = parseInt(this.width_);
                this.height_ = parseInt(this.height_);

                this.drawWidth_ = this.width_;
                this.drawHeight_ = this.height_;
            }

            // Now resize the canvas appropriately.
            this.canvas_.width = this.width_;
            this.canvas_.height = this.height_;
        }

        /**
         * Sets the canvas's dimensions based on the ImageBitmap data provided.
         *
         * @private
         * @param {ImageBitmap} imageBitmap - The ImageBitmap to use for resizing the
         *   canvas (if necessary).
         */

    }, {
        key: 'setCanvasDimensions_',
        value: function setCanvasDimensions_(imageBitmap_) {

            if (this.background_) {
                // If this is a background image, default the canvas to the dimensions of
                // the container element.
                this.width_ = this.element_.offsetWidth;
                this.height_ = this.element_.offsetHeight;

                this.drawWidth_ = imageBitmap_.width;
                this.drawHeight_ = imageBitmap_.height;

                var backgroundSize = window.getComputedStyle(this.element_).backgroundSize;
                var ratio = 1;

                switch (backgroundSize) {

                    case 'contain':
                        ratio = Math.min(this.width_ / this.drawWidth_, this.height_ / this.drawHeight_);
                        break;

                    case 'cover':
                        ratio = Math.max(this.width_ / this.drawWidth_, this.height_ / this.drawHeight_);
                        break;

                }

                this.drawWidth_ *= ratio;
                this.drawHeight_ *= ratio;
            } else {

                // This is an inline image so now we need to account for it as such.
                // Firstly, if the width is set, but not the height, set the height based
                // on the width. And then do the same in reverse for height but not width
                // and finally default to whatever the image's natural dimensions were.
                if (this.width_ !== null && this.height_ === null) {
                    this.height_ = this.width_ * (imageBitmap_.height / imageBitmap_.width);
                } else if (this.width_ === null && this.height_ !== null) {
                    this.width_ = this.height_ * (imageBitmap_.width / imageBitmap_.height);
                } else if (this.width_ === null && this.height_ === null) {
                    this.width_ = imageBitmap_.width;
                    this.height_ = imageBitmap_.height;
                }

                this.width_ = parseInt(this.width_);
                this.height_ = parseInt(this.height_);

                this.drawWidth_ = this.width_;
                this.drawHeight_ = this.height_;
            }

            // Now resize the canvas appropriately.
            this.canvas_.width = this.width_;
            this.canvas_.height = this.height_;
        }
    }]);

    return Compositor;
}();

var compositor = new Compositor(self);

self.onmessage = function (evt) {
    return compositor.enqueue(evt.data);
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvb2Zmc2NyZWVuLWltZy9vZmZzY3JlZW4taW1nLXdvcmtlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7Ozs7QUFFQSxJQUFJLE1BQU0sS0FBSyxPQUFMLENBQWEsR0FBYixDQUFpQixJQUFqQixDQUFzQixLQUFLLE9BQTNCLENBQVY7O0lBRU0sVTtBQUVGLHdCQUFhLGFBQWIsRUFBNEI7QUFBQTs7QUFDeEIsYUFBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUssYUFBTCxHQUFxQixhQUFyQjtBQUNIOzs7O2dDQUVRLEksRUFBTTtBQUNYO0FBQ0EsZ0JBQUssS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixLQUFLLEdBQXhCLEtBQWdDLENBQXJDLEVBQXlDO0FBQ3JDO0FBQ0g7O0FBRUQsaUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEI7QUFDQSxpQkFBSyxZQUFMO0FBQ0g7Ozt1Q0FFZTtBQUFBOztBQUNaLGdCQUFLLEtBQUssS0FBTCxDQUFXLE1BQVgsS0FBc0IsQ0FBM0IsRUFBK0I7QUFDM0I7QUFDSDs7QUFIVywrQkFLaUIsS0FBSyxLQUFMLENBQVcsS0FBWCxFQUxqQjtBQUFBLGdCQUtQLEdBTE8sZ0JBS1AsR0FMTztBQUFBLGdCQUtGLE1BTEUsZ0JBS0YsTUFMRTtBQUFBLGdCQUtNLE9BTE4sZ0JBS00sT0FMTjs7QUFPWjs7O0FBQ0EsbUJBQU8sTUFBTSxHQUFOLEVBQ0YsSUFERSxDQUNHLG9CQUFZO0FBQ2Qsc0JBQUssYUFBTCxDQUFtQixXQUFuQixDQUErQjtBQUMzQix5QkFBSyxHQURzQjtBQUUzQiwwQkFBTTtBQUZxQixpQkFBL0I7O0FBS0Esb0JBQUksU0FBUyxNQUFULEtBQW9CLEdBQXhCLEVBQTZCO0FBQ3pCLDJCQUFPLE1BQUssYUFBTCxDQUFtQixXQUFuQixDQUErQjtBQUNsQyxxRUFBMkM7QUFEVCxxQkFBL0IsQ0FBUDtB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Iiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsIid1c2Ugc3RyaWN0JztcblxubGV0IGxvZyA9IHNlbGYuY29uc29sZS5sb2cuYmluZChzZWxmLmNvbnNvbGUpO1xuXG5jbGFzcyBDb21wb3NpdG9yIHtcblxuICAgIGNvbnN0cnVjdG9yICh3b3JrZXJDb250ZXh0KSB7XG4gICAgICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICAgICAgdGhpcy53b3JrZXJDb250ZXh0ID0gd29ya2VyQ29udGV4dDtcbiAgICB9XG5cbiAgICBlbnF1ZXVlIChkYXRhKSB7XG4gICAgICAgIC8vIEJhaWwgaWYgdGhpcyBVUkwgaXMgYWxyZWFkeSBlbnF1ZXVlZC5cbiAgICAgICAgaWYgKCB0aGlzLnF1ZXVlLmluZGV4T2YoZGF0YS5zcmMpID49IDAgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnF1ZXVlLnB1c2goZGF0YSk7XG4gICAgICAgIHRoaXMucHJvY2Vzc1F1ZXVlKCk7XG4gICAgfVxuXG4gICAgcHJvY2Vzc1F1ZXVlICgpIHtcbiAgICAgICAgaWYgKCB0aGlzLnF1ZXVlLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB7c3JjLCBjYW52YXMsIG9wdGlvbnN9ID0gdGhpcy5xdWV1ZS5zaGlmdCgpO1xuXG4gICAgICAgIC8vIEZldGNoIHRoZSBpbWFnZS5cbiAgICAgICAgcmV0dXJuIGZldGNoKHNyYylcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmtlckNvbnRleHQucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHNyYyxcbiAgICAgICAgICAgICAgICAgICAgbG9hZDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLndvcmtlckNvbnRleHQucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGBVbmFibGUgdG8gbG9hZCByZXNvdXJjZSB3aXRoIHVybCAke3VybH1gXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5ibG9iKCk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLyBUdXJuIGl0IGludG8gYW4gSW1hZ2VCaXRtYXAuXG4gICAgICAgICAgICAudGhlbigoYmxvYkRhdGEpID0+IGNyZWF0ZUltYWdlQml0bWFwKGJsb2JEYXRhKSlcblxuICAgICAgICAgICAgLy8gRG8gcGl4ZWwgbWFuaXB1bGF0aW9uIGFuZCBjb21taXRcbiAgICAgICAgICAgIC50aGVuKChpbWFnZUJpdG1hcCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2FudmFzRGltZW5zaW9uc18oaW1hZ2VCaXRtYXApXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb3NpdGUoY2FudmFzLCBpbWFnZUJpdG1hcCwgb3B0aW9ucyk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLyBOb3RpZnkgdG8gbWFpbiB0aHJlYWQuXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy53b3JrZXJDb250ZXh0LnBvc3RNZXNzYWdlKHsgdXJsIH0pO1xuICAgICAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMud29ya2VyQ29udGV4dC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnIudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLy8gQ2hlY2sgdGhlIHF1ZXVlLlxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5wcm9jZXNzUXVldWUoKSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB0aGlzLnByb2Nlc3NRdWV1ZSgpKTtcbiAgICB9XG5cbiAgICBjb21wb3NpdGUgKGNhbnZhcywgYml0bWFwLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgIGlmICggb3B0aW9ucyAmJiBvcHRpb25zLmZpbHRlciApIHtcbiAgICAgICAgICAgIGN0eC5maWx0ZXIgPSBvcHRpb25zLmZpbHRlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoYml0bWFwLCAwLCAwKTtcblxuICAgICAgICBjdHguY29tbWl0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgY2FudmFzJ3MgZGltZW5zaW9ucyBiYXNlZCBvbiB0aGUgSW1hZ2VCaXRtYXAgZGF0YSBwcm92aWRlZC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtJbWFnZUJpdG1hcH0gaW1hZ2VCaXRtYXAgLSBUaGUgSW1hZ2VCaXRtYXAgdG8gdXNlIGZvciByZXNpemluZyB0aGVcbiAgICAgKiAgIGNhbnZhcyAoaWYgbmVjZXNzYXJ5KS5cbiAgICAgKi9cbiAgICBzZXRDYW52YXNEaW1lbnNpb25zXyAoaW1hZ2VCaXRtYXBfKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZF8pIHtcbiAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSBiYWNrZ3JvdW5kIGltYWdlLCBkZWZhdWx0IHRoZSBjYW52YXMgdG8gdGhlIGRpbWVuc2lvbnMgb2ZcbiAgICAgICAgICAgIC8vIHRoZSBjb250YWluZXIgZWxlbWVudC5cbiAgICAgICAgICAgIHRoaXMud2lkdGhfID0gdGhpcy5lbGVtZW50Xy5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0XyA9IHRoaXMuZWxlbWVudF8ub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgICAgICB0aGlzLmRyYXdXaWR0aF8gPSBpbWFnZUJpdG1hcF8ud2lkdGg7XG4gICAgICAgICAgICB0aGlzLmRyYXdIZWlnaHRfID0gaW1hZ2VCaXRtYXBfLmhlaWdodDtcblxuICAgICAgICAgICAgbGV0IGJhY2tncm91bmRTaXplID1cbiAgICAgICAgICAgICAgICB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnRfKS5iYWNrZ3JvdW5kU2l6ZTtcbiAgICAgICAgICAgIGxldCByYXRpbyA9IDE7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoYmFja2dyb3VuZFNpemUpIHtcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnRhaW4nOlxuICAgICAgICAgICAgICAgICAgICByYXRpbyA9IE1hdGgubWluKHRoaXMud2lkdGhfIC8gdGhpcy5kcmF3V2lkdGhfLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHRfIC8gdGhpcy5kcmF3SGVpZ2h0Xyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnY292ZXInOlxuICAgICAgICAgICAgICAgICAgICByYXRpbyA9IE1hdGgubWF4KHRoaXMud2lkdGhfIC8gdGhpcy5kcmF3V2lkdGhfLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWlnaHRfIC8gdGhpcy5kcmF3SGVpZ2h0Xyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZHJhd1dpZHRoXyAqPSByYXRpbztcbiAgICAgICAgICAgIHRoaXMuZHJhd0hlaWdodF8gKj0gcmF0aW87XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBpbmxpbmUgaW1hZ2Ugc28gbm93IHdlIG5lZWQgdG8gYWNjb3VudCBmb3IgaXQgYXMgc3VjaC5cbiAgICAgICAgICAgIC8vIEZpcnN0bHksIGlmIHRoZSB3aWR0aCBpcyBzZXQsIGJ1dCBub3QgdGhlIGhlaWdodCwgc2V0IHRoZSBoZWlnaHQgYmFzZWRcbiAgICAgICAgICAgIC8vIG9uIHRoZSB3aWR0aC4gQW5kIHRoZW4gZG8gdGhlIHNhbWUgaW4gcmV2ZXJzZSBmb3IgaGVpZ2h0IGJ1dCBub3Qgd2lkdGhcbiAgICAgICAgICAgIC8vIGFuZCBmaW5hbGx5IGRlZmF1bHQgdG8gd2hhdGV2ZXIgdGhlIGltYWdlJ3MgbmF0dXJhbCBkaW1lbnNpb25zIHdlcmUuXG4gICAgICAgICAgICBpZiAodGhpcy53aWR0aF8gIT09IG51bGwgJiYgdGhpcy5oZWlnaHRfID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHRfID0gdGhpcy53aWR0aF8gKiAoaW1hZ2VCaXRtYXBfLmhlaWdodCAvIGltYWdlQml0bWFwXy53aWR0aCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMud2lkdGhfID09PSBudWxsICYmIHRoaXMuaGVpZ2h0XyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMud2lkdGhfID0gdGhpcy5oZWlnaHRfICogKGltYWdlQml0bWFwXy53aWR0aCAvIGltYWdlQml0bWFwXy5oZWlnaHQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLndpZHRoXyA9PT0gbnVsbCAmJiB0aGlzLmhlaWdodF8gPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoXyA9IGltYWdlQml0bWFwXy53aWR0aDtcbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodF8gPSBpbWFnZUJpdG1hcF8uaGVpZ2h0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLndpZHRoXyA9IHBhcnNlSW50KHRoaXMud2lkdGhfKTtcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0XyA9IHBhcnNlSW50KHRoaXMuaGVpZ2h0Xyk7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhd1dpZHRoXyA9IHRoaXMud2lkdGhfO1xuICAgICAgICAgICAgdGhpcy5kcmF3SGVpZ2h0XyA9IHRoaXMuaGVpZ2h0XztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdyByZXNpemUgdGhlIGNhbnZhcyBhcHByb3ByaWF0ZWx5LlxuICAgICAgICB0aGlzLmNhbnZhc18ud2lkdGggPSB0aGlzLndpZHRoXztcbiAgICAgICAgdGhpcy5jYW52YXNfLmhlaWdodCA9IHRoaXMuaGVpZ2h0XztcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGNhbnZhcydzIGRpbWVuc2lvbnMgYmFzZWQgb24gdGhlIEltYWdlQml0bWFwIGRhdGEgcHJvdmlkZWQuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7SW1hZ2VCaXRtYXB9IGltYWdlQml0bWFwIC0gVGhlIEltYWdlQml0bWFwIHRvIHVzZSBmb3IgcmVzaXppbmcgdGhlXG4gICAgICogICBjYW52YXMgKGlmIG5lY2Vzc2FyeSkuXG4gICAgICovXG4gICAgc2V0Q2FudmFzRGltZW5zaW9uc18gKGltYWdlQml0bWFwXykge1xuXG4gICAgICAgIGlmICh0aGlzLmJhY2tncm91bmRfKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIGEgYmFja2dyb3VuZCBpbWFnZSwgZGVmYXVsdCB0aGUgY2FudmFzIHRvIHRoZSBkaW1lbnNpb25zIG9mXG4gICAgICAgICAgICAvLyB0aGUgY29udGFpbmVyIGVsZW1lbnQuXG4gICAgICAgICAgICB0aGlzLndpZHRoXyA9IHRoaXMuZWxlbWVudF8ub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICB0aGlzLmhlaWdodF8gPSB0aGlzLmVsZW1lbnRfLm9mZnNldEhlaWdodDtcblxuICAgICAgICAgICAgdGhpcy5kcmF3V2lkdGhfID0gaW1hZ2VCaXRtYXBfLndpZHRoO1xuICAgICAgICAgICAgdGhpcy5kcmF3SGVpZ2h0XyA9IGltYWdlQml0bWFwXy5oZWlnaHQ7XG5cbiAgICAgICAgICAgIGxldCBiYWNrZ3JvdW5kU2l6ZSA9XG4gICAgICAgICAgICAgICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50XykuYmFja2dyb3VuZFNpemU7XG4gICAgICAgICAgICBsZXQgcmF0aW8gPSAxO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKGJhY2tncm91bmRTaXplKSB7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdjb250YWluJzpcbiAgICAgICAgICAgICAgICAgICAgcmF0aW8gPSBNYXRoLm1pbih0aGlzLndpZHRoXyAvIHRoaXMuZHJhd1dpZHRoXyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0XyAvIHRoaXMuZHJhd0hlaWdodF8pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvdmVyJzpcbiAgICAgICAgICAgICAgICAgICAgcmF0aW8gPSBNYXRoLm1heCh0aGlzLndpZHRoXyAvIHRoaXMuZHJhd1dpZHRoXyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0XyAvIHRoaXMuZHJhd0hlaWdodF8pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmRyYXdXaWR0aF8gKj0gcmF0aW87XG4gICAgICAgICAgICB0aGlzLmRyYXdIZWlnaHRfICo9IHJhdGlvO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYW4gaW5saW5lIGltYWdlIHNvIG5vdyB3ZSBuZWVkIHRvIGFjY291bnQgZm9yIGl0IGFzIHN1Y2guXG4gICAgICAgICAgICAvLyBGaXJzdGx5LCBpZiB0aGUgd2lkdGggaXMgc2V0LCBidXQgbm90IHRoZSBoZWlnaHQsIHNldCB0aGUgaGVpZ2h0IGJhc2VkXG4gICAgICAgICAgICAvLyBvbiB0aGUgd2lkdGguIEFuZCB0aGVuIGRvIHRoZSBzYW1lIGluIHJldmVyc2UgZm9yIGhlaWdodCBidXQgbm90IHdpZHRoXG4gICAgICAgICAgICAvLyBhbmQgZmluYWxseSBkZWZhdWx0IHRvIHdoYXRldmVyIHRoZSBpbWFnZSdzIG5hdHVyYWwgZGltZW5zaW9ucyB3ZXJlLlxuICAgICAgICAgICAgaWYgKHRoaXMud2lkdGhfICE9PSBudWxsICYmIHRoaXMuaGVpZ2h0XyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0XyA9IHRoaXMud2lkdGhfICogKGltYWdlQml0bWFwXy5oZWlnaHQgLyBpbWFnZUJpdG1hcF8ud2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLndpZHRoXyA9PT0gbnVsbCAmJiB0aGlzLmhlaWdodF8gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoXyA9IHRoaXMuaGVpZ2h0XyAqIChpbWFnZUJpdG1hcF8ud2lkdGggLyBpbWFnZUJpdG1hcF8uaGVpZ2h0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy53aWR0aF8gPT09IG51bGwgJiYgdGhpcy5oZWlnaHRfID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aF8gPSBpbWFnZUJpdG1hcF8ud2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHRfID0gaW1hZ2VCaXRtYXBfLmhlaWdodDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy53aWR0aF8gPSBwYXJzZUludCh0aGlzLndpZHRoXyk7XG4gICAgICAgICAgICB0aGlzLmhlaWdodF8gPSBwYXJzZUludCh0aGlzLmhlaWdodF8pO1xuXG4gICAgICAgICAgICB0aGlzLmRyYXdXaWR0aF8gPSB0aGlzLndpZHRoXztcbiAgICAgICAgICAgIHRoaXMuZHJhd0hlaWdodF8gPSB0aGlzLmhlaWdodF87XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3cgcmVzaXplIHRoZSBjYW52YXMgYXBwcm9wcmlhdGVseS5cbiAgICAgICAgdGhpcy5jYW52YXNfLndpZHRoID0gdGhpcy53aWR0aF87XG4gICAgICAgIHRoaXMuY2FudmFzXy5oZWlnaHQgPSB0aGlzLmhlaWdodF87XG5cbiAgICB9XG59XG5cbmxldCBjb21wb3NpdG9yID0gbmV3IENvbXBvc2l0b3Ioc2VsZik7XG5cbnNlbGYub25tZXNzYWdlID0gKGV2dCkgPT4gY29tcG9zaXRvci5lbnF1ZXVlKGV2dC5kYXRhKTtcbiJdfQ==
