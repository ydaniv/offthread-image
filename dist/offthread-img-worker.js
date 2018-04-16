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
/**
 * Copyright 2015 Google Inc. All rights reserved.
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

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = self.console.log.bind(self.console);

var ImageHandler = function () {
  function ImageHandler(workerContext) {
    _classCallCheck(this, ImageHandler);

    this.queue = [];
    this.workerContext = workerContext;
  }

  _createClass(ImageHandler, [{
    key: 'enqueue',
    value: function enqueue(toEnqueue) {

      // Bail if this URL is already enqueued.
      if (this.queue.indexOf(toEnqueue) >= 0) return;

      this.queue.push(toEnqueue);
      this.processQueue();
    }
  }, {
    key: 'processQueue',
    value: function processQueue() {
      var _this = this;

      if (this.queue.length === 0) return;

      var url = this.queue.shift();

      // Fetch the image.
      return fetch(url).then(function (response) {
        _this.workerContext.postMessage({
          url: url,
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

      // Post it back to main thread.
      .then(function (imageBitmap) {
        _this.workerContext.postMessage({
          url: url,
          imageBitmap: imageBitmap
        }, [imageBitmap]);
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
  }]);

  return ImageHandler;
}();

var handler = new ImageHandler(self);

self.onmessage = function (evt) {
  return handler.enqueue(evt.data);
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvb2ZmdGhyZWFkLWltZy9vZmZ0aHJlYWQtaW1nLXdvcmtlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBOzs7Ozs7QUFFQSxJQUFJLE1BQU0sS0FBSyxPQUFMLENBQWEsR0FBYixDQUFpQixJQUFqQixDQUFzQixLQUFLLE9BQTNCLENBQVY7O0lBRU0sWTtBQUVKLHdCQUFhLGFBQWIsRUFBNEI7QUFBQTs7QUFDMUIsU0FBSyxLQUFMLEdBQWEsRUFBYjtBQUNBLFNBQUssYUFBTCxHQUFxQixhQUFyQjtBQUNEOzs7OzRCQUVRLFMsRUFBVzs7QUFFbEI7QUFDQSxVQUFJLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsU0FBbkIsS0FBaUMsQ0FBckMsRUFDRTs7QUFFRixXQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLFNBQWhCO0FBQ0EsV0FBSyxZQUFMO0FBQ0Q7OzttQ0FFZTtBQUFBOztBQUVkLFVBQUksS0FBSyxLQUFMLENBQVcsTUFBWCxLQUFzQixDQUExQixFQUNFOztBQUVGLFVBQUksTUFBTSxLQUFLLEtBQUwsQ0FBVyxLQUFYLEVBQVY7O0FBRUE7QUFDQSxhQUFPLE1BQU0sR0FBTixFQUNGLElBREUsQ0FDRyxvQkFBWTtBQUNoQixjQUFLLGFBQUwsQ0FBbUIsV0FBbkIsQ0FBK0I7QUFDN0IsZUFBSyxHQUR3QjtBQUU3QixnQkFBTTtBQUZ1QixTQUEvQjs7QUFLQSxZQUFJLFNBQVMsTUFBVCxLQUFvQixHQUF4QixFQUE2QjtBQUMzQixpQkFBTyxNQUFLLGFBQUwsQ0FBbUIsV0FBbkIsQ0FBK0I7QUFDbEMseURBQTJDO0FBRFQsV0FBL0IsQ0FBUDtBQUdEOztBQUVELGVBQU8sU0FBUyxJQUFULEVBQVA7QUFDRCxPQWRFOztBQWdCSDtBQWhCRyxPQWlCRixJQWpCRSxDQWlCRyxVQUFDLFFBQUQ7QUFBQSxlQUFjLGtCQUFrQixRQUFsQixDQUFkO0FBQUEsT0FqQkg7O0FBbUJIO0FBbkJHLE9Bb0JGLElBcEJFLENBb0JHLFVBQUMsV0FBRCxFQUFpQjtBQUNyQixjQUFLLGFBQUwsQ0FBbUIsV0FBbkIsQ0FBK0I7QUFDN0IsZUFBSyxHQUR3QjtBQUU3Qix1QkFBYTtBQUZnQixTQUEvQixFQUdHLENBQUMsV0FBRCxDQUhIO0FBSUQsT0F6QkUsRUF5QkEsVUFBQyxHQUFELEVBQVM7QUFDVixjQUFLLGFBQUwsQ0FBbUIsV0FBbkIsQ0FBK0I7QUFDN0IsaUJBQU8sSUFBSSxRQUFKO0FBRHNCLFNBQS9CO0FBR0QsT0E3QkU7O0FBK0JIO0FBL0JHLE9BZ0NGLElBaENFLENBZ0NHO0FBQUEsZUFBTSxNQUFLLFlBQUwsRUFBTjtBQUFBLE9BaENILEVBaUNGLEtBakNFLENBaUNJO0FBQUEsZUFBTSxNQUFLLFlBQUwsRUFBTjtBQUFBLE9BakNKLENBQVA7QUFrQ0Q7Ozs7OztBQUdILElBQUksVUFBVSxJQUFJLFlBQUosQ0FBaUIsSUFBakIsQ0FBZDs7QUFFQSxLQUFLLFNBQUwsR0FBaUIsVUFBQyxHQUFEO0FBQUEsU0FBUyxRQUFRLE9BQVIsQ0FBZ0IsSUFBSSxJQUFwQixDQUFUO0FBQUEsQ0FBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzXG4gKiBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmdcbiAqIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmxldCBsb2cgPSBzZWxmLmNvbnNvbGUubG9nLmJpbmQoc2VsZi5jb25zb2xlKTtcblxuY2xhc3MgSW1hZ2VIYW5kbGVyIHtcblxuICBjb25zdHJ1Y3RvciAod29ya2VyQ29udGV4dCkge1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICB0aGlzLndvcmtlckNvbnRleHQgPSB3b3JrZXJDb250ZXh0O1xuICB9XG5cbiAgZW5xdWV1ZSAodG9FbnF1ZXVlKSB7XG5cbiAgICAvLyBCYWlsIGlmIHRoaXMgVVJMIGlzIGFscmVhZHkgZW5xdWV1ZWQuXG4gICAgaWYgKHRoaXMucXVldWUuaW5kZXhPZih0b0VucXVldWUpID49IDApXG4gICAgICByZXR1cm47XG5cbiAgICB0aGlzLnF1ZXVlLnB1c2godG9FbnF1ZXVlKTtcbiAgICB0aGlzLnByb2Nlc3NRdWV1ZSgpO1xuICB9XG5cbiAgcHJvY2Vzc1F1ZXVlICgpIHtcblxuICAgIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybjtcblxuICAgIGxldCB1cmwgPSB0aGlzLnF1ZXVlLnNoaWZ0KCk7XG5cbiAgICAvLyBGZXRjaCB0aGUgaW1hZ2UuXG4gICAgcmV0dXJuIGZldGNoKHVybClcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgIHRoaXMud29ya2VyQ29udGV4dC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIGxvYWQ6IHRydWVcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud29ya2VyQ29udGV4dC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgZXJyb3I6IGBVbmFibGUgdG8gbG9hZCByZXNvdXJjZSB3aXRoIHVybCAke3VybH1gXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuYmxvYigpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gVHVybiBpdCBpbnRvIGFuIEltYWdlQml0bWFwLlxuICAgICAgICAudGhlbigoYmxvYkRhdGEpID0+IGNyZWF0ZUltYWdlQml0bWFwKGJsb2JEYXRhKSlcblxuICAgICAgICAvLyBQb3N0IGl0IGJhY2sgdG8gbWFpbiB0aHJlYWQuXG4gICAgICAgIC50aGVuKChpbWFnZUJpdG1hcCkgPT4ge1xuICAgICAgICAgIHRoaXMud29ya2VyQ29udGV4dC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIGltYWdlQml0bWFwOiBpbWFnZUJpdG1hcFxuICAgICAgICAgIH0sIFtpbWFnZUJpdG1hcF0pO1xuICAgICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICAgdGhpcy53b3JrZXJDb250ZXh0LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIGVycm9yOiBlcnIudG9TdHJpbmcoKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIENoZWNrIHRoZSBxdWV1ZS5cbiAgICAgICAgLnRoZW4oKCkgPT4gdGhpcy5wcm9jZXNzUXVldWUoKSlcbiAgICAgICAgLmNhdGNoKCgpID0+IHRoaXMucHJvY2Vzc1F1ZXVlKCkpXG4gIH1cbn1cblxubGV0IGhhbmRsZXIgPSBuZXcgSW1hZ2VIYW5kbGVyKHNlbGYpO1xuXG5zZWxmLm9ubWVzc2FnZSA9IChldnQpID0+IGhhbmRsZXIuZW5xdWV1ZShldnQuZGF0YSk7XG4iXX0=
