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

        // ctx.drawImage(video, 0, 0, width, height);
        // let pixels = ctx.getImageData(0, 0, width, height);
        // pixels = imageEdges(pixels);
        // ctx.putImageData(pixels, 0, 0);

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height);
        pixels = imageEdges(pixels);
        ctx.putImageData(pixels, 0, 0);
    }, );
}

function imageEdges(pixels) {
    console.log(pixels);
    let tmpPixels = [];
    let returnedImageData;
    let width = pixels.width;
    let height = pixels.height;
    let Gx = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    let Gy = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {

            let rGx = 0, bGx = 0, gGx = 0, rGy = 0, bGy = 0, gGy = 0;
            let rXY = 0, bXY = 0, gXY = 0; aXY = 255;

            for (let k = -1; k <= 1; k++) {
                for (let l = -1; l <= 1; l++) {
                    if (col + k < width && col + k > -1 && row + l < height && row + l > -1) {
                        rGx += (pixels.data[(((row + k) * (width * 4)) + ((col + l)* 4)) + 0]) * Gx[k + 1][l + 1];
                        bGx += (pixels.data[(((row + k) * (width * 4)) + ((col + l)* 4)) + 1]) * Gx[k + 1][l + 1];
                        gGx += (pixels.data[(((row + k) * (width * 4)) + ((col + l)* 4)) + 2]) * Gx[k + 1][l + 1];

                        rGy += (pixels.data[(((row + k) * (width * 4)) + ((col + l)* 4)) + 0]) * Gy[k + 1][l + 1];
                        bGy += (pixels.data[(((row + k) * (width * 4)) + ((col + l)* 4)) + 1]) * Gy[k + 1][l + 1];
                        gGy += (pixels.data[(((row + k) * (width * 4)) + ((col + l)* 4)) + 2]) * Gy[k + 1][l + 1];

                    }
                }
            }
            rXY = Math.round(Math.sqrt((rGx * rGx) + (rGy * rGy)));
            bXY = Math.round(Math.sqrt((bGx * bGx) + (bGy * bGy)));
            gXY = Math.round(Math.sqrt((gGx * gGx) + (gGy * gGy)));
            aXY = pixels.data[((row * (width * 4)) + (col * 4)) + 3];

            tmpPixels.push(rXY, bXY, gXY, aXY);
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