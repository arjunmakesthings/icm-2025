//name; date.

let img;

function preload() {
  img = loadImage("./cat.jpg");
}

function setup() {
  createCanvas(img.width, img.height)
}

function draw() {
    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i +=4) {
      img.pixels[i + 1]++;
    }
    img.updatePixels();
    image(img, 0, 0);
}
