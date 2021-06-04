const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo() {
    // function gets data from users camera and play it in video element:
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
    // this code captures the data from streamed video and filter it through provided function which is executed in interval
    // then the output is returned in canvas element
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.height = height;
    canvas.width = width;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height);
        pixels = imageEdges(pixels);
        ctx.putImageData(pixels, 0, 0);
    }, 15);
}

function imageEdges(pixels) {
    // set variables to handle with computed values:
    let tmpPixels = [];
    let returnedImageData;
    let width = pixels.width;
    let height = pixels.height;
    // this set of arrays is responsible to compute Canny's edge algorithm:
    let Gx = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    let Gy = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
    // because the alpha value is same for each pixel is set as constant:
    const aXY = 255;
    // auxiliary variable to store the total value of all RBG numbers from the previous calculation:
    let prevPixelsRBG;

    // start performance timer to begin computation time:
    //console.time('set of pixels');

    // iterate through each pixel in the provided ImageData as 'pixels'
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            // variables to store red, green and blue value from the pixel accordingly:
            let r, g, b;

            // variables used to compute new value of provided pixel:
            let rGx = 0, bGx = 0, gGx = 0, rGy = 0, bGy = 0, gGy = 0;
            let rXY = 0, bXY = 0, gXY = 0;

            // set of reminders to store the current pixel red, blue and green values:
            let reminderR = (pixels.data[(((row) * (width * 4)) + ((col)* 4)) + 0]);
            let reminderB = (pixels.data[(((row) * (width * 4)) + ((col)* 4)) + 1]);
            let reminderG = (pixels.data[(((row) * (width * 4)) + ((col)* 4)) + 2]);

            // this variable is used to compare current total value of RBG with the previous one:
            let currPixelsRGB = reminderR + reminderB + reminderG;

            // and here is very important statement to optimize time of calculations;
            // without this statement the average time of calculating the new value of the pixel takes
            // more than 700 ms, which is lagging the outputed image;
            // thus before each calculation the program checks if the diffirence between current pixel RBG and previous pixel RBG
            // is greater than 10 (it can be of course another number, but 10 gives us nice balance between performance and a result),
            // if this discrepancy is lesser, then program takes the lastly used values from quite demanding calculation and put it as the // current value of pixel simply ommiting the below code:
            if (Math.abs(prevPixelsRBG - currPixelsRGB) > 10) {
                // iterate over all sourrounding pixels (one row up and down, one column back and fort):
                for (let k = -1; k <= 1; k++) {
                    for (let l = -1; l <= 1; l++) {
                        // checks if the pixels are not outside the image
                        if (col + k < width && col + k > -1 && row + l < height && row + l > -1) {
                            // takes value of red, blue and green for neighbouring pixel:
                            r = (pixels.data[(((row + k) * (width * 4)) + ((col + l)* 4)) + 0]);
                            b = (pixels.data[(((row + k) * (width * 4)) + ((col + l)* 4)) + 1]);
                            g = (pixels.data[(((row + k) * (width * 4)) + ((col + l)* 4)) + 2]);

                            // calculate new values for rows and colummns, each color accordingly:
                            rGx += r * Gx[k + 1][l + 1];
                            bGx += b * Gx[k + 1][l + 1];
                            gGx += g * Gx[k + 1][l + 1];

                            rGy += r * Gy[k + 1][l + 1];
                            bGy += b * Gy[k + 1][l + 1];
                            gGy += g * Gy[k + 1][l + 1];

                        }
                    }
                }
                // calculate new value for the current pixel:
                rXY = ~~(Math.sqrt((rGx * rGx) + (rGy * rGy)));
                bXY = ~~(Math.sqrt((bGx * bGx) + (bGy * bGy)));
                gXY = ~~(Math.sqrt((gGx * gGx) + (gGy * gGy)));
            }

            // temporary array takes the new set of pixels: red, blue, green and alpha:
            tmpPixels.push(rXY, bXY, gXY, aXY);
            // make sure that we update the prevPixelsRBG value to avoid later demanding calculations:
            prevPixelsRBG = currPixelsRGB;

        }
    }

    // after looping over all pixels we change array into special array to store rbga values:
    tmpPixels = Uint8ClampedArray.from(tmpPixels);

    // we will return new ImageDate:
    returnedImageData = new ImageData(tmpPixels, width, height);

    // end of all calculations:
    //console.timeEnd('set of pixels');

    return returnedImageData;
}

// another function to filter image, but is not implemented yet:
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