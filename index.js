const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err =>
            console.log("Error", err)
        )
}


function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.height = height;
    canvas.width = width;

        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height);
        pixels = imageEdges(pixels);
        ctx.putImageData(pixels, 0, 0);

    // return setInterval(() => {
    //     ctx.drawImage(video, 0, 0, width, height);
    //     let pixels = ctx.getImageData(0, 0, width, height);
    //     pixels = imageEdges(pixels);
    //     ctx.putImageData(pixels, 0, 0);
    // }, 20);
}

function imageEdges(pixels) {
    console.log(pixels);
    let tmpPixels = [];
    let returnedImageData;
    let width = pixels.width;
    let height = pixels.height;

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            // pixels.data[((row * (width * 4)) + (col * 4)) + 0] = pixels.data[((row * (width * 4)) + (col * 4)) + 0] + 200;
            // pixels.data[((row * (width * 4)) + (col * 4)) + 1] = pixels.data[((row * (width * 4)) + (col * 4)) + 1] + 50;
            // pixels.data[((row * (width * 4)) + (col * 4)) + 2] = pixels.data[((row * (width * 4)) + (col * 4)) + 2] + 160;
            // pixels.data[((row * (width * 4)) + (col * 4)) + 2] = pixels.data[((row * (width * 4)) + (col * 4)) + 2] + 160;
            r = pixels.data[((row * (width * 4)) + (col * 4)) + 0] + 200;
            g = pixels.data[((row * (width * 4)) + (col * 4)) + 1] + 50;
            b = pixels.data[((row * (width * 4)) + (col * 4)) + 2] + 150;
            a = pixels.data[((row * (width * 4)) + (col * 4)) + 3] + 0;
            tmpPixels.push(r, g, b, a);
        }
    }

    tmpPixels = Uint8ClampedArray.from(tmpPixels);
    returnedImageData = new ImageData(tmpPixels, width, height);

    return returnedImageData;
}

function rgbSplit(pixels) {;
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0];
        pixels.data[i + 500] = pixels.data[i + 1];
        pixels.data[i - 300] = pixels.data[i + 2];
    }

    return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);