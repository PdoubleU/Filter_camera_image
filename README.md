# Filter video from your webcam: edge detection

![GitHub Logo](/images/app_demo.bmp)


[Lets go to live preview](https://pdoubleu.github.io/Filter_camera_image/)

Remember to allow this app for webcam access, otherwise it is useless.

## About idea:

I came across of idea of this application when I was exercising my Java Script skills in a set of tutorials called JavaScript30 by Wes Bos. One tutorial was teaching how to handle video stream from webcam, filter it and render in a canvas element. In the tutorial few simple filters were set up like blur or RBGA manipulation. The author of the tutorial encouraged to make some fancy filter at own. And one year ago I wrote simple code in C to handle images in a very similar way: filtering using different algorithms. One of the hardest was an edge detection. I decided to implement my code from C into JavaScript. But there is a one big difference between computation for one image and computation for multiple images within milliseconds - time needed for calculations. My first implementation was not what I expected. The algorithm for calculation edges is very demanding, it was taking almost one second to calculate one set of pixels - so you can imagine the delay of the rendered image. To work fine, the program required to calculate each captured image in 20 ms intervals, which is quite acceptable for the user's perception. To solve this problem, I inspired myself by game development approach. Here is my inspiration:

[You can learn about the Q_rsqrt algorithm from Quake III and how it was designed to approximate the values of vectors: ](https://www.youtube.com/watch?v=p8u_k2LIZyo&t=310s)

Of course, my solution is not so smart and complicated as implementation in the above algorithm. I just used the general concept of approximation to make fewer calculations. After a few tests I found a compromise between performance and result. The time for calculation of each image decreased from over 800 ms to less than 200 ms, so I reached 4 times better performance.

## How to use
> Just open the live preview link (at the beginning of this document) and allow this app for access to a webcam.
> You will see filtered video in the center of the screen and original image in the right top corner.
> Have fun and make a FB or Instagram selfie picture, as the program works well on mobile devices.

## Used technologies:

I have used the following technologies:

    1. Java Script
    2. HTML
    3. CSS

## Used tools:

The followed tools were used to finalize the project:

    1. Visual Studio Code
    2. GIT - as a control version system
    3. Stackoverflow and youtube videos - to find inspiration to solve the performance issues.
