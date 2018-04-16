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
            _this.src = element.dataset.bgSrc;
            _this.background_ = true;
        }

        _this.setCanvasIntrinsicDimensions_();
        return _this;
    }

    _createClass(OffscreenImage, [{
        key: 'setCanvasIntrinsicDimensions_',


        /**
         * Sets the canvas's intrinsic dimensions based on the element and attributes.
         *
         * @private
         */
        value: function setCanvasIntrinsicDimensions_() {

            if (this.background_) {
                // If this is a background image, default the canvas to the dimensions of
                // the container element.
                this.width_ = this.element_.offsetWidth;
                this.height_ = this.element_.offsetHeight;

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
    }, {
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

            if (typeof this.jobs[src] === 'undefined') {
                this.jobs[src] = [];
            }

            this.jobs[src].push(offscreenImage);

            this.worker.postMessage({
                src: src,
                canvas: canvas,
                options: offscreenImage.options
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
                return;
            }

            // let imageBitmap = message.imageBitmap;
            //
            // for (let e = 0; e < elements.length; e++) {
            //     element = elements[e];
            //     element.status = OffscreenImage.STATUS.DECODED;
            //     element.imageBitmap = imageBitmap;
            // }

            // These elements no longer need updating, so purge the list.
            this.jobs[url].length = 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZ2xvYmFsLmpzIiwic3JjL29mZnNjcmVlbi1pbWcvb2Zmc2NyZWVuLWltZy5qcyIsInNyYy9vZmZ0aHJlYWQtaW1nL29mZnRocmVhZC1pbWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ21EQTs7OztBQVFBOzs7Ozs7QUEzREE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkE7QUFDQSxPQUFPLG1CQUFQLEdBQTZCLE9BQU8sbUJBQVAsSUFDM0IsVUFBVSxFQUFWLEVBQWM7QUFDWixNQUFJLFFBQVEsS0FBSyxHQUFMLEVBQVo7QUFDQSxTQUFPLFdBQVcsWUFBTTtBQUN0QixPQUFHO0FBQ0Qsa0JBQVksS0FEWDtBQUVELHFCQUFlO0FBQUEsZUFBTSxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksTUFBTSxLQUFLLEdBQUwsS0FBYSxLQUFuQixDQUFaLENBQU47QUFBQTtBQUZkLEtBQUg7QUFJRCxHQUxNLEVBS0osQ0FMSSxDQUFQO0FBTUQsQ0FUSDs7QUFXQSxPQUFPLGtCQUFQLEdBQTRCLE9BQU8sa0JBQVAsSUFDMUIsVUFBVSxFQUFWLEVBQWM7QUFDWixlQUFhLEVBQWI7QUFDRCxDQUhIOztBQU1BOzs7QUFHQSxJQUFJLE9BQU8sT0FBTyxjQUFkLEtBQWlDLFdBQXJDLEVBQ0UsT0FBTyxjQUFQLDBCQURGLEtBR0UsUUFBUSxJQUFSLENBQWEsK0JBQWI7O0FBRUY7OztBQUdBLElBQUksT0FBTyxPQUFPLGNBQWQsS0FBaUMsV0FBckMsRUFDRSxPQUFPLGNBQVAsMEJBREYsS0FHRSxRQUFRLElBQVIsQ0FBYSwrQkFBYjs7Ozs7Ozs7Ozs7QUNoRUY7Ozs7Ozs7Ozs7OztJQUVxQixjOzs7Ozs7O0FBRWpCOzs7Ozs7Ozs7Ozs2Q0FXd0Q7QUFBQSxnQkFBN0IsUUFBNkIsdUVBQWxCLGdCQUFrQjs7QUFDcEQsZ0JBQUksU0FBUyxFQUFiO0FB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eEMsa0JBQVUsU0FBUyxFQUFULENBQVY7QUFDQSxnQkFBUSxNQUFSLEdBQWlCLGVBQWUsTUFBZixDQUFzQixPQUF2QztBQUNBLGdCQUFRLFdBQVIsR0FBc0IsV0FBdEI7QUFDRDs7QUFFRDtBQUNBLFdBQUssSUFBTCxDQUFVLEdBQVYsRUFBZSxNQUFmLEdBQXdCLENBQXhCO0FBQ0Q7Ozs7OztBQUdILElBQUksYUFBYSxJQUFJLHFCQUFKLEVBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCIvKipcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qIVxuICogQ29weXJpZ2h0IDIwMTUgR29vZ2xlIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzXG4gKiBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmdcbiAqIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vLyByZXF1ZXN0SWRsZUNhbGxiYWNrIHNoaW0uXG53aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayA9IHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrIHx8XG4gIGZ1bmN0aW9uIChjYikge1xuICAgIGxldCBzdGFydCA9IERhdGUubm93KCk7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY2Ioe1xuICAgICAgICBkaWRUaW1lb3V0OiBmYWxzZSxcbiAgICAgICAgdGltZVJlbWFpbmluZzogKCkgPT4gTWF0aC5tYXgoMCwgNTAgLSAoRGF0ZS5ub3coKSAtIHN0YXJ0KSlcbiAgICAgIH0pO1xuICAgIH0sIDEpO1xuICB9XG5cbndpbmRvdy5jYW5jZWxJZGxlQ2FsbGJhY2sgPSB3aW5kb3cuY2FuY2VsSWRsZUNhbGxiYWNrIHx8XG4gIGZ1bmN0aW9uIChpZCkge1xuICAgIGNsZWFyVGltZW91dChpZCk7XG4gIH1cblxuXG4vLyBFeHBvc2UgT2ZmdGhyZWFkSW1hZ2UgdG8gZ2xvYmFsLlxuaW1wb3J0IE9mZnRocmVhZEltYWdlIGZyb20gJy4vb2ZmdGhyZWFkLWltZy9vZmZ0aHJlYWQtaW1nJztcblxuaWYgKHR5cGVvZiB3aW5kb3cuT2ZmdGhyZWFkSW1hZ2UgPT09ICd1bmRlZmluZWQnKVxuICB3aW5kb3cuT2ZmdGhyZWFkSW1hZ2UgPSBPZmZ0aHJlYWRJbWFnZTtcbmVsc2VcbiAgY29uc29sZS53YXJuKCdPZmZ0aHJlYWRJbWFnZSBhbHJlYWR5IGV4aXN0cycpO1xuXG4vLyBFeHBvc2UgT2ZmU2NyZWVuSW1hZ2UgdG8gZ2xvYmFsLlxuaW1wb3J0IE9mZnNjcmVlbkltYWdlIGZyb20gJy4vb2Zmc2NyZWVuLWltZy9vZmZzY3JlZW4taW1nJztcblxuaWYgKHR5cGVvZiB3aW5kb3cuT2Zmc2NyZWVuSW1hZ2UgPT09ICd1bmRlZmluZWQnKVxuICB3aW5kb3cuT2Zmc2NyZWVuSW1hZ2UgPSBPZmZzY3JlZW5JbWFnZTtcbmVsc2VcbiAgY29uc29sZS53YXJuKCdPZmZzY3JlZW5JbWFnZSBhbHJlYWR5IGV4aXN0cycpO1xuIiwiaW1wb3J0IE9mZnRocmVhZEltYWdlIGZyb20gJy4uL29mZnRocmVhZC1pbWcvb2ZmdGhyZWFkLWltZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9mZnNjcmVlbkltYWdlIGV4dGVuZHMgT2ZmdGhyZWFkSW1hZ2Uge1xuXG4gICAgLyoqXG4gICAgICogRmFjdG9yeSBtZXRob2QgdG8gY3JlYXRlIGFuIGFycmF5IG9mIDxjb2RlPk9mZnNjcmVlbkltYWdlPC9jb2RlPnMgYmFzZWRcbiAgICAgKiBvbiBleGlzdGluZyBlbGVtZW50cyBpbiB0aGUgcGFnZS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICAgbGV0IGltYWdlcyA9IE9mZnNjcmVlbkltYWdlLmNyZWF0ZUZyb21TZWxlY3RvcignLm9mZnNjcmVlbi1pbWcnKTtcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IFtzZWxlY3Rvcj1cIi5vZmZzY3JlZW4taW1nXCJdIC0gVGhlIHNlbGVjdG9yIGZvciBleGlzdGluZ1xuICAgICAqICAgT2Zmc2NyZWVuSW1hZ2UgZWxlbWVudHMgaW4gdGhlIHBhZ2UuXG4gICAgICogQHJldHVybiB7QXJyYXl9IC0gQW4gYXJyYXkgb2YgT2Zmc2NyZWVuSW1hZ2VzLlxuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGVGcm9tU2VsZWN0b3IgKHNlbGVjdG9yID0gJy5vZmZzY3JlZW4taW1nJykge1xuICAgICAgICBsZXQgaW1hZ2VzID0gW107XG4gICAgICAgIGxldCBjYW5kaWRhdGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgICAgIGxldCBjYW5kaWRhdGU7XG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY2FuZGlkYXRlcy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgY2FuZGlkYXRlID0gY2FuZGlkYXRlc1tjXTtcbiAgICAgICAgICAgIGltYWdlcy5wdXNoKG5ldyBPZmZzY3JlZW5JbWFnZShjYW5kaWRhdGUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW1hZ2VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERldGVjdHMgaWYgT2Zmc2NyZWVuQ2FudmFzIGlzIGF2YWlsYWJsZSBmb3IgdXNlIGluIHRoZSBjdXJyZW50IGJyb3dzZXIuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGNvbnN0XG4gICAgICovXG4gICAgc3RhdGljIGdldCBhdmFpbGFibGUgKCkge1xuICAgICAgICByZXR1cm4gKCdPZmZzY3JlZW5DYW52YXMnIGluIHdpbmRvdyk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IgKGVsZW1lbnQ9bnVsbCwgb3B0aW9ucykge1xuICAgICAgICBzdXBlcihlbGVtZW50KTtcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLmNhbnZhc18gPSB0aGlzLmVsZW1lbnRfO1xuXG4gICAgICAgIGlmIChlbGVtZW50LmRhdGFzZXQuc3JjKSB7XG4gICAgICAgICAgICB0aGlzLnNyYyA9IGVsZW1lbnQuZGF0YXNldC5zcmM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZWxlbWVudC5kYXRhc2V0LmJnU3JjKSB7XG4gICAgICAgICAgICB0aGlzLnNyYyA9IGVsZW1lbnQuZGF0YXNldC5iZ1NyYztcbiAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZF8gPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRDYW52YXNJbnRyaW5zaWNEaW1lbnNpb25zXygpO1xuICAgIH1cblxuICAgIHNldCBpbWFnZUJpdG1hcCAoaW1hZ2VCaXRtYXBfKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG5vdCBzZXQgYml0bWFwLCBjb250cm9sIGhhcyBiZWVuIHRyYW5zZmVycmVkIHRvIG9mZnNjcmVlbicpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBzb3VyY2UgVVJMIG9mIHRoZSBpbWFnZS5cbiAgICAgKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSAtIFRoZSBpbWFnZSBVUkwuXG4gICAgICovXG4gICAgZ2V0IHNyYyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNyY187XG4gICAgfVxuXG4gICAgc2V0IHNyYyAoc3JjXykge1xuICAgICAgICB0aGlzLnNyY18gPSBzcmNfO1xuICAgICAgICB0aGlzLnN0YXR1c18gPSBPZmZzY3JlZW5JbWFnZS5TVEFUVVMuTE9BRF9TVEFSVEVEO1xuICAgICAgICBvZmZzY3JlZW5IYW5kbGVyLmVucXVldWUodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgY2FudmFzJ3MgaW50cmluc2ljIGRpbWVuc2lvbnMgYmFzZWQgb24gdGhlIGVsZW1lbnQgYW5kIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHNldENhbnZhc0ludHJpbnNpY0RpbWVuc2lvbnNfICgpIHtcblxuICAgICAgICBpZiAodGhpcy5iYWNrZ3JvdW5kXykge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIGJhY2tncm91bmQgaW1hZ2UsIGRlZmF1bHQgdGhlIGNhbnZhcyB0byB0aGUgZGltZW5zaW9ucyBvZlxuICAgICAgICAgICAgLy8gdGhlIGNvbnRhaW5lciBlbGVtZW50LlxuICAgICAgICAgICAgdGhpcy53aWR0aF8gPSB0aGlzLmVsZW1lbnRfLm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgdGhpcy5oZWlnaHRfID0gdGhpcy5lbGVtZW50Xy5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgICAgIGxldCBiYWNrZ3JvdW5kU2l6ZSA9XG4gICAgICAgICAgICAgICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50XykuYmFja2dyb3VuZFNpemU7XG4gICAgICAgICAgICBsZXQgcmF0aW8gPSAxO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKGJhY2tncm91bmRTaXplKSB7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdjb250YWluJzpcbiAgICAgICAgICAgICAgICAgICAgcmF0aW8gPSBNYXRoLm1pbih0aGlzLndpZHRoXyAvIHRoaXMuZHJhd1dpZHRoXyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0XyAvIHRoaXMuZHJhd0hlaWdodF8pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvdmVyJzpcbiAgICAgICAgICAgICAgICAgICAgcmF0aW8gPSBNYXRoLm1heCh0aGlzLndpZHRoXyAvIHRoaXMuZHJhd1dpZHRoXyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0XyAvIHRoaXMuZHJhd0hlaWdodF8pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmRyYXdXaWR0aF8gKj0gcmF0aW87XG4gICAgICAgICAgICB0aGlzLmRyYXdIZWlnaHRfICo9IHJhdGlvO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYW4gaW5saW5lIGltYWdlIHNvIG5vdyB3ZSBuZWVkIHRvIGFjY291bnQgZm9yIGl0IGFzIHN1Y2guXG4gICAgICAgICAgICAvLyBGaXJzdGx5LCBpZiB0aGUgd2lkdGggaXMgc2V0LCBidXQgbm90IHRoZSBoZWlnaHQsIHNldCB0aGUgaGVpZ2h0IGJhc2VkXG4gICAgICAgICAgICAvLyBvbiB0aGUgd2lkdGguIEFuZCB0aGVuIGRvIHRoZSBzYW1lIGluIHJldmVyc2UgZm9yIGhlaWdodCBidXQgbm90IHdpZHRoXG4gICAgICAgICAgICAvLyBhbmQgZmluYWxseSBkZWZhdWx0IHRvIHdoYXRldmVyIHRoZSBpbWFnZSdzIG5hdHVyYWwgZGltZW5zaW9ucyB3ZXJlLlxuICAgICAgICAgICAgaWYgKHRoaXMud2lkdGhfICE9PSBudWxsICYmIHRoaXMuaGVpZ2h0XyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0XyA9IHRoaXMud2lkdGhfICogKGltYWdlQml0bWFwXy5oZWlnaHQgLyBpbWFnZUJpdG1hcF8ud2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLndpZHRoXyA9PT0gbnVsbCAmJiB0aGlzLmhlaWdodF8gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoXyA9IHRoaXMuaGVpZ2h0XyAqIChpbWFnZUJpdG1hcF8ud2lkdGggLyBpbWFnZUJpdG1hcF8uaGVpZ2h0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy53aWR0aF8gPT09IG51bGwgJiYgdGhpcy5oZWlnaHRfID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53aWR0aF8gPSBpbWFnZUJpdG1hcF8ud2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHRfID0gaW1hZ2VCaXRtYXBfLmhlaWdodDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy53aWR0aF8gPSBwYXJzZUludCh0aGlzLndpZHRoXyk7XG4gICAgICAgICAgICB0aGlzLmhlaWdodF8gPSBwYXJzZUludCh0aGlzLmhlaWdodF8pO1xuXG4gICAgICAgICAgICB0aGlzLmRyYXdXaWR0aF8gPSB0aGlzLndpZHRoXztcbiAgICAgICAgICAgIHRoaXMuZHJhd0hlaWdodF8gPSB0aGlzLmhlaWdodF87XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3cgcmVzaXplIHRoZSBjYW52YXMgYXBwcm9wcmlhdGVseS5cbiAgICAgICAgdGhpcy5jYW52YXNfLndpZHRoID0gdGhpcy53aWR0aF87XG4gICAgICAgIHRoaXMuY2FudmFzXy5oZWlnaHQgPSB0aGlzLmhlaWdodF87XG5cbiAgICB9XG59XG5cbmNsYXNzIE9mZnNjcmVlbkltYWdlSGFuZGxlciB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBsZXQgY3VycmVudFNjcmlwdERpciA9XG4gICAgICAgICAgICB0aGlzLmdldERpcmVjdG9yeU5hbWVfKFxuICAgICAgICAgICAgICAgIHRoaXMuY29udmVydFVSTFRvQWJzb2x1dGVfKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIoYCR7Y3VycmVudFNjcmlwdERpcn0vb2Zmc2NyZWVuLWltZy13b3JrZXIuanNgKTtcbiAgICAgICAgdGhpcy53b3JrZXIub25tZXNzYWdlID0gKGV2dCkgPT4gdGhpcy5oYW5kbGVJbmNvbWluZ01lc3NhZ2VfKGV2dC5kYXRhKTtcbiAgICAgICAgdGhpcy5qb2JzID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW5xdWV1ZXMgYW4gZWxlbWVudCwgc3RvcmluZyBhIHJlZmVyZW5jZSB0byBpdCBhZ2FpbnN0IGl0cyBVUkwuIFdoZW4gdGhlXG4gICAgICogd29ya2VyIHJldHVybnMgdGhlIEltYWdlQml0bWFwIGRhdGEgZm9yIHRoZSBVUkwsIGl0IChhbmQgYW55IG90aGVyXG4gICAgICogZWxlbWVudHMpIHdhaXRpbmcgZm9yIHRoYXQgSW1hZ2VCaXRtYXAgd2lsbCBiZSBub3RpZmllZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge09mZnNjcmVlbkltYWdlfSBvZmZzY3JlZW5JbWFnZSAtIFRoZSBPZmZzY3JlZW5JbWFnZSBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBlbnF1ZXVlIChvZmZzY3JlZW5JbWFnZSkge1xuICAgICAgICBpZiAoIShvZmZzY3JlZW5JbWFnZSBpbnN0YW5jZW9mIE9mZnNjcmVlbkltYWdlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbnF1ZXVlIGV4cGVjdHMgYW4gT2Zmc2NyZWVuSW1hZ2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVuc3VyZSB0aGUgVVJMIGlzIGFic29sdXRlLlxuICAgICAgICBsZXQgc3JjID0gdGhpcy5jb252ZXJ0VVJMVG9BYnNvbHV0ZV8ob2Zmc2NyZWVuSW1hZ2Uuc3JjKTtcbiAgICAgICAgbGV0IGNhbnZhcyA9IG9mZnNjcmVlbkltYWdlLmNhbnZhc18udHJhbnNmZXJDb250cm9sVG9PZmZzY3JlZW4oKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuam9ic1tzcmNdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5qb2JzW3NyY10gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuam9ic1tzcmNdLnB1c2gob2Zmc2NyZWVuSW1hZ2UpO1xuXG4gICAgICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHNyYyxcbiAgICAgICAgICAgIGNhbnZhcyxcbiAgICAgICAgICAgIG9wdGlvbnM6IG9mZnNjcmVlbkltYWdlLm9wdGlvbnNcbiAgICAgICAgfSwgW2NhbnZhc10pO1xuXG4gICAgICAgIG9mZnNjcmVlbkltYWdlLnN0YXR1cyA9IE9mZnNjcmVlbkltYWdlLlNUQVRVUy5MT0FEX1NUQVJURUQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgZGlyZWN0b3J5IG5hbWUgZnJvbSBhIFVSTC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSB1cmwgLSBUaGUgVVJMIHRvIHN0YXJ0IHdpdGguXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBUaGUgVVJMIGV4Y2x1ZGluZyB0aGUgYmFzZW5hbWUuXG4gICAgICovXG4gICAgZ2V0RGlyZWN0b3J5TmFtZV8gKHVybCkge1xuICAgICAgICByZXR1cm4gdXJsLnJlcGxhY2UoL1teXFwvXSokLywgJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGEgVVJMIHRvIGFuIGFic29sdXRlIG9uZS4gVGhpcyBpcyB0byBlbnN1cmUgdGhhdCBwYXRocyB3b3JrIGJhc2VkXG4gICAgICogb24gdGhlIGN1cnJlbnQgcGFnZSdzIFVSTC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSB1cmwgLSBUaGUgVVJMIHRvIGNvbnZlcnQuXG4gICAgICogQHJldHVybiB7U3RyaW5nfSAtIEFuIGFic29sdXRlIFVSTC5cbiAgICAgKi9cbiAgICBjb252ZXJ0VVJMVG9BYnNvbHV0ZV8gKHVybCkge1xuICAgICAgICBpZiAodHlwZW9mIHVybCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY29udmVydFVSTFRvQWJzb2x1dGVfIGV4cGVjdHMgYSBzdHJpbmcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aCgnaHR0cCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRQYXRoID0gdGhpcy5nZXREaXJlY3RvcnlOYW1lXyh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgICAgICAgICBsZXQgYWJzb2x1dGVVUkwgPSBuZXcgVVJMKGN1cnJlbnRQYXRoICsgdXJsKTtcbiAgICAgICAgICAgIHJldHVybiBhYnNvbHV0ZVVSTC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyB0aGUgaW5jb21pbmcgbWVzc2FnZXMgZnJvbSB0aGUgd29ya2VyLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG1lc3NhZ2UgLSBUaGUgbWVzc2FnZSBmcm9tIHRoZSB3b3JrZXIuXG4gICAgICovXG4gICAgaGFuZGxlSW5jb21pbmdNZXNzYWdlXyAobWVzc2FnZSkge1xuXG4gICAgICAgIGlmIChtZXNzYWdlLmVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKG1lc3NhZ2UuZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHVybCA9IG1lc3NhZ2UudXJsO1xuICAgICAgICBsZXQgZWxlbWVudHMgPSB0aGlzLmpvYnNbdXJsXTtcbiAgICAgICAgbGV0IGVsZW1lbnQ7XG5cbiAgICAgICAgaWYgKG1lc3NhZ2UubG9hZCkge1xuICAgICAgICAgICAgZm9yIChsZXQgZSA9IDA7IGUgPCBlbGVtZW50cy5sZW5ndGg7IGUrKykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50c1tlXTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0YXR1cyA9IE9mZnNjcmVlbkltYWdlLlNUQVRVUy5MT0FERUQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBsZXQgaW1hZ2VCaXRtYXAgPSBtZXNzYWdlLmltYWdlQml0bWFwO1xuICAgICAgICAvL1xuICAgICAgICAvLyBmb3IgKGxldCBlID0gMDsgZSA8IGVsZW1lbnRzLmxlbmd0aDsgZSsrKSB7XG4gICAgICAgIC8vICAgICBlbGVtZW50ID0gZWxlbWVudHNbZV07XG4gICAgICAgIC8vICAgICBlbGVtZW50LnN0YXR1cyA9IE9mZnNjcmVlbkltYWdlLlNUQVRVUy5ERUNPREVEO1xuICAgICAgICAvLyAgICAgZWxlbWVudC5pbWFnZUJpdG1hcCA9IGltYWdlQml0bWFwO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgLy8gVGhlc2UgZWxlbWVudHMgbm8gbG9uZ2VyIG5lZWQgdXBkYXRpbmcsIHNvIHB1cmdlIHRoZSBsaXN0LlxuICAgICAgICB0aGlzLmpvYnNbdXJsXS5sZW5ndGggPSAwO1xuICAgIH1cbn1cblxubGV0IG9mZnNjcmVlbkhhbmRsZXIgPSBuZXcgT2Zmc2NyZWVuSW1hZ2VIYW5kbGVyKCk7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE1IEdvb2dsZSBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzc1xuICogb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nXG4gKiBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgaGVscGVyIGxpYnJhcnkgdGhhdCBkZWNvZGVzIGltYWdlcyBvZmYtbWFpbiB0aHJlYWQgdXNpbmdcbiAqIDxjb2RlPmNyZWF0ZUltYWdlQml0bWFwPC9jb2RlPiBpbiBhIHdvcmtlciwgYW5kIHRoZW4gdHJhbnNmZXJzIHRoZW0gYmFja1xuICogdG8gdGhlIG1haW4gdGhyZWFkIGFuZCBkcmF3cyB0aGVtIGludG8gYSBjYW52YXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9mZnRocmVhZEltYWdlIHtcblxuICAvKipcbiAgICogR2V0cyB0aGUgdmVyc2lvbiBudW1iZXIuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqIEBjb25zdFxuICAgKi9cbiAgc3RhdGljIGdldCB2ZXJzaW9uICgpIHtcbiAgICByZXR1cm4gJ0BWRVJTSU9OQCc7XG4gIH1cblxuICAvKipcbiAgICogRmFjdG9yeSBtZXRob2QgdG8gY3JlYXRlIGFuIGFycmF5IG9mIDxjb2RlPk9mZnRocmVhZEltYWdlPC9jb2RlPnMgYmFzZWRcbiAgICogb24gZXhpc3RpbmcgZWxlbWVudHMgaW4gdGhlIHBhZ2UuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQGV4YW1wbGVcbiAgICogICBsZXQgaW1hZ2VzID0gT2ZmdGhyZWFkSW1hZ2UuY3JlYXRlRnJvbVNlbGVjdG9yKCcub2ZmdGhyZWFkLWltZycpO1xuICAgKiBAcGFyYW0gIHtTdHJpbmd9IFtzZWxlY3Rvcj1cIi5vZmZ0aHJlYWQtaW1nXCJdIC0gVGhlIHNlbGVjdG9yIGZvciBleGlzdGluZ1xuICAgKiAgIE9mZnRocmVhZEltYWdlIGVsZW1lbnRzIGluIHRoZSBwYWdlLlxuICAgKiBAcmV0dXJuIHtBcnJheX0gLSBBbiBhcnJheSBvZiBPZmZUaHJlYWRJbWFnZXMuXG4gICAqL1xuICBzdGF0aWMgY3JlYXRlRnJvbVNlbGVjdG9yIChzZWxlY3RvciA9ICcub2ZmdGhyZWFkLWltZycpIHtcbiAgICBsZXQgaW1hZ2VzID0gW107XG4gICAgbGV0IGNhbmRpZGF0ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICBsZXQgY2FuZGlkYXRlO1xuICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY2FuZGlkYXRlcy5sZW5ndGg7IGMrKykge1xuICAgICAgY2FuZGlkYXRlID0gY2FuZGlkYXRlc1tjXTtcbiAgICAgIGltYWdlcy5wdXNoKG5ldyBPZmZ0aHJlYWRJbWFnZShjYW5kaWRhdGUpKTtcbiAgICB9XG4gICAgcmV0dXJuIGltYWdlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiBPZmZ0aHJlYWRJbWFnZVN0YXR1c1xuICAgKiBAdHlwZSBPYmplY3RcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IElORVJUIFRoZSBPZmZ0aHJlYWRJbWFnZSBpcyBpbmVydDsgbm8gc3JjIGFwcGxpZWQuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMT0FEX1NUQVJURUQgc3JjIGFwcGxpZWQ7IGxvYWQgaGFzIHN0YXJ0ZWQuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBMT0FERUQgVGhlIGltYWdlIGhhcyBsb2FkZWQsIGJ1dCBub3QgYmVlbiBkZWNvZGVkLlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gREVDT0RFRCBUaGUgaW1hZ2UgaGFzIGJlZW4gZGVjb2RlZCwgYnV0IG5vdCBwYWludGVkLlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gUEFJTlRFRCBUaGUgaW1hZ2UgaGFzIGJlZW4gcGFpbnRlZCB0byBhIGNhbnZhcyBlbGVtZW50LlxuICAgKi9cblxuICAvKipcbiAgICogVGhlIGVudW1lcmF0aW9uIG9mIHN0YXR1cyBjb2RlcyBhbiBPZmZ0aHJlYWRJbWFnZSBjYW4gaGF2ZS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAdHlwZSB7T2ZmdGhyZWFkSW1hZ2VTdGF0dXN9XG4gICAqIEBjb25zdFxuICAgKi9cbiAgc3RhdGljIGdldCBTVEFUVVMgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBJTkVSVDogJ2luZXJ0JyxcbiAgICAgIExPQURfU1RBUlRFRDogJ2xvYWRzdGFydGVkJyxcbiAgICAgIExPQURFRDogJ2xvYWQnLFxuICAgICAgREVDT0RFRDogJ2RlY29kZWQnLFxuICAgICAgUEFJTlRFRDogJ3BhaW50ZWQnXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbWluaW11bSBhbW91bnQgb2YgdGltZSwgaW4gbWlsbGlzZWNvbmRzLCB0aGF0IGRyYXdpbmcgdGhlIGltYWdlIHNob3VsZFxuICAgKiB0YWtlLiBJdCdzIGd1ZXNzdGltYXRlZCBhdCAxMG1zLCBhbmQgdGhlIE9mZnRocmVhZEltYWdlIHdpbGwgd2FpdCBmb3IgYW5cbiAgICogaWRsZSBjYWxsYmFjayAodXNpbmcgPGNvZGU+cmVxdWVzdElkbGVDYWxsYmFjazwvY29kZT4pIG9mIHRoYXQgbGVuZ3RoLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBjb25zdFxuICAgKi9cbiAgc3RhdGljIGdldCBNSU5fSU5TRVJUX0lETEVfV0lORE9XICgpIHtcbiAgICByZXR1cm4gMTA7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZWN0cyBpZiBjcmVhdGVJbWFnZUJpdG1hcCBpcyBhdmFpbGFibGUgZm9yIHVzZSBpbiB0aGUgY3VycmVudCBicm93c2VyLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKiBAY29uc3RcbiAgICovXG4gIHN0YXRpYyBnZXQgYXZhaWxhYmxlICgpIHtcbiAgICByZXR1cm4gKCdjcmVhdGVJbWFnZUJpdG1hcCcgaW4gd2luZG93KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IE9mZnRocmVhZEltYWdlIGFyb3VuZCBhbiBleGlzdGluZyBlbGVtZW50LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBsZXQgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm9mZnRocmVhZC1pbWcnKTtcbiAgICogbGV0IGltZyA9IG5ldyBPZmZ0aHJlYWRJbWFnZSh0YXJnZXQpO1xuICAgKiB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignZGVjb2RlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICogICAvLyBUaGUgaW1hZ2UgaGFzIGJlZW4gZGVjb2RlZC4uLiByZW1vdmUgdGhlIHNwaW5uZXIuXG4gICAqICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3NwaW5uZXInKTtcbiAgICogfSk7XG4gICAqIGltZy5zcmMgPSAnaW1hZ2UucG5nJztcbiAgICpcbiAgICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgVGhlIHRhcmdldCBlbGVtZW50IHRvIHVzZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yIChlbGVtZW50PW51bGwpIHtcblxuICAgIGlmIChlbGVtZW50ID09PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IEVycm9yICgnT2ZmdGhyZWFkSW1hZ2UoKSByZXF1aXJlcyBhIHRhcmdldCBlbGVtZW50Jyk7XG5cbiAgICB0aGlzLmlkXyA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKS50b1N0cmluZygxNik7XG4gICAgdGhpcy5jYW52YXNfID0gbnVsbDtcbiAgICB0aGlzLmN0eF8gPSBudWxsO1xuICAgIHRoaXMuZWxlbWVudF8gPSBlbGVtZW50O1xuICAgIHRoaXMub25Mb2FkXyA9IG51bGw7XG4gICAgdGhpcy5vbkRlY29kZV8gPSBudWxsO1xuICAgIHRoaXMuc3RhdHVzID0gT2ZmdGhyZWFkSW1hZ2UuU1RBVFVTLklORVJUO1xuICAgIHRoaXMuc3JjXyA9IG51bGw7XG4gICAgdGhpcy53aWR0aF8gPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnd2lkdGgnKTtcbiAgICB0aGlzLmhlaWdodF8gPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XG4gICAgdGhpcy5kcmF3V2lkdGhfID0gdGhpcy53aWR0aF87XG4gICAgdGhpcy5kcmF3SGVpZ2h0XyA9IHRoaXMuaGVpZ2h0XztcbiAgICB0aGlzLmJhY2tncm91bmRfID0gZmFsc2U7XG5cbiAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3NyYycpKSB7XG4gICAgICB0aGlzLnNyYyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICB9IGVsc2UgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdiZy1zcmMnKSkge1xuICAgICAgdGhpcy5zcmMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnYmctc3JjJyk7XG4gICAgICB0aGlzLmJhY2tncm91bmRfID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIShlbGVtZW50LmdldEF0dHJpYnV0ZSgnYWx0JykgfHwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKSkpXG4gICAgICBjb25zb2xlLndhcm4oJ1RoZSBlbGVtZW50IGRvZXMgaGF2ZSBhbiBhbHQgb3IgYXJpYS1sYWJlbCBhdHRyaWJ1dGUuJyk7XG4gICAgZWxzZSBpZiAoIWVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJykpXG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhbHQnKSk7XG5cbiAgICBpZiAoIWVsZW1lbnQuZ2V0QXR0cmlidXRlKCdyb2xlJykpXG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdpbWcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc291cmNlIFVSTCBvZiB0aGUgaW1hZ2UuXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSAtIFRoZSBpbWFnZSBVUkwuXG4gICAqL1xuICBnZXQgc3JjICgpIHtcbiAgICByZXR1cm4gdGhpcy5zcmNfO1xuICB9XG5cbiAgc2V0IHNyYyAoc3JjXykge1xuICAgIHRoaXMuc3JjXyA9IHNyY187XG4gICAgdGhpcy5zdGF0dXNfID0gT2ZmdGhyZWFkSW1hZ2UuU1RBVFVTLkxPQURfU1RBUlRFRDtcbiAgICBpbWdIYW5kbGVyLmVucXVldWUodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhbmQgZ2V0cyB0aGUgY3VycmVudCBzdGF0dXMgb2YgdGhlIGltYWdlXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7T2ZmdGhyZWFkSW1hZ2VTdGF0dXN9IC0gVGhlIGltYWdlJ3Mgc3RhdHVzLlxuICAgKi9cbiAgc2V0IHN0YXR1cyAoc3RhdHVzXykge1xuXG4gICAgc3dpdGNoIChzdGF0dXNfKSB7XG4gICAgICBjYXNlIE9mZnRocmVhZEltYWdlLlNUQVRVUy5JTkVSVDpcbiAgICAgIGNhc2UgT2ZmdGhyZWFkSW1hZ2UuU1RBVFVTLkxPQURfU1RBUlRFRDpcbiAgICAgIGNhc2UgT2ZmdGhyZWFkSW1hZ2UuU1RBVFVTLkxPQURFRDpcbiAgICAgIGNhc2UgT2ZmdGhyZWFkSW1hZ2UuU1RBVFVTLkRFQ09ERUQ6XG4gICAgICBjYXNlIE9mZnRocmVhZEltYWdlLlNUQVRVUy5QQUlOVEVEOlxuICAgICAgICB0aGlzLmZpcmVfKHN0YXR1c18pO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHN0YXR1czogJHtzdGF0dXNffWApO1xuICAgIH1cblxuICAgIHRoaXMuc3RhdHVzXyA9IHN0YXR1c187XG4gIH1cblxuICBnZXQgc3RhdHVzICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0dXNfO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIEltYWdlQml0bWFwIG9uIHRoZSBjYW52YXMuIFRoZSBiaXRtYXAgZGF0YSBpcyBkaXNjYXJkZWRcbiAgICogaW1tZWRpYXRlbHkgYWZ0ZXIgaXQgaGFzIGJlZW4gZHJhd24gc28gYXMgdG8ga2VlcCBtZW1vcnkgdXNhZ2UgZG93bi5cbiAgICogVGhlcmVmb3JlIGNhbGxpbmcgdGhlIDxjb2RlPmltYWdlQml0bWFwPC9jb2RlPiBnZXR0ZXIgd2lsbCBhbHdheXMgcmV0dXJuXG4gICAqIG51bGwuXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7SW1hZ2VCaXRtYXB9IC0gVGhlIEltYWdlQml0bWFwIGRhdGEgdG8gZHJhdyB0byB0aGUgY2FudmFzLlxuICAgKi9cbiAgc2V0IGltYWdlQml0bWFwIChpbWFnZUJpdG1hcF8pIHtcblxuICAgIGxldCByZW5kZXJCaXRtYXBEYXRhID0gKGRlYWRsaW5lKSA9PiB7XG5cbiAgICAgIC8vIE1ha2Ugc3VyZSB0aGVyZSBpcyBlbm91Z2ggdGltZSB0byBpbnNlcnQgdGhlIGltYWdlLiBBbnl0aGluZyBsZXNzIHRoYW5cbiAgICAgIC8vIHRoZSBtaW5pbXVtIHdpbmRvdyBpcyB1bmxpa2VseSB0byBiZSBlbm91Z2gsIHNvIGhvbGQgcmVzY2hlZHVsZSBpZlxuICAgICAgLy8gbmVlZGVkLlxuICAgICAgaWYgKGRlYWRsaW5lLnRpbWVSZW1haW5pbmcoKSA8IE9mZnRocmVhZEltYWdlLk1JTl9JTlNFUlRfSURMRV9XSU5ET1cpXG4gICAgICAgIHJldHVybiByZXF1ZXN0SWRsZUNhbGxiYWNrKHJlbmRlckJpdG1hcERhdGEpO1xuXG4gICAgICBpZiAodGhpcy5jYW52YXNfID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuY2FudmFzXyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICB0aGlzLmNhbnZhc18uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmN0eF8gPT09IG51bGwpXG4gICAgICAgIHRoaXMuY3R4XyA9IHRoaXMuY2FudmFzXy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAvLyBTZXQgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIGNhbnZhcy5cbiAgICAgIHRoaXMuc2V0Q2FudmFzRGltZW5zaW9uc18oaW1hZ2VCaXRtYXBfKTtcbiAgICAgIHRoaXMuY3R4Xy5kcmF3SW1hZ2UoaW1hZ2VCaXRtYXBfLCAwLCAwLFxuICAgICAgICAgIHRoaXMuZHJhd1dpZHRoXywgdGhpcy5kcmF3SGVpZ2h0Xyk7XG5cbiAgICAgIHRoaXMuZWxlbWVudF8uYXBwZW5kQ2hpbGQodGhpcy5jYW52YXNfKTtcbiAgICAgIHRoaXMuc3RhdHVzID0gT2ZmdGhyZWFkSW1hZ2UuU1RBVFVTLlBBSU5URUQ7XG4gICAgfVxuXG4gICAgcmVxdWVzdElkbGVDYWxsYmFjayhyZW5kZXJCaXRtYXBEYXRhKTtcbiAgfVxuXG4gIGdldCBpbWFnZUJpdG1hcCAoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY2FudmFzJ3MgZGltZW5zaW9ucyBiYXNlZCBvbiB0aGUgSW1hZ2VCaXRtYXAgZGF0YSBwcm92aWRlZC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtJbWFnZUJpdG1hcH0gaW1hZ2VCaXRtYXAgLSBUaGUgSW1hZ2VCaXRtYXAgdG8gdXNlIGZvciByZXNpemluZyB0aGVcbiAgICogICBjYW52YXMgKGlmIG5lY2Vzc2FyeSkuXG4gICAqL1xuICBzZXRDYW52YXNEaW1lbnNpb25zXyAoaW1hZ2VCaXRtYXBfKSB7XG5cbiAgICBpZiAodGhpcy5iYWNrZ3JvdW5kXykge1xuICAgICAgLy8gSWYgdGhpcyBpcyBhIGJhY2tncm91bmQgaW1hZ2UsIGRlZmF1bHQgdGhlIGNhbnZhcyB0byB0aGUgZGltZW5zaW9ucyBvZlxuICAgICAgLy8gdGhlIGNvbnRhaW5lciBlbGVtZW50LlxuICAgICAgdGhpcy53aWR0aF8gPSB0aGlzLmVsZW1lbnRfLm9mZnNldFdpZHRoO1xuICAgICAgdGhpcy5oZWlnaHRfID0gdGhpcy5lbGVtZW50Xy5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgIHRoaXMuZHJhd1dpZHRoXyA9IGltYWdlQml0bWFwXy53aWR0aDtcbiAgICAgIHRoaXMuZHJhd0hlaWdodF8gPSBpbWFnZUJpdG1hcF8uaGVpZ2h0O1xuXG4gICAgICBsZXQgYmFja2dyb3VuZFNpemUgPVxuICAgICAgICAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWxlbWVudF8pLmJhY2tncm91bmRTaXplO1xuICAgICAgbGV0IHJhdGlvID0gMTtcblxuICAgICAgc3dpdGNoIChiYWNrZ3JvdW5kU2l6ZSkge1xuXG4gICAgICAgIGNhc2UgJ2NvbnRhaW4nOlxuICAgICAgICAgIHJhdGlvID0gTWF0aC5taW4odGhpcy53aWR0aF8gLyB0aGlzLmRyYXdXaWR0aF8sXG4gICAgICAgICAgICAgIHRoaXMuaGVpZ2h0XyAvIHRoaXMuZHJhd0hlaWdodF8pO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2NvdmVyJzpcbiAgICAgICAgICByYXRpbyA9IE1hdGgubWF4KHRoaXMud2lkdGhfIC8gdGhpcy5kcmF3V2lkdGhfLFxuICAgICAgICAgICAgICB0aGlzLmhlaWdodF8gLyB0aGlzLmRyYXdIZWlnaHRfKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgfVxuXG4gICAgICB0aGlzLmRyYXdXaWR0aF8gKj0gcmF0aW87XG4gICAgICB0aGlzLmRyYXdIZWlnaHRfICo9IHJhdGlvO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgLy8gVGhpcyBpcyBhbiBpbmxpbmUgaW1hZ2Ugc28gbm93IHdlIG5lZWQgdG8gYWNjb3VudCBmb3IgaXQgYXMgc3VjaC5cbiAgICAgIC8vIEZpcnN0bHksIGlmIHRoZSB3aWR0aCBpcyBzZXQsIGJ1dCBub3QgdGhlIGhlaWdodCwgc2V0IHRoZSBoZWlnaHQgYmFzZWRcbiAgICAgIC8vIG9uIHRoZSB3aWR0aC4gQW5kIHRoZW4gZG8gdGhlIHNhbWUgaW4gcmV2ZXJzZSBmb3IgaGVpZ2h0IGJ1dCBub3Qgd2lkdGhcbiAgICAgIC8vIGFuZCBmaW5hbGx5IGRlZmF1bHQgdG8gd2hhdGV2ZXIgdGhlIGltYWdlJ3MgbmF0dXJhbCBkaW1lbnNpb25zIHdlcmUuXG4gICAgICBpZiAodGhpcy53aWR0aF8gIT09IG51bGwgJiYgdGhpcy5oZWlnaHRfID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuaGVpZ2h0XyA9IHRoaXMud2lkdGhfICogKGltYWdlQml0bWFwXy5oZWlnaHQgLyBpbWFnZUJpdG1hcF8ud2lkdGgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLndpZHRoXyA9PT0gbnVsbCAmJiB0aGlzLmhlaWdodF8gIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy53aWR0aF8gPSB0aGlzLmhlaWdodF8gKiAoaW1hZ2VCaXRtYXBfLndpZHRoIC8gaW1hZ2VCaXRtYXBfLmhlaWdodCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMud2lkdGhfID09PSBudWxsICYmIHRoaXMuaGVpZ2h0XyA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLndpZHRoXyA9IGltYWdlQml0bWFwXy53aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHRfID0gaW1hZ2VCaXRtYXBfLmhlaWdodDtcbiAgICAgIH1cblxuICAgICAgdGhpcy53aWR0aF8gPSBwYXJzZUludCh0aGlzLndpZHRoXyk7XG4gICAgICB0aGlzLmhlaWdodF8gPSBwYXJzZUludCh0aGlzLmhlaWdodF8pO1xuXG4gICAgICB0aGlzLmRyYXdXaWR0aF8gPSB0aGlzLndpZHRoXztcbiAgICAgIHRoaXMuZHJhd0hlaWdodF8gPSB0aGlzLmhlaWdodF87XG4gICAgfVxuXG4gICAgLy8gTm93IHJlc2l6ZSB0aGUgY2FudmFzIGFwcHJvcHJpYXRlbHkuXG4gICAgdGhpcy5jYW52YXNfLndpZHRoID0gdGhpcy53aWR0aF87XG4gICAgdGhpcy5jYW52YXNfLmhlaWdodCA9IHRoaXMuaGVpZ2h0XztcblxuICB9XG5cbiAgLyoqXG4gICAqIEZpcmVzIGFuIGV2ZW50IG9uIHRoZSBlbGVtZW50LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge30gW2RldGFpbD1udWxsXSAtIFRoZSBkYXRhIHRvIGluY2x1ZGUgaW4gdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtidWJibGVzPXRydWVdIC0gV2hldGhlciB0aGUgZXZlbnQgc2hvdWxkIGJ1YmJsZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbY2FuY2VsYWJsZT10cnVlXSAtIFdoZXRoZXIgdGhlIGV2ZW50IGlzIGNhbmNlbGFibGUuXG4gICAqL1xuICBmaXJlXyAoZXZlbnROYW1lLCBkZXRhaWw9bnVsbCwgYnViYmxlcz10cnVlLCBjYW5jZWxhYmxlPXRydWUpIHtcbiAgICBsZXQgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgeyBkZXRhaWwsIGJ1YmJsZXMsIGNhbmNlbGFibGUgfSk7XG4gICAgdGhpcy5lbGVtZW50Xy5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gIH1cblxufVxuXG5jbGFzcyBPZmZ0aHJlYWRJbWFnZUhhbmRsZXIge1xuXG4gIC8qKlxuICAgKiBUaGUgY29vcmRpbmF0b3IgZm9yIGFsbCA8Y29kZT5PZmZ0aHJlYWRJbWFnZTwvY29kZT4gaW5zdGFuY2VzLiBTcGlucyB1cCB0aGVcbiAgICogd29ya2VyIGFuZCBoYXMgaXQgZW5xdWV1ZSBpbWFnZSBsb2FkcyBieSBVUkwuIFdoZW4gYW4gSW1hZ2VCaXRtYXAgaXNcbiAgICogcmV0dXJuZWQgZnJvbSB0aGUgd29ya2VyIGl0IG5vdGlmaWVzIGFsbCA8Y29kZT5PZmZ0aHJlYWRJbWFnZTwvY29kZT5zLiBJdFxuICAgKiBpcyBhbHNvIHJlc3BvbnNpYmxlIGZvciBzZXR0aW5nIHRoZSBzdGF0dXMgb2YgYWxsXG4gICAqIDxjb2RlPk9mZnRocmVhZEltYWdlPC9jb2RlPnMsIGkuZS4gbG9hZGVkLCBkZWNvZGVkLCBldGMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25zdHJ1Y3RvciAoKSB7XG5cbiAgICBsZXQgY3VycmVudFNjcmlwdERpciA9XG4gICAgICAgIHRoaXMuZ2V0RGlyZWN0b3J5TmFtZV8oXG4gICAgICAgICAgdGhpcy5jb252ZXJ0VVJMVG9BYnNvbHV0ZV8oZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmMpXG4gICAgICAgICk7XG5cbiAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIoYCR7Y3VycmVudFNjcmlwdERpcn0vb2ZmdGhyZWFkLWltZy13b3JrZXIuanNgKTtcbiAgICB0aGlzLndvcmtlci5vbm1lc3NhZ2UgPSAoZXZ0KSA9PiB0aGlzLmhhbmRsZUluY29taW5nTWVzc2FnZV8oZXZ0LmRhdGEpO1xuICAgIHRoaXMuam9icyA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEVucXVldWVzIGFuIGVsZW1lbnQsIHN0b3JpbmcgYSByZWZlcmVuY2UgdG8gaXQgYWdhaW5zdCBpdHMgVVJMLiBXaGVuIHRoZVxuICAgKiB3b3JrZXIgcmV0dXJucyB0aGUgSW1hZ2VCaXRtYXAgZGF0YSBmb3IgdGhlIFVSTCwgaXQgKGFuZCBhbnkgb3RoZXJcbiAgICogZWxlbWVudHMpIHdhaXRpbmcgZm9yIHRoYXQgSW1hZ2VCaXRtYXAgd2lsbCBiZSBub3RpZmllZC5cbiAgICpcbiAgICogQHBhcmFtICB7T2ZmdGhyZWFkSW1hZ2V9IG9mZnRocmVhZEltYWdlIC0gVGhlIE9mZnRocmVhZEltYWdlIGluc3RhbmNlLlxuICAgKi9cbiAgZW5xdWV1ZSAob2ZmdGhyZWFkSW1hZ2UpIHtcbiAgICBpZiAoIShvZmZ0aHJlYWRJbWFnZSBpbnN0YW5jZW9mIE9mZnRocmVhZEltYWdlKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignRW5xdWV1ZSBleHBlY3RzIGFuIE9mZnRocmVhZEltYWdlJyk7XG5cbiAgICAvLyBFbnN1cmUgdGhlIFVSTCBpcyBhYnNvbHV0ZS5cbiAgICBsZXQgc3JjID0gdGhpcy5jb252ZXJ0VVJMVG9BYnNvbHV0ZV8ob2ZmdGhyZWFkSW1hZ2Uuc3JjKTtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5qb2JzW3NyY10gPT09ICd1bmRlZmluZWQnKVxuICAgICAgdGhpcy5qb2JzW3NyY10gPSBbXTtcblxuICAgIHRoaXMuam9ic1tzcmNdLnB1c2gob2ZmdGhyZWFkSW1hZ2UpO1xuICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKHNyYyk7XG5cbiAgICBvZmZ0aHJlYWRJbWFnZS5zdGF0dXMgPSBPZmZ0aHJlYWRJbWFnZS5TVEFUVVMuTE9BRF9TVEFSVEVEO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGRpcmVjdG9yeSBuYW1lIGZyb20gYSBVUkwuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge1N0cmluZ30gdXJsIC0gVGhlIFVSTCB0byBzdGFydCB3aXRoLlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBVUkwgZXhjbHVkaW5nIHRoZSBiYXNlbmFtZS5cbiAgICovXG4gIGdldERpcmVjdG9yeU5hbWVfICh1cmwpIHtcbiAgICByZXR1cm4gdXJsLnJlcGxhY2UoL1teXFwvXSokLywgJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgVVJMIHRvIGFuIGFic29sdXRlIG9uZS4gVGhpcyBpcyB0byBlbnN1cmUgdGhhdCBwYXRocyB3b3JrIGJhc2VkXG4gICAqIG9uIHRoZSBjdXJyZW50IHBhZ2UncyBVUkwuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge1N0cmluZ30gdXJsIC0gVGhlIFVSTCB0byBjb252ZXJ0LlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IC0gQW4gYWJzb2x1dGUgVVJMLlxuICAgKi9cbiAgY29udmVydFVSTFRvQWJzb2x1dGVfICh1cmwpIHtcblxuICAgIGlmICh0eXBlb2YgdXJsICE9PSAnc3RyaW5nJylcbiAgICAgIHRocm93IG5ldyBFcnJvciAoJ2NvbnZlcnRVUkxUb0Fic29sdXRlXyBleHBlY3RzIGEgc3RyaW5nJyk7XG5cbiAgICBpZiAodXJsLnN0YXJ0c1dpdGgoJ2h0dHAnKSlcbiAgICAgIHJldHVybiB1cmw7XG4gICAgZWxzZSB7XG4gICAgICBsZXQgY3VycmVudFBhdGggPSB0aGlzLmdldERpcmVjdG9yeU5hbWVfKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgIGxldCBhYnNvbHV0ZVVSTCA9IG5ldyBVUkwoY3VycmVudFBhdGggKyB1cmwpO1xuICAgICAgcmV0dXJuIGFic29sdXRlVVJMLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdGhlIGluY29taW5nIG1lc3NhZ2VzIGZyb20gdGhlIHdvcmtlci5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7T2JqZWN0fSBtZXNzYWdlIC0gVGhlIG1lc3NhZ2UgZnJvbSB0aGUgd29ya2VyLlxuICAgKi9cbiAgaGFuZGxlSW5jb21pbmdNZXNzYWdlXyAobWVzc2FnZSkge1xuXG4gICAgaWYgKG1lc3NhZ2UuZXJyb3IpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLndhcm4obWVzc2FnZS5lcnJvcik7XG4gICAgfVxuXG4gICAgbGV0IHVybCA9IG1lc3NhZ2UudXJsO1xuICAgIGxldCBlbGVtZW50cyA9IHRoaXMuam9ic1t1cmxdO1xuICAgIGxldCBlbGVtZW50O1xuXG4gICAgaWYgKG1lc3NhZ2UubG9hZCkge1xuICAgICAgZm9yIChsZXQgZSA9IDA7IGUgPCBlbGVtZW50cy5sZW5ndGg7IGUrKykge1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudHNbZV07XG4gICAgICAgIGVsZW1lbnQuc3RhdHVzID0gT2ZmdGhyZWFkSW1hZ2UuU1RBVFVTLkxPQURFRDtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgaW1hZ2VCaXRtYXAgPSBtZXNzYWdlLmltYWdlQml0bWFwO1xuXG4gICAgZm9yIChsZXQgZSA9IDA7IGUgPCBlbGVtZW50cy5sZW5ndGg7IGUrKykge1xuICAgICAgZWxlbWVudCA9IGVsZW1lbnRzW2VdO1xuICAgICAgZWxlbWVudC5zdGF0dXMgPSBPZmZ0aHJlYWRJbWFnZS5TVEFUVVMuREVDT0RFRDtcbiAgICAgIGVsZW1lbnQuaW1hZ2VCaXRtYXAgPSBpbWFnZUJpdG1hcDtcbiAgICB9XG5cbiAgICAvLyBUaGVzZSBlbGVtZW50cyBubyBsb25nZXIgbmVlZCB1cGRhdGluZywgc28gcHVyZ2UgdGhlIGxpc3QuXG4gICAgdGhpcy5qb2JzW3VybF0ubGVuZ3RoID0gMDtcbiAgfVxufVxuXG5sZXQgaW1nSGFuZGxlciA9IG5ldyBPZmZ0aHJlYWRJbWFnZUhhbmRsZXIoKTtcbiJdfQ==
