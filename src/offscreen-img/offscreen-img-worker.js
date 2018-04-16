'use strict';

let log = self.console.log.bind(self.console);

class Compositor {

    constructor (workerContext) {
        this.queue = [];
        this.workerContext = workerContext;
    }

    enqueue (data) {
        // Bail if this URL is already enqueued.
        if ( this.queue.indexOf(data.src) >= 0 ) {
            return;
        }

        this.queue.push(data);
        this.processQueue();
    }

    processQueue () {
        if ( this.queue.length === 0 ) {
            return;
        }

        let {src, canvas, options} = this.queue.shift();

        // Fetch the image.
        return fetch(src)
            .then(response => {
                this.workerContext.postMessage({
                    url: src,
                    load: true
                });

                if (response.status !== 200) {
                    return this.workerContext.postMessage({
                        error: `Unable to load resource with url ${url}`
                    });
                }

                return response.blob();
            })

            // Turn it into an ImageBitmap.
            .then((blobData) => createImageBitmap(blobData))

            // Do pixel manipulation and commit
            .then((imageBitmap) => {
                this.setCanvasDimensions_(imageBitmap)
                this.composite(canvas, imageBitmap, options);
            })

            // Notify to main thread.
            .then(() => {
                this.workerContext.postMessage({ url });
            }, (err) => {
                this.workerContext.postMessage({
                    error: err.toString()
                });
            })

            // Check the queue.
            .then(() => this.processQueue())
            .catch(() => this.processQueue());
    }

    composite (canvas, bitmap, options) {
        const ctx = canvas.getContext('2d');

        if ( options && options.filter ) {
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
    setCanvasDimensions_ (imageBitmap_) {

        if (this.background_) {
            // If this is a background image, default the canvas to the dimensions of
            // the container element.
            this.width_ = this.element_.offsetWidth;
            this.height_ = this.element_.offsetHeight;

            this.drawWidth_ = imageBitmap_.width;
            this.drawHeight_ = imageBitmap_.height;

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

    /**
     * Sets the canvas's dimensions based on the ImageBitmap data provided.
     *
     * @private
     * @param {ImageBitmap} imageBitmap - The ImageBitmap to use for resizing the
     *   canvas (if necessary).
     */
    setCanvasDimensions_ (imageBitmap_) {

        if (this.background_) {
            // If this is a background image, default the canvas to the dimensions of
            // the container element.
            this.width_ = this.element_.offsetWidth;
            this.height_ = this.element_.offsetHeight;

            this.drawWidth_ = imageBitmap_.width;
            this.drawHeight_ = imageBitmap_.height;

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

let compositor = new Compositor(self);

self.onmessage = (evt) => compositor.enqueue(evt.data);
