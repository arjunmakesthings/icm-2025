//name; date.

function setup() {
  createCanvas(100, 100);

  loadPixels();

  pixelDensity(1); 

  //give random colours to start:

  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = random(0, 255);
    pixels[i + 1] = random(0, 255);
    pixels[i + 2] = random(0, 255);
    pixels[i + 3] = 255;
  }
  updatePixels();
}

function draw() {
  loadPixels();

  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] += 1;
    pixels[i + 1] += 1;
    pixels[i + 2] += 1;
    pixels[i + 3] = 255;
  }

  updatePixels();
}
