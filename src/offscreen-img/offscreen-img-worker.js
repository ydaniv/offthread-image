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
                        error: `Unable to load resource with url ${src}`
                    });
                }

                return response.blob();
            })

            // Turn it into an ImageBitmap.
            .then((blobData) => createImageBitmap(blobData))

            // Do pixel manipulation and commit
            .then((imageBitmap) => {
                this.setCanvasDimensions_(canvas, imageBitmap, options);

                this.composite(canvas, imageBitmap, options);
            })

            // Notify to main thread.
            .then(() => {
                this.workerContext.postMessage({ url: src, done: true });
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

        ctx.drawImage(bitmap, 0, 0, options.drawWidth, options.drawHeight);

        ctx.commit();
    }

    setCanvasDimensions_ (canvas, imageBitmap_, options) {
        if (options.background) {
            options.drawWidth = imageBitmap_.width;
            options.drawHeight = imageBitmap_.height;

            let ratio = 1;

            switch (options.backgroundSize) {

                case 'contain':
                    ratio = Math.min(options.width / options.drawWidth,
                        options.height / options.drawHeight);
                    break;

                case 'cover':
                    ratio = Math.max(options.width / options.drawWidth,
                        options.height / options.drawHeight);
                    break;

            }

            options.drawWidth *= ratio;
            options.drawHeight *= ratio;

        }
        else {

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
}

let compositor = new Compositor(self);

self.onmessage = (evt) => compositor.enqueue(evt.data);
