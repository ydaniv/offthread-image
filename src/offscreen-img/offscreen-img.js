import OffthreadImage from '../offthread-img/offthread-img';

export default class OffscreenImage extends OffthreadImage {

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
    static createFromSelector (selector = '.offscreen-img') {
        let images = [];
        let candidates = document.querySelectorAll(selector);
        let candidate;
        for (let c = 0; c < candidates.length; c++) {
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
    static get available () {
        return ('OffscreenCanvas' in window);
    }

    constructor (element=null, options) {
        super(element);

        this.options = options;
        this.canvas_ = this.element_;

        if (element.dataset.src) {
            this.src = element.dataset.src;
        }
        else if (element.dataset.bgSrc) {
            this.src = element.dataset.bgSrc;
            this.background_ = true;
        }

        // this.setCanvasIntrinsicDimensions_();
    }

    set imageBitmap (imageBitmap_) {
        throw new Error('Can not set bitmap, control has been transferred to offscreen');
    }

    /**
     * The source URL of the image.
     *
     * @property {String} - The image URL.
     */
    get src () {
        return this.src_;
    }

    set src (src_) {
        this.src_ = src_;
        this.status_ = OffscreenImage.STATUS.LOAD_STARTED;
        offscreenHandler.enqueue(this);
    }

    /**
     * Sets the canvas's intrinsic dimensions based on the element and attributes.
     *
     * @private
     */
    setCanvasIntrinsicDimensions_ () {

        if (this.background_) {
            // If this is a background image, default the canvas to the dimensions of
            // the container element.
            this.width_ = this.element_.offsetWidth;
            this.height_ = this.element_.offsetHeight;

            let backgroundSize =
                window.getComputedStyle(this.element_).backgroundSize;
            let ratio = 1;

            switch (backgroundSize) {

                case 'contain':
                    ratio = Math.min(this.width_ / this.drawWidth_,
                        this.height_ / this.drawHeight_);
                    break;

                case 'cover':
                    ratio = Math.max(this.width_ / this.drawWidth_,
                        this.height_ / this.drawHeight_);
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
}

class OffscreenImageHandler {
    constructor () {
        let currentScriptDir =
            this.getDirectoryName_(
                this.convertURLToAbsolute_(document.currentScript.src)
            );

        this.worker = new Worker(`${currentScriptDir}/offscreen-img-worker.js`);
        this.worker.onmessage = (evt) => this.handleIncomingMessage_(evt.data);
        this.jobs = {};
    }

    /**
     * Enqueues an element, storing a reference to it against its URL. When the
     * worker returns the ImageBitmap data for the URL, it (and any other
     * elements) waiting for that ImageBitmap will be notified.
     *
     * @param  {OffscreenImage} offscreenImage - The OffscreenImage instance.
     */
    enqueue (offscreenImage) {
        if (!(offscreenImage instanceof OffscreenImage)) {
            throw new Error('Enqueue expects an OffscreenImage');
        }

        // Ensure the URL is absolute.
        let src = this.convertURLToAbsolute_(offscreenImage.src);
        let canvas = offscreenImage.canvas_.transferControlToOffscreen();

        if (typeof this.jobs[src] === 'undefined') {
            this.jobs[src] = [];
        }

        this.jobs[src].push(offscreenImage);

        this.worker.postMessage({
            src,
            canvas,
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
    getDirectoryName_ (url) {
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
    convertURLToAbsolute_ (url) {
        if (typeof url !== 'string') {
            throw new Error('convertURLToAbsolute_ expects a string');
        }

        if (url.startsWith('http')) {
            return url;
        }
        else {
            let currentPath = this.getDirectoryName_(window.location.href);
            let absoluteURL = new URL(currentPath + url);
            return absoluteURL.toString();
        }
    }

    /**
     * Handles the incoming messages from the worker.
     *
     * @private
     * @param  {Object} message - The message from the worker.
     */
    handleIncomingMessage_ (message) {

        if (message.error) {
            return console.warn(message.error);
        }

        let url = message.url;
        let elements = this.jobs[url];
        let element;

        if (message.load) {
            for (let e = 0; e < elements.length; e++) {
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
}

let offscreenHandler = new OffscreenImageHandler();
