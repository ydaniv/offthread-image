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

var _offthreadImg = require('./offthread-img/offthread-img');

var _offthreadImg2 = _interopRequireDefault(_offthreadImg);

var _offscreenImg = require('./offscreen-img/offscreen-img');

var _offscreenImg2 = _interopRequireDefault(_offscreenImg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*!
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

// requestIdleCallback shim.
window.requestIdleCallback = window.requestIdleCallback || function (cb) {
  var start = Date.now();
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function timeRemaining() {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};

window.cancelIdleCallback = window.cancelIdleCallback || function (id) {
  clearTimeout(id);
};

// Expose OffthreadImage to global.


if (typeof window.OffthreadImage === 'undefined') window.OffthreadImage = _offthreadImg2.default;else console.warn('OffthreadImage already exists');

// Expose OffScreenImage to global.


if (typeof window.OffscreenImage === 'undefined') window.OffscreenImage = _offscreenImg2.default;else console.warn('OffscreenImage already exists');

},{"./offscreen-img/offscreen-img":2,"./offthread-img/offthread-img":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _offthreadImg = require('../offthread-img/offthread-img');

var _offthreadImg2 = _interopRequireDefault(_offthreadImg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OffscreenImage = function (_OffthreadImage) {
    _inherits(OffscreenImage, _OffthreadImage);

    _createClass(OffscreenImage, null, [{
        key: 'createFromSelector',


        /**
         * Factory method to create an array of <code>OffscreenImage</code>s based
         * on existing elements in the page.
         *
         * @static
         * @example
         *   let images = OffscreenImage.createFromSelector('.offscreen-img');
         * @param  {String} [selector=".offscreen-img"] - The selector for existing
         *   OffscreenImage elements in the page.
         * @return {Array} - An array of OffscreenImages.
         */
        value: function createFromSelector() {
            var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.offscreen-img';

            var images = [];
            var candidates = document.querySelectorAll(selector);
            var candidate = void 0;
            for (var c = 0; c < candidates.length; c++) {
                candidate = candidates[c];
                images.push(new OffscreenImage(candidate));
            }
            return images;
        }

        /**
         * Detects if OffscreenCanvas is available for use in the current browser.
         *
         * @static
         * @type {boolean}
         * @const
         */

    }, {
        key: 'available',
        get: function get() {
            return 'OffscreenCanvas' in window;
        }
    }]);

    function OffscreenImage() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var options = arguments[1];

        _classCallCheck(this, OffscreenImage);

        var _this = _possibleConstructorReturn(this, (OffscreenImage.__proto__ || Object.getPrototypeOf(OffscreenImage)).call(this, element));

        _this.options = options;
        _this.canvas_ = _this.element_;

        if (element.dataset.src) {
            _this.src = element.dataset.src;
        } else if (element.dataset.bgSrc) {
            _this.background_ = true;
            // If this is a background image, default the canvas to the dimensions of
            // the container element.
            _this.width_ = _this.element_.offsetWidth;
            _this.height_ = _this.element_.offsetHeight;

            _this.backgroundSize_ = window.getComputedStyle(_this.element_).backgroundSize;

            _this.src = element.dataset.bgSrc;
        }
        return _this;
    }

    _createClass(OffscreenImage, [{
        key: 'imageBitmap',
        set: function set(imageBitmap_) {
            throw new Error('Can not set bitmap, control has been transferred to offscreen');
        }

        /**
         * The source URL of the image.
         *
         * @property {String} - The image URL.
         */

    }, {
        key: 'src',
        get: function get() {
            return this.src_;
        },
        set: function set(src_) {
            this.src_ = src_;
            this.status_ = OffscreenImage.STATUS.LOAD_STARTED;
            offscreenHandler.enqueue(this);
        }
    }]);

    return OffscreenImage;
}(_offthreadImg2.default);

exports.default = OffscreenImage;

var OffscreenImageHandler = function () {
    function OffscreenImageHandler() {
        var _this2 = this;

        _classCallCheck(this, OffscreenImageHandler);

        var currentScriptDir = this.getDirectoryName_(this.convertURLToAbsolute_(document.currentScript.src));

        this.worker = new Worker(currentScriptDir + '/offscreen-img-worker.js');
        this.worker.onmessage = function (evt) {
            return _this2.handleIncomingMessage_(evt.data);
        };
        this.jobs = {};
    }

    /**
     * Enqueues an element, storing a reference to it against its URL. When the
     * worker returns the ImageBitmap data for the URL, it (and any other
     * elements) waiting for that ImageBitmap will be notified.
     *
     * @param  {OffscreenImage} offscreenImage - The OffscreenImage instance.
     */


    _createClass(OffscreenImageHandler, [{
        key: 'enqueue',
        value: function enqueue(offscreenImage) {
            if (!(offscreenImage instanceof OffscreenImage)) {
                throw new Error('Enqueue expects an OffscreenImage');
            }

            // Ensure the URL is absolute.
            var src = this.convertURLToAbsolute_(offscreenImage.src);
            var canvas = offscreenImage.canvas_.transferControlToOffscreen();
            var options = Object.assign({
                width: offscreenImage.width_,
                height: offscreenImage.height_,
                drawWidth: offscreenImage.drawWidth_,
                drawHeight: offscreenImage.drawHeight_,
                background: offscreenImage.background_,
                backgroundSize: offscreenImage.backgroundSize_,
                filter: 'invert(100%)'
            }, offscreenImage.options);

            if (typeof this.jobs[src] === 'undefined') {
                this.jobs[src] = [];
            }

            this.jobs[src].push(offscreenImage);

            this.worker.postMessage({
                src: src,
                canvas: canvas,
                options: options
            }, [canvas]);

            offscreenImage.status = OffscreenImage.STATUS.LOAD_STARTED;
        }

        /**
         * Gets the directory name from a URL.
         *
         * @private
         * @param  {String} url - The URL to start with.
         * @return {String} The URL excluding the basename.
         */

    }, {
        key: 'getDirectoryName_',
        value: function getDirectoryName_(url) {
            return url.replace(/[^\/]*$/, '');
        }

        /**
         * Converts a URL to an absolute one. This is to ensure that paths work based
         * on the current page's URL.
         *
         * @private
         * @param  {String} url - The URL to convert.
         * @return {String} - An absolute URL.
         */

    }, {
        key: 'convertURLToAbsolute_',
        value: function convertURLToAbsolute_(url) {
            if (typeof url !== 'string') {
                throw new Error('convertURLToAbsolute_ expects a string');
            }

            if (url.startsWith('http')) {
                return url;
            } else {
                var currentPath = this.getDirectoryName_(window.location.href);
                var absoluteURL = new URL(currentPath + url);
                return absoluteURL.toString();
            }
        }

        /**
         * Handles the incoming messages from the worker.
         *
         * @private
         * @param  {Object} message - The message from the worker.
         */

    }, {
        key: 'handleIncomingMessage_',
        value: function handleIncomingMessage_(message) {

            if (message.error) {
                return console.warn(message.error);
            }

            var url = message.url;
            var elements = this.jobs[url];
            var element = void 0;

            if (message.load) {
                for (var e = 0; e < elements.length; e++) {
                    element = elements[e];
                    element.status = OffscreenImage.STATUS.LOADED;
                }
            } else if (message.done) {
                for (var _e = 0; _e < elements.length; _e++) {
                    element = elements[_e];
                    element.status = OffscreenImage.STATUS.DECODED;
                }
                // These elements no longer need updating, so purge the list.
                this.jobs[url].length = 0;
            }
        }
    }]);

    return OffscreenImageHandler;
}();

var offscreenHandler = new OffscreenImageHandler();

},{"../offthread-img/offthread-img":3}],3:[function(require,module,exports){
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

/**
 * A helper library that decodes images off-main thread using
 * <code>createImageBitmap</code> in a worker, and then transfers them back
 * to the main thread and draws them into a canvas.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OffthreadImage = function () {
  _createClass(OffthreadImage, null, [{
    key: 'createFromSelector',


    /**
     * Factory method to create an array of <code>OffthreadImage</code>s based
     * on existing elements in the page.
     *
     * @static
     * @example
     *   let images = OffthreadImage.createFromSelector('.offthread-img');
     * @param  {String} [selector=".offthread-img"] - The selector for existing
     *   OffthreadImage elements in the page.
     * @return {Array} - An array of OffThreadImages.
     */
    value: function createFromSelector() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.offthread-img';

      var images = [];
      var candidates = document.querySelectorAll(selector);
      var candidate = void 0;
      for (var c = 0; c < candidates.length; c++) {
        candidate = candidates[c];
        images.push(new OffthreadImage(candidate));
      }
      return images;
    }

    /**
     * @typedef OffthreadImageStatus
     * @type Object
     * @property {String} INERT The OffthreadImage is inert; no src applied.
     * @property {String} LOAD_STARTED src applied; load has started.
     * @property {String} LOADED The image has loaded, but not been decoded.
     * @property {String} DECODED The image has been decoded, but not painted.
     * @property {String} PAINTED The image has been painted to a canvas element.
     */

    /**
     * The enumeration of status codes an OffthreadImage can have.
     *
     * @static
     * @type {OffthreadImageStatus}
     * @const
     */

  }, {
    key: 'version',


    /**
     * Gets the version number.
     *
     * @type {String}
     * @const
     */
    get: function get() {
      return '0.1.0';
    }
  }, {
    key: 'STATUS',
    get: function get() {
      return {
        INERT: 'inert',
        LOAD_STARTED: 'loadstarted',
        LOADED: 'load',
        DECODED: 'decoded',
        PAINTED: 'painted'
      };
    }

    /**
     * The minimum amount of time, in milliseconds, that drawing the image should
     * take. It's guesstimated at 10ms, and the OffthreadImage will wait for an
     * idle callback (using <code>requestIdleCallback</code>) of that length.
     *
     * @static
     * @type {Number}
     * @const
     */

  }, {
    key: 'MIN_INSERT_IDLE_WINDOW',
    get: function get() {
      return 10;
    }

    /**
     * Detects if createImageBitmap is available for use in the current browser.
     *
     * @static
     * @type {boolean}
     * @const
     */

  }, {
    key: 'available',
    get: function get() {
      return 'createImageBitmap' in window;
    }

    /**
     * Creates a new OffthreadImage around an existing element.
     *
     * @example
     * let target = document.querySelector('.offthread-img');
     * let img = new OffthreadImage(target);
     * target.addEventListener('decoded', function () {
     *   // The image has been decoded... remove the spinner.
     *   target.classList.remove('spinner');
     * });
     * img.src = 'image.png';
     *
     * @param  {HTMLElement} element The target element to use.
     */

  }]);

  function OffthreadImage() {
    var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, OffthreadImage);

    if (element === null) throw new Error('OffthreadImage() requires a target element');

    this.id_ = Math.round(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
    this.canvas_ = null;
    this.ctx_ = null;
    this.element_ = element;
    this.onLoad_ = null;
    this.onDecode_ = null;
    this.status = OffthreadImage.STATUS.INERT;
    this.src_ = null;
    this.width_ = element.getAttribute('width');
    this.height_ = element.getAttribute('height');
    this.drawWidth_ = this.width_;
    this.drawHeight_ = this.height_;
    this.background_ = false;

    if (element.getAttribute('src')) {
      this.src = element.getAttribute('src');
    } else if (element.getAttribute('bg-src')) {
      this.src = element.getAttribute('bg-src');
      this.background_ = true;
    }

    if (!(element.getAttribute('alt') || element.getAttribute('aria-label'))) console.warn('The element does have an alt or aria-label attribute.');else if (!element.getAttribute('aria-label')) element.setAttribute('aria-label', element.getAttribute('alt'));

    if (!element.getAttribute('role')) element.setAttribute('role', 'img');
  }

  /**
   * The source URL of the image.
   *
   * @property {String} - The image URL.
   */


  _createClass(OffthreadImage, [{
    key: 'setCanvasDimensions_',


    /**
     * Sets the canvas's dimensions based on the ImageBitmap data provided.
     *
     * @private
     * @param {ImageBitmap} imageBitmap - The ImageBitmap to use for resizing the
     *   canvas (if necessary).
     */
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
     * Fires an event on the element.
     *
     * @private
     * @param {String} eventName - The name of the event.
     * @param {} [detail=null] - The data to include in the event.
     * @param {Boolean} [bubbles=true] - Whether the event should bubble.
     * @param {Boolean} [cancelable=true] - Whether the event is cancelable.
     */

  }, {
    key: 'fire_',
    value: function fire_(eventName) {
      var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var bubbles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var cancelable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      var evt = new CustomEvent(eventName, { detail: detail, bubbles: bubbles, cancelable: cancelable });
      this.element_.dispatchEvent(evt);
    }
  }, {
    key: 'src',
    get: function get() {
      return this.src_;
    },
    set: function set(src_) {
      this.src_ = src_;
      this.status_ = OffthreadImage.STATUS.LOAD_STARTED;
      imgHandler.enqueue(this);
    }

    /**
     * Sets and gets the current status of the image
     *
     * @property {OffthreadImageStatus} - The image's status.
     */

  }, {
    key: 'status',
    set: function set(status_) {

      switch (status_) {
        case OffthreadImage.STATUS.INERT:
        case OffthreadImage.STATUS.LOAD_STARTED:
        case OffthreadImage.STATUS.LOADED:
        case OffthreadImage.STATUS.DECODED:
        case OffthreadImage.STATUS.PAINTED:
          this.fire_(status_);
          break;

        default:
          throw new Error('Unknown status: ' + status_);
      }

      this.status_ = status_;
    },
    get: function get() {
      return this.status_;
    }

    /**
     * Sets the ImageBitmap on the canvas. The bitmap data is discarded
     * immediately after it has been drawn so as to keep memory usage down.
     * Therefore calling the <code>imageBitmap</code> getter will always return
     * null.
     *
     * @property {ImageBitmap} - The ImageBitmap data to draw to the canvas.
     */

  }, {
    key: 'imageBitmap',
    set: function set(imageBitmap_) {
      var _this = this;

      var renderBitmapData = function renderBitmapData(deadline) {

        // Make sure there is enough time to insert the image. Anything less than
        // the minimum window is unlikely to be enough, so hold reschedule if
        // needed.
        if (deadline.timeRemaining() < OffthreadImage.MIN_INSERT_IDLE_WINDOW) return requestIdleCallback(renderBitmapData);

        if (_this.canvas_ === null) {
          _this.canvas_ = document.createElement('canvas');
          _this.canvas_.setAttribute('aria-hidden', 'true');
        }

        if (_this.ctx_ === null) _this.ctx_ = _this.canvas_.getContext('2d');

        // Set the dimensions of the canvas.
        _this.setCanvasDimensions_(imageBitmap_);
        _this.ctx_.drawImage(imageBitmap_, 0, 0, _this.drawWidth_, _this.drawHeight_);

        _this.element_.appendChild(_this.canvas_);
        _this.status = OffthreadImage.STATUS.PAINTED;
      };

      requestIdleCallback(renderBitmapData);
    },
    get: function get() {
      return null;
    }
  }]);

  return OffthreadImage;
}();

exports.default = OffthreadImage;

var OffthreadImageHandler = function () {

  /**
   * The coordinator for all <code>OffthreadImage</code> instances. Spins up the
   * worker and has it enqueue image loads by URL. When an ImageBitmap is
   * returned from the worker it notifies all <code>OffthreadImage</code>s. It
   * is also responsible for setting the status of all
   * <code>OffthreadImage</code>s, i.e. loaded, decoded, etc.
   *
   * @private
   */
  function OffthreadImageHandler() {
    var _this2 = this;

    _classCallCheck(this, OffthreadImageHandler);

    var currentScriptDir = this.getDirectoryName_(this.convertURLToAbsolute_(document.currentScript.src));

    this.worker = new Worker(currentScriptDir + '/offthread-img-worker.js');
    this.worker.onmessage = function (evt) {
      return _this2.handleIncomingMessage_(evt.data);
    };
    this.jobs = {};
  }

  /**
   * Enqueues an element, storing a reference to it against its URL. When the
   * worker returns the ImageBitmap data for the URL, it (and any other
   * elements) waiting for that ImageBitmap will be notified.
   *
   * @param  {OffthreadImage} offthreadImage - The OffthreadImage instance.
   */


  _createClass(OffthreadImageHandler, [{
    key: 'enqueue',
    value: function enqueue(offthreadImage) {
      if (!(offthreadImage instanceof OffthreadImage)) throw new Error('Enqueue expects an OffthreadImage');

      // Ensure the URL is absolute.
      var src = this.convertURLToAbsolute_(offthreadImage.src);

      if (typeof this.jobs[src] === 'undefined') this.jobs[src] = [];

      this.jobs[src].push(offthreadImage);
      this.worker.postMessage(src);

      offthreadImage.status = OffthreadImage.STATUS.LOAD_STARTED;
    }

    /**
     * Gets the directory name from a URL.
     *
     * @private
     * @param  {String} url - The URL to start with.
     * @return {String} The URL excluding the basename.
     */

  }, {
    key: 'getDirectoryName_',
    value: function getDirectoryName_(url) {
      return url.replace(/[^\/]*$/, '');
    }

    /**
     * Converts a URL to an absolute one. This is to ensure that paths work based
     * on the current page's URL.
     *
     * @private
     * @param  {String} url - The URL to convert.
     * @return {String} - An absolute URL.
     */

  }, {
    key: 'convertURLToAbsolute_',
    value: function convertURLToAbsolute_(url) {

      if (typeof url !== 'string') throw new Error('convertURLToAbsolute_ expects a string');

      if (url.startsWith('http')) return url;else {
        var currentPath = this.getDirectoryName_(window.location.href);
        var absoluteURL = new URL(currentPath + url);
        return absoluteURL.toString();
      }
    }

    /**
     * Handles the incoming messages from the worker.
     *
     * @private
     * @param  {Object} message - The message from the worker.
     */

  }, {
    key: 'handleIncomingMessage_',
    value: function handleIncomingMessage_(message) {

      if (message.error) {
        return console.warn(message.error);
      }

      var url = message.url;
      var elements = this.jobs[url];
      var element = void 0;

      if (message.load) {
        for (var e = 0; e < elements.length; e++) {
          element = elements[e];
          element.status = OffthreadImage.STATUS.LOADED;
        }
        return;
      }

      var imageBitmap = message.imageBitmap;

      for (var _e = 0; _e < elements.length; _e++) {
        element = elements[_e];
        element.status = OffthreadImage.STATUS.DECODED;
        element.imageBitmap = imageBitmap;
      }

      // These elements no longer need updating, so purge the list.
      this.jobs[url].length = 0;
    }
  }]);

  return OffthreadImageHandler;
}();

var imgHandler = new OffthreadImageHandler();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ2xvYmFsLmpzIiwic3JjL29mZnNjcmVlbi1pbWcvb2Zmc2NyZWVuLWltZy5qcyIsInNyYy9vZmZ0aHJlYWQtaW1nL29mZnRocmVhZC1pbWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ21EQTs7OztBQVFBOzs7Ozs7QUEzREE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkE7QUFDQSxPQUFPLG1CQUFQLEdBQTZCLE9BQU8sbUJBQVAsSUFDM0IsVUFBVSxFQUFWLEVBQWM7QUFDWixNQUFJLFFBQVEsS0FBSyxHQUFMLEVBQVo7QUFDQSxTQUFPLFdBQVcsWUFBTTtBQUN0QixPQUFHO0FBQ0Qsa0JBQVksS0FEWDtBQUVELHFCQUFlO0FBQUEsZUFBTSxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksTUFBTSxLQUFLLEdBQUwsS0FBYSxLQUFuQixDQUFaLENBQU47QUFBQTtBQUZkLEtBQUg7QUFJRCxHQUxNLEVBS0osQ0FMSSxDQUFQO0FBTUQsQ0FUSDs7QUFXQSxPQUFPLGtCQUFQLEdBQTRCLE9BQU8sa0JBQVAsSUFDMUIsVUFBVSxFQUFWLEVBQWM7QUFDWixlQUFhLEVBQWI7QUFDRCxDQUhIOztBQU1BOzs7QUFHQSxJQUFJLE9BQU8sT0FBTyxjQUFkLEtBQWlDLFdBQXJDLEVBQ0UsT0FBTyxjQUFQLDBCQURGLEtBR0UsUUFBUSxJQUFSLENBQWEsK0JBQWI7O0FBRUY7OztBQUdBLElBQUksT0FBTyxPQUFPLGNBQWQsS0FBaUMsV0FBckMsRUFDRSxPQUFPLGNBQVAsMEJBREYsS0FHRSxRQUFRLElBQVIsQ0FBYSwrQkFBYjs7Ozs7Ozs7Ozs7QUNoRUY7Ozs7Ozs7Ozs7OztJQUVxQixjOzs7Ozs7O0FBRWpCOzs7Ozs7Ozs7Ozs2Q0FXd0Q7QUFBQSxnQkFBN0IsUUFBNkIsdUVBQWxCLGdCQUFrQjs7QUFDcEQsZ0JBQUksU0FBUyxFQUFiO0FB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QUFlLE1BQWYsQ0FBc0IsTUFBdkM7QUFDRDtBQUNEO0FBQ0Q7O0FBRUQsVUFBSSxjQUFjLFFBQVEsV0FBMUI7O0FBRUEsV0FBSyxJQUFJLEtBQUksQ0FBYixFQUFnQixLQUFJLFNBQVMsTUFBN0IsRUFBcUMsSUFBckMsRUFBMEM7QUFDeEMsa0JBQVUsU0FBUyxFQUFULENBQVY7QUFDQSxnQkFBUSxNQUFSLEdBQWlCLGVBQWUsTUFBZixDQUFzQixPQUF2QztBQUNBLGdCQUFRLFdBQVIsR0FBc0IsV0FBdEI7QUFDRDs7QUFFRDtBQUNBLFdBQUssSUFBTCxDQUFVLEdBQVYsRUFBZSxNQUFmLEdBQXdCLENBQXhCO0FBQ0Q7Ozs7OztBQUdILElBQUksYUFBYSxJQUFJLHFCQUFKLEVBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCIvKipcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qIVxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzXG4gKiBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmdcbiAqIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vLyByZXF1ZXN0SWRsZUNhbGxiYWNrIHNoaW0uXG53aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayA9IHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrIHx8XG4gIGZ1bmN0aW9uIChjYikge1xuICAgIGxldCBzdGFydCA9IERhdGUubm93KCk7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY2Ioe1xuICAgICAgICBkaWRUaW1lb3V0OiBmYWxzZSxcbiAgICAgICAgdGltZVJlbWFpbmluZzogKCkgPT4gTWF0aC5tYXgoMCwgNTAgLSAoRGF0ZS5ub3coKSAtIHN0YXJ0KSlcbiAgICAgIH0pO1xuICAgIH0sIDEpO1xuICB9XG5cbndpbmRvdy5jYW5jZWxJZGxlQ2FsbGJhY2sgPSB3aW5kb3cuY2FuY2VsSWRsZUNhbGxiYWNrIHx8XG4gIGZ1bmN0aW9uIChpZCkge1xuICAgIGNsZWFyVGltZW91dChpZCk7XG4gIH1cblxuXG4vLyBFeHBvc2UgT2ZmdGhyZWFkSW1hZ2UgdG8gZ2xvYmFsLlxuaW1wb3J0IE9mZnRocmVhZEltYWdlIGZyb20gJy4vb2ZmdGhyZWFkLWltZy9vZmZ0aHJlYWQtaW1nJztcblxuaWYgKHR5cGVvZiB3aW5kb3cuT2ZmdGhyZWFkSW1hZ2UgPT09ICd1bmRlZmluZWQnKVxuICB3aW5kb3cuT2ZmdGhyZWFkSW1hZ2UgPSBPZmZ0aHJlYWRJbWFnZTtcbmVsc2VcbiAgY29uc29sZS53YXJuKCdPZmZ0aHJlYWRJbWFnZSBhbHJlYWR5IGV4aXN0cycpO1xuXG4vLyBFeHBvc2UgT2ZmU2NyZWVuSW1hZ2UgdG8gZ2xvYmFsLlxuaW1wb3J0IE9mZnNjcmVlbkltYWdlIGZyb20gJy4vb2Zmc2NyZWVuLWltZy9vZmZzY3JlZW4taW1nJztcblxuaWYgKHR5cGVvZiB3aW5kb3cuT2Zmc2NyZWVuSW1hZ2UgPT09ICd1bmRlZmluZWQnKVxuICB3aW5kb3cuT2Zmc2NyZWVuSW1hZ2UgPSBPZmZzY3JlZW5JbWFnZTtcbmVsc2VcbiAgY29uc29sZS53YXJuKCdPZmZzY3JlZW5JbWFnZSBhbHJlYWR5IGV4aXN0cycpO1xuIiwiaW1wb3J0IE9mZnRocmVhZEltYWdlIGZyb20gJy4uL29mZnRocmVhZC1pbWcvb2ZmdGhyZWFkLWltZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9mZnNjcmVlbkltYWdlIGV4dGVuZHMgT2ZmdGhyZWFkSW1hZ2Uge1xuXG4gICAgLyoqXG4gICAgICogRmFjdG9yeSBtZXRob2QgdG8gY3JlYXRlIGFuIGFycmF5IG9mIDxjb2RlPk9mZnNjcmVlbkltYWdlPC9jb2RlPnMgYmFzZWRcbiAgICAgKiBvbiBleGlzdGluZyBlbGVtZW50cyBpbiB0aGUgcGFnZS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICAgbGV0IGltYWdlcyA9IE9mZnNjcmVlbkltYWdlLmNyZWF0ZUZyb21TZWxlY3RvcignLm9mZnNjcmVlbi1pbWcnKTtcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IFtzZWxlY3Rvcj1cIi5vZmZzY3JlZW4taW1nXCJdIC0gVGhlIHNlbGVjdG9yIGZvciBleGlzdGluZ1xuICAgICAqICAgT2Zmc2NyZWVuSW1hZ2UgZWxlbWVudHMgaW4gdGhlIHBhZ2UuXG4gICAgICogQHJldHVybiB7QXJyYXl9IC0gQW4gYXJyYXkgb2YgT2Zmc2NyZWVuSW1hZ2VzLlxuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGVGcm9tU2VsZWN0b3IgKHNlbGVjdG9yID0gJy5vZmZzY3JlZW4taW1nJykge1xuICAgICAgICBsZXQgaW1hZ2VzID0gW107XG4gICAgICAgIGxldCBjYW5kaWRhdGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgICAgIGxldCBjYW5kaWRhdGU7XG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY2FuZGlkYXRlcy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgY2FuZGlkYXRlID0gY2FuZGlkYXRlc1tjXTtcbiAgICAgICAgICAgIGltYWdlcy5wdXNoKG5ldyBPZmZzY3JlZW5JbWFnZShjYW5kaWRhdGUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW1hZ2VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERldGVjdHMgaWYgT2Zmc2NyZWVuQ2FudmFzIGlzIGF2YWlsYWJsZSBmb3IgdXNlIGluIHRoZSBjdXJyZW50IGJyb3dzZXIuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGNvbnN0XG4gICAgICovXG4gICAgc3RhdGljIGdldCBhdmFpbGFibGUgKCkge1xuICAgICAgICByZXR1cm4gKCdPZmZzY3JlZW5DYW52YXMnIGluIHdpbmRvdyk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IgKGVsZW1lbnQ9bnVsbCwgb3B0aW9ucykge1xuICAgICAgICBzdXBlcihlbGVtZW50KTtcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLmNhbnZhc18gPSB0aGlzLmVsZW1lbnRfO1xuXG4gICAgICAgIGlmIChlbGVtZW50LmRhdGFzZXQuc3JjKSB7XG4gICAgICAgICAgICB0aGlzLnNyYyA9IGVsZW1lbnQuZGF0YXNldC5zcmM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZWxlbWVudC5kYXRhc2V0LmJnU3JjKSB7XG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmRfID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSBiYWNrZ3JvdW5kIGltYWdlLCBkZWZhdWx0IHRoZSBjYW52YXMgdG8gdGhlIGRpbWVuc2lvbnMgb2ZcbiAgICAgICAgICAgIC8vIHRoZSBjb250YWluZXIgZWxlbWVudC5cbiAgICAgICAgICAgIHRoaXMud2lkdGhfID0gdGhpcy5lbGVtZW50Xy5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0XyA9IHRoaXMuZWxlbWVudF8ub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmRTaXplXyA9XG4gICAgICAgICAgICAgICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50XykuYmFja2dyb3VuZFNpemU7XG5cbiAgICAgICAgICAgIHRoaXMuc3JjID0gZWxlbWVudC5kYXRhc2V0LmJnU3JjO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0IGltYWdlQml0bWFwIChpbWFnZUJpdG1hcF8pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gbm90IHNldCBiaXRtYXAsIGNvbnRyb2wgaGFzIGJlZW4gdHJhbnNmZXJyZWQgdG8gb2Zmc2NyZWVuJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIHNvdXJjZSBVUkwgb2YgdGhlIGltYWdlLlxuICAgICAqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IC0gVGhlIGltYWdlIFVSTC5cbiAgICAgKi9cbiAgICBnZXQgc3JjICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3JjXztcbiAgICB9XG5cbiAgICBzZXQgc3JjIChzcmNfKSB7XG4gICAgICAgIHRoaXMuc3JjXyA9IHNyY187XG4gICAgICAgIHRoaXMuc3RhdHVzXyA9IE9mZnNjcmVlbkltYWdlLlNUQVRVUy5MT0FEX1NUQVJURUQ7XG4gICAgICAgIG9mZnNjcmVlbkhhbmRsZXIuZW5xdWV1ZSh0aGlzKTtcbiAgICB9XG59XG5cbmNsYXNzIE9mZnNjcmVlbkltYWdlSGFuZGxlciB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBsZXQgY3VycmVudFNjcmlwdERpciA9XG4gICAgICAgICAgICB0aGlzLmdldERpcmVjdG9yeU5hbWVfKFxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFVSTFRvQWJzb2x1dGVfKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIoYCR7Y3VycmVudFNjcmlwdERpcn0vb2Zmc2NyZWVuLWltZy13b3JrZXIuanNgKTtcbiAgICAgICAgdGhpcy53b3JrZXIub25tZXNzYWdlID0gKGV2dCkgPT4gdGhpcy5oYW5kbGVJbmNvbWluZ01lc3NhZ2VfKGV2dC5kYXRhKTtcbiAgICAgICAgdGhpcy5qb2JzID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW5xdWV1ZXMgYW4gZWxlbWVudCwgc3RvcmluZyBhIHJlZmVyZW5jZSB0byBpdCBhZ2FpbnN0IGl0cyBVUkwuIFdoZW4gdGhlXG4gICAgICogd29ya2VyIHJldHVybnMgdGhlIEltYWdlQml0bWFwIGRhdGEgZm9yIHRoZSBVUkwsIGl0IChhbmQgYW55IG90aGVyXG4gICAgICogZWxlbWVudHMpIHdhaXRpbmcgZm9yIHRoYXQgSW1hZ2VCaXRtYXAgd2lsbCBiZSBub3RpZmllZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge09mZnNjcmVlbkltYWdlfSBvZmZzY3JlZW5JbWFnZSAtIFRoZSBPZmZzY3JlZW5JbWFnZSBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBlbnF1ZXVlIChvZmZzY3JlZW5JbWFnZSkge1xuICAgICAgICBpZiAoIShvZmZzY3JlZW5JbWFnZSBpbnN0YW5jZW9mIE9mZnNjcmVlbkltYWdlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbnF1ZXVlIGV4cGVjdHMgYW4gT2Zmc2NyZWVuSW1hZ2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVuc3VyZSB0aGUgVVJMIGlzIGFic29sdXRlLlxuICAgICAgICBsZXQgc3JjID0gdGhpcy5jb252ZXJ0VVJMVG9BYnNvbHV0ZV8ob2Zmc2NyZWVuSW1hZ2Uuc3JjKTtcbiAgICAgICAgbGV0IGNhbnZhcyA9IG9mZnNjcmVlbkltYWdlLmNhbnZhc18udHJhbnNmZXJDb250cm9sVG9PZmZzY3JlZW4oKTtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgd2lkdGg6IG9mZnNjcmVlbkltYWdlLndpZHRoXyxcbiAgICAgICAgICAgIGhlaWdodDogb2Zmc2NyZWVuSW1hZ2UuaGVpZ2h0XyxcbiAgICAgICAgICAgIGRyYXdXaWR0aDogb2Zmc2NyZWVuSW1hZ2UuZHJhd1dpZHRoXyxcbiAgICAgICAgICAgIGRyYXdIZWlnaHQ6IG9mZnNjcmVlbkltYWdlLmRyYXdIZWlnaHRfLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogb2Zmc2NyZWVuSW1hZ2UuYmFja2dyb3VuZF8sXG4gICAgICAgICAgICBiYWNrZ3JvdW5kU2l6ZTogb2Zmc2NyZWVuSW1hZ2UuYmFja2dyb3VuZFNpemVfLFxuICAgICAgICAgICAgZmlsdGVyOiAnaW52ZXJ0KDEwMCUpJ1xuICAgICAgICB9LCBvZmZzY3JlZW5JbWFnZS5vcHRpb25zKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuam9ic1tzcmNdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5qb2JzW3NyY10gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuam9ic1tzcmNdLnB1c2gob2Zmc2NyZWVuSW1hZ2UpO1xuXG4gICAgICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHNyYyxcbiAgICAgICAgICAgIGNhbnZhcyxcbiAgICAgICAgICAgIG9wdGlvbnNcbiAgICAgICAgfSwgW2NhbnZhc10pO1xuXG4gICAgICAgIG9mZnNjcmVlbkltYWdlLnN0YXR1cyA9IE9mZnNjcmVlbkltYWdlLlNUQVRVUy5MT0FEX1NUQVJURUQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgZGlyZWN0b3J5IG5hbWUgZnJvbSBhIFVSTC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSB1cmwgLSBUaGUgVVJMIHRvIHN0YXJ0IHdpdGguXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBUaGUgVVJMIGV4Y2x1ZGluZyB0aGUgYmFzZW5hbWUuXG4gICAgICovXG4gICAgZ2V0RGlyZWN0b3J5TmFtZV8gKHVybCkge1xuICAgICAgICByZXR1cm4gdXJsLnJlcGxhY2UoL1teXFwvXSokLywgJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGEgVVJMIHRvIGFuIGFic29sdXRlIG9uZS4gVGhpcyBpcyB0byBlbnN1cmUgdGhhdCBwYXRocyB3b3JrIGJhc2VkXG4gICAgICogb24gdGhlIGN1cnJlbnQgcGFnZSdzIFVSTC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSB1cmwgLSBUaGUgVVJMIHRvIGNvbnZlcnQuXG4gICAgICogQHJldHVybiB7U3RyaW5nfSAtIEFuIGFic29sdXRlIFVSTC5cbiAgICAgKi9cbiAgICBjb252ZXJ0VVJMVG9BYnNvbHV0ZV8gKHVybCkge1xuICAgICAgICBpZiAodHlwZW9mIHVybCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY29udmVydFVSTFRvQWJzb2x1dGVfIGV4cGVjdHMgYSBzdHJpbmcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aCgnaHR0cCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRQYXRoID0gdGhpcy5nZXREaXJlY3RvcnlOYW1lXyh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgICAgICAgICBsZXQgYWJzb2x1dGVVUkwgPSBuZXcgVVJMKGN1cnJlbnRQYXRoICsgdXJsKTtcbiAgICAgICAgICAgIHJldHVybiBhYnNvbHV0ZVVSTC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyB0aGUgaW5jb21pbmcgbWVzc2FnZXMgZnJvbSB0aGUgd29ya2VyLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG1lc3NhZ2UgLSBUaGUgbWVzc2FnZSBmcm9tIHRoZSB3b3JrZXIuXG4gICAgICovXG4gICAgaGFuZGxlSW5jb21pbmdNZXNzYWdlXyAobWVzc2FnZSkge1xuXG4gICAgICAgIGlmIChtZXNzYWdlLmVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKG1lc3NhZ2UuZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHVybCA9IG1lc3NhZ2UudXJsO1xuICAgICAgICBsZXQgZWxlbWVudHMgPSB0aGlzLmpvYnNbdXJsXTtcbiAgICAgICAgbGV0IGVsZW1lbnQ7XG5cbiAgICAgICAgaWYgKG1lc3NhZ2UubG9hZCkge1xuICAgICAgICAgICAgZm9yIChsZXQgZSA9IDA7IGUgPCBlbGVtZW50cy5sZW5ndGg7IGUrKykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50c1tlXTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0YXR1cyA9IE9mZnNjcmVlbkltYWdlLlNUQVRVUy5MT0FERUQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobWVzc2FnZS5kb25lKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBlID0gMDsgZSA8IGVsZW1lbnRzLmxlbmd0aDsgZSsrKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnRzW2VdO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3RhdHVzID0gT2Zmc2NyZWVuSW1hZ2UuU1RBVFVTLkRFQ09ERUQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUaGVzZSBlbGVtZW50cyBubyBsb25nZXIgbmVlZCB1cGRhdGluZywgc28gcHVyZ2UgdGhlIGxpc3QuXG4gICAgICAgICAgICB0aGlzLmpvYnNbdXJsXS5sZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5sZXQgb2Zmc2NyZWVuSGFuZGxlciA9IG5ldyBPZmZzY3JlZW5JbWFnZUhhbmRsZXIoKTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzXG4gKiBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmdcbiAqIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQSBoZWxwZXIgbGlicmFyeSB0aGF0IGRlY29kZXMgaW1hZ2VzIG9mZi1tYWluIHRocmVhZCB1c2luZ1xuICogPGNvZGU+Y3JlYXRlSW1hZ2VCaXRtYXA8L2NvZGU+IGluIGEgd29ya2VyLCBhbmQgdGhlbiB0cmFuc2ZlcnMgdGhlbSBiYWNrXG4gKiB0byB0aGUgbWFpbiB0aHJlYWQgYW5kIGRyYXdzIHRoZW0gaW50byBhIGNhbnZhcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT2ZmdGhyZWFkSW1hZ2Uge1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB2ZXJzaW9uIG51bWJlci5cbiAgICpcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQGNvbnN0XG4gICAqL1xuICBzdGF0aWMgZ2V0IHZlcnNpb24gKCkge1xuICAgIHJldHVybiAnQFZFUlNJT05AJztcbiAgfVxuXG4gIC8qKlxuICAgKiBGYWN0b3J5IG1ldGhvZCB0byBjcmVhdGUgYW4gYXJyYXkgb2YgPGNvZGU+T2ZmdGhyZWFkSW1hZ2U8L2NvZGU+cyBiYXNlZFxuICAgKiBvbiBleGlzdGluZyBlbGVtZW50cyBpbiB0aGUgcGFnZS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAZXhhbXBsZVxuICAgKiAgIGxldCBpbWFnZXMgPSBPZmZ0aHJlYWRJbWFnZS5jcmVhdGVGcm9tU2VsZWN0b3IoJy5vZmZ0aHJlYWQtaW1nJyk7XG4gICAqIEBwYXJhbSAge1N0cmluZ30gW3NlbGVjdG9yPVwiLm9mZnRocmVhZC1pbWdcIl0gLSBUaGUgc2VsZWN0b3IgZm9yIGV4aXN0aW5nXG4gICAqICAgT2ZmdGhyZWFkSW1hZ2UgZWxlbWVudHMgaW4gdGhlIHBhZ2UuXG4gICAqIEByZXR1cm4ge0FycmF5fSAtIEFuIGFycmF5IG9mIE9mZlRocmVhZEltYWdlcy5cbiAgICovXG4gIHN0YXRpYyBjcmVhdGVGcm9tU2VsZWN0b3IgKHNlbGVjdG9yID0gJy5vZmZ0aHJlYWQtaW1nJykge1xuICAgIGxldCBpbWFnZXMgPSBbXTtcbiAgICBsZXQgY2FuZGlkYXRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgIGxldCBjYW5kaWRhdGU7XG4gICAgZm9yIChsZXQgYyA9IDA7IGMgPCBjYW5kaWRhdGVzLmxlbmd0aDsgYysrKSB7XG4gICAgICBjYW5kaWRhdGUgPSBjYW5kaWRhdGVzW2NdO1xuICAgICAgaW1hZ2VzLnB1c2gobmV3IE9mZnRocmVhZEltYWdlKGNhbmRpZGF0ZSkpO1xuICAgIH1cbiAgICByZXR1cm4gaW1hZ2VzO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIE9mZnRocmVhZEltYWdlU3RhdHVzXG4gICAqIEB0eXBlIE9iamVjdFxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gSU5FUlQgVGhlIE9mZnRocmVhZEltYWdlIGlzIGluZXJ0OyBubyBzcmMgYXBwbGllZC5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IExPQURfU1RBUlRFRCBzcmMgYXBwbGllZDsgbG9hZCBoYXMgc3RhcnRlZC5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IExPQURFRCBUaGUgaW1hZ2UgaGFzIGxvYWRlZCwgYnV0IG5vdCBiZWVuIGRlY29kZWQuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBERUNPREVEIFRoZSBpbWFnZSBoYXMgYmVlbiBkZWNvZGVkLCBidXQgbm90IHBhaW50ZWQuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBQQUlOVEVEIFRoZSBpbWFnZSBoYXMgYmVlbiBwYWludGVkIHRvIGEgY2FudmFzIGVsZW1lbnQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUaGUgZW51bWVyYXRpb24gb2Ygc3RhdHVzIGNvZGVzIGFuIE9mZnRocmVhZEltYWdlIGNhbiBoYXZlLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEB0eXBlIHtPZmZ0aHJlYWRJbWFnZVN0YXR1c31cbiAgICogQGNvbnN0XG4gICAqL1xuICBzdGF0aWMgZ2V0IFNUQVRVUyAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIElORVJUOiAnaW5lcnQnLFxuICAgICAgTE9BRF9TVEFSVEVEOiAnbG9hZHN0YXJ0ZWQnLFxuICAgICAgTE9BREVEOiAnbG9hZCcsXG4gICAgICBERUNPREVEOiAnZGVjb2RlZCcsXG4gICAgICBQQUlOVEVEOiAncGFpbnRlZCdcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBtaW5pbXVtIGFtb3VudCBvZiB0aW1lLCBpbiBtaWxsaXNlY29uZHMsIHRoYXQgZHJhd2luZyB0aGUgaW1hZ2Ugc2hvdWxkXG4gICAqIHRha2UuIEl0J3MgZ3Vlc3N0aW1hdGVkIGF0IDEwbXMsIGFuZCB0aGUgT2ZmdGhyZWFkSW1hZ2Ugd2lsbCB3YWl0IGZvciBhblxuICAgKiBpZGxlIGNhbGxiYWNrICh1c2luZyA8Y29kZT5yZXF1ZXN0SWRsZUNhbGxiYWNrPC9jb2RlPikgb2YgdGhhdCBsZW5ndGguXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGNvbnN0XG4gICAqL1xuICBzdGF0aWMgZ2V0IE1JTl9JTlNFUlRfSURMRV9XSU5ET1cgKCkge1xuICAgIHJldHVybiAxMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlY3RzIGlmIGNyZWF0ZUltYWdlQml0bWFwIGlzIGF2YWlsYWJsZSBmb3IgdXNlIGluIHRoZSBjdXJyZW50IGJyb3dzZXIuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBjb25zdFxuICAgKi9cbiAgc3RhdGljIGdldCBhdmFpbGFibGUgKCkge1xuICAgIHJldHVybiAoJ2NyZWF0ZUltYWdlQml0bWFwJyBpbiB3aW5kb3cpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgT2ZmdGhyZWFkSW1hZ2UgYXJvdW5kIGFuIGV4aXN0aW5nIGVsZW1lbnQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGxldCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub2ZmdGhyZWFkLWltZycpO1xuICAgKiBsZXQgaW1nID0gbmV3IE9mZnRocmVhZEltYWdlKHRhcmdldCk7XG4gICAqIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdkZWNvZGVkJywgZnVuY3Rpb24gKCkge1xuICAgKiAgIC8vIFRoZSBpbWFnZSBoYXMgYmVlbiBkZWNvZGVkLi4uIHJlbW92ZSB0aGUgc3Bpbm5lci5cbiAgICogICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnc3Bpbm5lcicpO1xuICAgKiB9KTtcbiAgICogaW1nLnNyYyA9ICdpbWFnZS5wbmcnO1xuICAgKlxuICAgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgdGFyZ2V0IGVsZW1lbnQgdG8gdXNlLlxuICAgKi9cbiAgY29uc3RydWN0b3IgKGVsZW1lbnQ9bnVsbCkge1xuXG4gICAgaWYgKGVsZW1lbnQgPT09IG51bGwpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgKCdPZmZ0aHJlYWRJbWFnZSgpIHJlcXVpcmVzIGEgdGFyZ2V0IGVsZW1lbnQnKTtcblxuICAgIHRoaXMuaWRfID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpLnRvU3RyaW5nKDE2KTtcbiAgICB0aGlzLmNhbnZhc18gPSBudWxsO1xuICAgIHRoaXMuY3R4XyA9IG51bGw7XG4gICAgdGhpcy5lbGVtZW50XyA9IGVsZW1lbnQ7XG4gICAgdGhpcy5vbkxvYWRfID0gbnVsbDtcbiAgICB0aGlzLm9uRGVjb2RlXyA9IG51bGw7XG4gICAgdGhpcy5zdGF0dXMgPSBPZmZ0aHJlYWRJbWFnZS5TVEFUVVMuSU5FUlQ7XG4gICAgdGhpcy5zcmNfID0gbnVsbDtcbiAgICB0aGlzLndpZHRoXyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd3aWR0aCcpO1xuICAgIHRoaXMuaGVpZ2h0XyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKTtcbiAgICB0aGlzLmRyYXdXaWR0aF8gPSB0aGlzLndpZHRoXztcbiAgICB0aGlzLmRyYXdIZWlnaHRfID0gdGhpcy5oZWlnaHRfO1xuICAgIHRoaXMuYmFja2dyb3VuZF8gPSBmYWxzZTtcblxuICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnc3JjJykpIHtcbiAgICAgIHRoaXMuc3JjID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgIH0gZWxzZSBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2JnLXNyYycpKSB7XG4gICAgICB0aGlzLnNyYyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdiZy1zcmMnKTtcbiAgICAgIHRoaXMuYmFja2dyb3VuZF8gPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhbHQnKSB8fCBlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpKSlcbiAgICAgIGNvbnNvbGUud2FybignVGhlIGVsZW1lbnQgZG9lcyBoYXZlIGFuIGFsdCBvciBhcmlhLWxhYmVsIGF0dHJpYnV0ZS4nKTtcbiAgICBlbHNlIGlmICghZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKSlcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FsdCcpKTtcblxuICAgIGlmICghZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3JvbGUnKSlcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2ltZycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzb3VyY2UgVVJMIG9mIHRoZSBpbWFnZS5cbiAgICpcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IC0gVGhlIGltYWdlIFVSTC5cbiAgICovXG4gIGdldCBzcmMgKCkge1xuICAgIHJldHVybiB0aGlzLnNyY187XG4gIH1cblxuICBzZXQgc3JjIChzcmNfKSB7XG4gICAgdGhpcy5zcmNfID0gc3JjXztcbiAgICB0aGlzLnN0YXR1c18gPSBPZmZ0aHJlYWRJbWFnZS5TVEFUVVMuTE9BRF9TVEFSVEVEO1xuICAgIGltZ0hhbmRsZXIuZW5xdWV1ZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFuZCBnZXRzIHRoZSBjdXJyZW50IHN0YXR1cyBvZiB0aGUgaW1hZ2VcbiAgICpcbiAgICogQHByb3BlcnR5IHtPZmZ0aHJlYWRJbWFnZVN0YXR1c30gLSBUaGUgaW1hZ2UncyBzdGF0dXMuXG4gICAqL1xuICBzZXQgc3RhdHVzIChzdGF0dXNfKSB7XG5cbiAgICBzd2l0Y2ggKHN0YXR1c18pIHtcbiAgICAgIGNhc2UgT2ZmdGhyZWFkSW1hZ2UuU1RBVFVTLklORVJUOlxuICAgICAgY2FzZSBPZmZ0aHJlYWRJbWFnZS5TVEFUVVMuTE9BRF9TVEFSVEVEOlxuICAgICAgY2FzZSBPZmZ0aHJlYWRJbWFnZS5TVEFUVVMuTE9BREVEOlxuICAgICAgY2FzZSBPZmZ0aHJlYWRJbWFnZS5TVEFUVVMuREVDT0RFRDpcbiAgICAgIGNhc2UgT2ZmdGhyZWFkSW1hZ2UuU1RBVFVTLlBBSU5URUQ6XG4gICAgICAgIHRoaXMuZmlyZV8oc3RhdHVzXyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gc3RhdHVzOiAke3N0YXR1c199YCk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0dXNfID0gc3RhdHVzXztcbiAgfVxuXG4gIGdldCBzdGF0dXMgKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXR1c187XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgSW1hZ2VCaXRtYXAgb24gdGhlIGNhbnZhcy4gVGhlIGJpdG1hcCBkYXRhIGlzIGRpc2NhcmRlZFxuICAgKiBpbW1lZGlhdGVseSBhZnRlciBpdCBoYXMgYmVlbiBkcmF3biBzbyBhcyB0byBrZWVwIG1lbW9yeSB1c2FnZSBkb3duLlxuICAgKiBUaGVyZWZvcmUgY2FsbGluZyB0aGUgPGNvZGU+aW1hZ2VCaXRtYXA8L2NvZGU+IGdldHRlciB3aWxsIGFsd2F5cyByZXR1cm5cbiAgICogbnVsbC5cbiAgICpcbiAgICogQHByb3BlcnR5IHtJbWFnZUJpdG1hcH0gLSBUaGUgSW1hZ2VCaXRtYXAgZGF0YSB0byBkcmF3IHRvIHRoZSBjYW52YXMuXG4gICAqL1xuICBzZXQgaW1hZ2VCaXRtYXAgKGltYWdlQml0bWFwXykge1xuXG4gICAgbGV0IHJlbmRlckJpdG1hcERhdGEgPSAoZGVhZGxpbmUpID0+IHtcblxuICAgICAgLy8gTWFrZSBzdXJlIHRoZXJlIGlzIGVub3VnaCB0aW1lIHRvIGluc2VydCB0aGUgaW1hZ2UuIEFueXRoaW5nIGxlc3MgdGhhblxuICAgICAgLy8gdGhlIG1pbmltdW0gd2luZG93IGlzIHVubGlrZWx5IHRvIGJlIGVub3VnaCwgc28gaG9sZCByZXNjaGVkdWxlIGlmXG4gICAgICAvLyBuZWVkZWQuXG4gICAgICBpZiAoZGVhZGxpbmUudGltZVJlbWFpbmluZygpIDwgT2ZmdGhyZWFkSW1hZ2UuTUlOX0lOU0VSVF9JRExFX1dJTkRPVylcbiAgICAgICAgcmV0dXJuIHJlcXVlc3RJZGxlQ2FsbGJhY2socmVuZGVyQml0bWFwRGF0YSk7XG5cbiAgICAgIGlmICh0aGlzLmNhbnZhc18gPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5jYW52YXNfID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIHRoaXMuY2FudmFzXy5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY3R4XyA9PT0gbnVsbClcbiAgICAgICAgdGhpcy5jdHhfID0gdGhpcy5jYW52YXNfLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgIC8vIFNldCB0aGUgZGltZW5zaW9ucyBvZiB0aGUgY2FudmFzLlxuICAgICAgdGhpcy5zZXRDYW52YXNEaW1lbnNpb25zXyhpbWFnZUJpdG1hcF8pO1xuICAgICAgdGhpcy5jdHhfLmRyYXdJbWFnZShpbWFnZUJpdG1hcF8sIDAsIDAsXG4gICAgICAgICAgdGhpcy5kcmF3V2lkdGhfLCB0aGlzLmRyYXdIZWlnaHRfKTtcblxuICAgICAgdGhpcy5lbGVtZW50Xy5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhc18pO1xuICAgICAgdGhpcy5zdGF0dXMgPSBPZmZ0aHJlYWRJbWFnZS5TVEFUVVMuUEFJTlRFRDtcbiAgICB9XG5cbiAgICByZXF1ZXN0SWRsZUNhbGxiYWNrKHJlbmRlckJpdG1hcERhdGEpO1xuICB9XG5cbiAgZ2V0IGltYWdlQml0bWFwICgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjYW52YXMncyBkaW1lbnNpb25zIGJhc2VkIG9uIHRoZSBJbWFnZUJpdG1hcCBkYXRhIHByb3ZpZGVkLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0ltYWdlQml0bWFwfSBpbWFnZUJpdG1hcCAtIFRoZSBJbWFnZUJpdG1hcCB0byB1c2UgZm9yIHJlc2l6aW5nIHRoZVxuICAgKiAgIGNhbnZhcyAoaWYgbmVjZXNzYXJ5KS5cbiAgICovXG4gIHNldENhbnZhc0RpbWVuc2lvbnNfIChpbWFnZUJpdG1hcF8pIHtcblxuICAgIGlmICh0aGlzLmJhY2tncm91bmRfKSB7XG4gICAgICAvLyBJZiB0aGlzIGlzIGEgYmFja2dyb3VuZCBpbWFnZSwgZGVmYXVsdCB0aGUgY2FudmFzIHRvIHRoZSBkaW1lbnNpb25zIG9mXG4gICAgICAvLyB0aGUgY29udGFpbmVyIGVsZW1lbnQuXG4gICAgICB0aGlzLndpZHRoXyA9IHRoaXMuZWxlbWVudF8ub2Zmc2V0V2lkdGg7XG4gICAgICB0aGlzLmhlaWdodF8gPSB0aGlzLmVsZW1lbnRfLm9mZnNldEhlaWdodDtcblxuICAgICAgdGhpcy5kcmF3V2lkdGhfID0gaW1hZ2VCaXRtYXBfLndpZHRoO1xuICAgICAgdGhpcy5kcmF3SGVpZ2h0XyA9IGltYWdlQml0bWFwXy5oZWlnaHQ7XG5cbiAgICAgIGxldCBiYWNrZ3JvdW5kU2l6ZSA9XG4gICAgICAgICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50XykuYmFja2dyb3VuZFNpemU7XG4gICAgICBsZXQgcmF0aW8gPSAxO1xuXG4gICAgICBzd2l0Y2ggKGJhY2tncm91bmRTaXplKSB7XG5cbiAgICAgICAgY2FzZSAnY29udGFpbic6XG4gICAgICAgICAgcmF0aW8gPSBNYXRoLm1pbih0aGlzLndpZHRoXyAvIHRoaXMuZHJhd1dpZHRoXyxcbiAgICAgICAgICAgICAgdGhpcy5oZWlnaHRfIC8gdGhpcy5kcmF3SGVpZ2h0Xyk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnY292ZXInOlxuICAgICAgICAgIHJhdGlvID0gTWF0aC5tYXgodGhpcy53aWR0aF8gLyB0aGlzLmRyYXdXaWR0aF8sXG4gICAgICAgICAgICAgIHRoaXMuaGVpZ2h0XyAvIHRoaXMuZHJhd0hlaWdodF8pO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuZHJhd1dpZHRoXyAqPSByYXRpbztcbiAgICAgIHRoaXMuZHJhd0hlaWdodF8gKj0gcmF0aW87XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAvLyBUaGlzIGlzIGFuIGlubGluZSBpbWFnZSBzbyBub3cgd2UgbmVlZCB0byBhY2NvdW50IGZvciBpdCBhcyBzdWNoLlxuICAgICAgLy8gRmlyc3RseSwgaWYgdGhlIHdpZHRoIGlzIHNldCwgYnV0IG5vdCB0aGUgaGVpZ2h0LCBzZXQgdGhlIGhlaWdodCBiYXNlZFxuICAgICAgLy8gb24gdGhlIHdpZHRoLiBBbmQgdGhlbiBkbyB0aGUgc2FtZSBpbiByZXZlcnNlIGZvciBoZWlnaHQgYnV0IG5vdCB3aWR0aFxuICAgICAgLy8gYW5kIGZpbmFsbHkgZGVmYXVsdCB0byB3aGF0ZXZlciB0aGUgaW1hZ2UncyBuYXR1cmFsIGRpbWVuc2lvbnMgd2VyZS5cbiAgICAgIGlmICh0aGlzLndpZHRoXyAhPT0gbnVsbCAmJiB0aGlzLmhlaWdodF8gPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5oZWlnaHRfID0gdGhpcy53aWR0aF8gKiAoaW1hZ2VCaXRtYXBfLmhlaWdodCAvIGltYWdlQml0bWFwXy53aWR0aCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMud2lkdGhfID09PSBudWxsICYmIHRoaXMuaGVpZ2h0XyAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLndpZHRoXyA9IHRoaXMuaGVpZ2h0XyAqIChpbWFnZUJpdG1hcF8ud2lkdGggLyBpbWFnZUJpdG1hcF8uaGVpZ2h0KTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy53aWR0aF8gPT09IG51bGwgJiYgdGhpcy5oZWlnaHRfID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMud2lkdGhfID0gaW1hZ2VCaXRtYXBfLndpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodF8gPSBpbWFnZUJpdG1hcF8uaGVpZ2h0O1xuICAgICAgfVxuXG4gICAgICB0aGlzLndpZHRoXyA9IHBhcnNlSW50KHRoaXMud2lkdGhfKTtcbiAgICAgIHRoaXMuaGVpZ2h0XyA9IHBhcnNlSW50KHRoaXMuaGVpZ2h0Xyk7XG5cbiAgICAgIHRoaXMuZHJhd1dpZHRoXyA9IHRoaXMud2lkdGhfO1xuICAgICAgdGhpcy5kcmF3SGVpZ2h0XyA9IHRoaXMuaGVpZ2h0XztcbiAgICB9XG5cbiAgICAvLyBOb3cgcmVzaXplIHRoZSBjYW52YXMgYXBwcm9wcmlhdGVseS5cbiAgICB0aGlzLmNhbnZhc18ud2lkdGggPSB0aGlzLndpZHRoXztcbiAgICB0aGlzLmNhbnZhc18uaGVpZ2h0ID0gdGhpcy5oZWlnaHRfO1xuXG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgYW4gZXZlbnQgb24gdGhlIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSB7fSBbZGV0YWlsPW51bGxdIC0gVGhlIGRhdGEgdG8gaW5jbHVkZSBpbiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2J1YmJsZXM9dHJ1ZV0gLSBXaGV0aGVyIHRoZSBldmVudCBzaG91bGQgYnViYmxlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjYW5jZWxhYmxlPXRydWVdIC0gV2hldGhlciB0aGUgZXZlbnQgaXMgY2FuY2VsYWJsZS5cbiAgICovXG4gIGZpcmVfIChldmVudE5hbWUsIGRldGFpbD1udWxsLCBidWJibGVzPXRydWUsIGNhbmNlbGFibGU9dHJ1ZSkge1xuICAgIGxldCBldnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7IGRldGFpbCwgYnViYmxlcywgY2FuY2VsYWJsZSB9KTtcbiAgICB0aGlzLmVsZW1lbnRfLmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgfVxuXG59XG5cbmNsYXNzIE9mZnRocmVhZEltYWdlSGFuZGxlciB7XG5cbiAgLyoqXG4gICAqIFRoZSBjb29yZGluYXRvciBmb3IgYWxsIDxjb2RlPk9mZnRocmVhZEltYWdlPC9jb2RlPiBpbnN0YW5jZXMuIFNwaW5zIHVwIHRoZVxuICAgKiB3b3JrZXIgYW5kIGhhcyBpdCBlbnF1ZXVlIGltYWdlIGxvYWRzIGJ5IFVSTC4gV2hlbiBhbiBJbWFnZUJpdG1hcCBpc1xuICAgKiByZXR1cm5lZCBmcm9tIHRoZSB3b3JrZXIgaXQgbm90aWZpZXMgYWxsIDxjb2RlPk9mZnRocmVhZEltYWdlPC9jb2RlPnMuIEl0XG4gICAqIGlzIGFsc28gcmVzcG9uc2libGUgZm9yIHNldHRpbmcgdGhlIHN0YXR1cyBvZiBhbGxcbiAgICogPGNvZGU+T2ZmdGhyZWFkSW1hZ2U8L2NvZGU+cywgaS5lLiBsb2FkZWQsIGRlY29kZWQsIGV0Yy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbnN0cnVjdG9yICgpIHtcblxuICAgIGxldCBjdXJyZW50U2NyaXB0RGlyID1cbiAgICAgICAgdGhpcy5nZXREaXJlY3RvcnlOYW1lXyhcbiAgICAgICAgICB0aGlzLmNvbnZlcnRVUkxUb0Fic29sdXRlXyhkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyYylcbiAgICAgICAgKTtcblxuICAgIHRoaXMud29ya2VyID0gbmV3IFdvcmtlcihgJHtjdXJyZW50U2NyaXB0RGlyfS9vZmZ0aHJlYWQtaW1nLXdvcmtlci5qc2ApO1xuICAgIHRoaXMud29ya2VyLm9ubWVzc2FnZSA9IChldnQpID0+IHRoaXMuaGFuZGxlSW5jb21pbmdNZXNzYWdlXyhldnQuZGF0YSk7XG4gICAgdGhpcy5qb2JzID0ge307XG4gIH1cblxuICAvKipcbiAgICogRW5xdWV1ZXMgYW4gZWxlbWVudCwgc3RvcmluZyBhIHJlZmVyZW5jZSB0byBpdCBhZ2FpbnN0IGl0cyBVUkwuIFdoZW4gdGhlXG4gICAqIHdvcmtlciByZXR1cm5zIHRoZSBJbWFnZUJpdG1hcCBkYXRhIGZvciB0aGUgVVJMLCBpdCAoYW5kIGFueSBvdGhlclxuICAgKiBlbGVtZW50cykgd2FpdGluZyBmb3IgdGhhdCBJbWFnZUJpdG1hcCB3aWxsIGJlIG5vdGlmaWVkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPZmZ0aHJlYWRJbWFnZX0gb2ZmdGhyZWFkSW1hZ2UgLSBUaGUgT2ZmdGhyZWFkSW1hZ2UgaW5zdGFuY2UuXG4gICAqL1xuICBlbnF1ZXVlIChvZmZ0aHJlYWRJbWFnZSkge1xuICAgIGlmICghKG9mZnRocmVhZEltYWdlIGluc3RhbmNlb2YgT2ZmdGhyZWFkSW1hZ2UpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbnF1ZXVlIGV4cGVjdHMgYW4gT2ZmdGhyZWFkSW1hZ2UnKTtcblxuICAgIC8vIEVuc3VyZSB0aGUgVVJMIGlzIGFic29sdXRlLlxuICAgIGxldCBzcmMgPSB0aGlzLmNvbnZlcnRVUkxUb0Fic29sdXRlXyhvZmZ0aHJlYWRJbWFnZS5zcmMpO1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLmpvYnNbc3JjXSA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgICB0aGlzLmpvYnNbc3JjXSA9IFtdO1xuXG4gICAgdGhpcy5qb2JzW3NyY10ucHVzaChvZmZ0aHJlYWRJbWFnZSk7XG4gICAgdGhpcy53b3JrZXIucG9zdE1lc3NhZ2Uoc3JjKTtcblxuICAgIG9mZnRocmVhZEltYWdlLnN0YXR1cyA9IE9mZnRocmVhZEltYWdlLlNUQVRVUy5MT0FEX1NUQVJURUQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZGlyZWN0b3J5IG5hbWUgZnJvbSBhIFVSTC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7U3RyaW5nfSB1cmwgLSBUaGUgVVJMIHRvIHN0YXJ0IHdpdGguXG4gICAqIEByZXR1cm4ge1N0cmluZ30gVGhlIFVSTCBleGNsdWRpbmcgdGhlIGJhc2VuYW1lLlxuICAgKi9cbiAgZ2V0RGlyZWN0b3J5TmFtZV8gKHVybCkge1xuICAgIHJldHVybiB1cmwucmVwbGFjZSgvW15cXC9dKiQvLCAnJyk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBVUkwgdG8gYW4gYWJzb2x1dGUgb25lLiBUaGlzIGlzIHRvIGVuc3VyZSB0aGF0IHBhdGhzIHdvcmsgYmFzZWRcbiAgICogb24gdGhlIGN1cnJlbnQgcGFnZSdzIFVSTC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7U3RyaW5nfSB1cmwgLSBUaGUgVVJMIHRvIGNvbnZlcnQuXG4gICAqIEByZXR1cm4ge1N0cmluZ30gLSBBbiBhYnNvbHV0ZSBVUkwuXG4gICAqL1xuICBjb252ZXJ0VVJMVG9BYnNvbHV0ZV8gKHVybCkge1xuXG4gICAgaWYgKHR5cGVvZiB1cmwgIT09ICdzdHJpbmcnKVxuICAgICAgdGhyb3cgbmV3IEVycm9yICgnY29udmVydFVSTFRvQWJzb2x1dGVfIGV4cGVjdHMgYSBzdHJpbmcnKTtcblxuICAgIGlmICh1cmwuc3RhcnRzV2l0aCgnaHR0cCcpKVxuICAgICAgcmV0dXJuIHVybDtcbiAgICBlbHNlIHtcbiAgICAgIGxldCBjdXJyZW50UGF0aCA9IHRoaXMuZ2V0RGlyZWN0b3J5TmFtZV8od2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgbGV0IGFic29sdXRlVVJMID0gbmV3IFVSTChjdXJyZW50UGF0aCArIHVybCk7XG4gICAgICByZXR1cm4gYWJzb2x1dGVVUkwudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUgaW5jb21pbmcgbWVzc2FnZXMgZnJvbSB0aGUgd29ya2VyLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG1lc3NhZ2UgLSBUaGUgbWVzc2FnZSBmcm9tIHRoZSB3b3JrZXIuXG4gICAqL1xuICBoYW5kbGVJbmNvbWluZ01lc3NhZ2VfIChtZXNzYWdlKSB7XG5cbiAgICBpZiAobWVzc2FnZS5lcnJvcikge1xuICAgICAgcmV0dXJuIGNvbnNvbGUud2FybihtZXNzYWdlLmVycm9yKTtcbiAgICB9XG5cbiAgICBsZXQgdXJsID0gbWVzc2FnZS51cmw7XG4gICAgbGV0IGVsZW1lbnRzID0gdGhpcy5qb2JzW3VybF07XG4gICAgbGV0IGVsZW1lbnQ7XG5cbiAgICBpZiAobWVzc2FnZS5sb2FkKSB7XG4gICAgICBmb3IgKGxldCBlID0gMDsgZSA8IGVsZW1lbnRzLmxlbmd0aDsgZSsrKSB7XG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50c1tlXTtcbiAgICAgICAgZWxlbWVudC5zdGF0dXMgPSBPZmZ0aHJlYWRJbWFnZS5TVEFUVVMuTE9BREVEO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBpbWFnZUJpdG1hcCA9IG1lc3NhZ2UuaW1hZ2VCaXRtYXA7XG5cbiAgICBmb3IgKGxldCBlID0gMDsgZSA8IGVsZW1lbnRzLmxlbmd0aDsgZSsrKSB7XG4gICAgICBlbGVtZW50ID0gZWxlbWVudHNbZV07XG4gICAgICBlbGVtZW50LnN0YXR1cyA9IE9mZnRocmVhZEltYWdlLlNUQVRVUy5ERUNPREVEO1xuICAgICAgZWxlbWVudC5pbWFnZUJpdG1hcCA9IGltYWdlQml0bWFwO1xuICAgIH1cblxuICAgIC8vIFRoZXNlIGVsZW1lbnRzIG5vIGxvbmdlciBuZWVkIHVwZGF0aW5nLCBzbyBwdXJnZSB0aGUgbGlzdC5cbiAgICB0aGlzLmpvYnNbdXJsXS5sZW5ndGggPSAwO1xuICB9XG59XG5cbmxldCBpbWdIYW5kbGVyID0gbmV3IE9mZnRocmVhZEltYWdlSGFuZGxlcigpO1xuIl19
