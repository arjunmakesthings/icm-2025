//pixels ; october 31st, 2025.

let cam;

let rs = [];
let gs = [];
let bs = [];
let aps = [];

let pixelation = 10;

function setup() {
  cam = createCapture(VIDEO, canv_to_asp);
  cam.hide();

  pixelDensity(1);
  noStroke();
}

function canv_to_asp() {
  let asp_ratio = cam.height / cam.width;

  let wh = windowWidth * asp_ratio;

  createCanvas(windowWidth, wh);
}

function draw() {
  background(0);

  push();

  //flip the video:
  scale(-1, 1);
  translate(-width, 0);

  //draw the video:
  image(cam, 0, 0, width, height);

  //get the values:
  loadPixels();

  //draw a black background:

  // background(0);

  let gap = 5;

  //fuck-up the values:
  for (let x = 0; x < width; x += gap) {
    for (let y = 0; y < height; y++) {
      //every 10th pixel horizontally:
      let i = get_pixel_index(x, y);

      //shift those values here & there.
      let n = floor(map(noise(frameCount*0.01), 0, 1));


        let jump = floor(map(noise(frameCount * 10), 0, width));

        let p = get_pixel_index(jump, y); 

      if (n < 0.5) {
        pixels[p] = pixels[i];
        pixels[p+1] = pixels[i-1];
        pixels[p + 2] = pixels[i+2]
        pixels[p + 3] = pixels[i + 3]; 
      } else {

        pixels[p] = pixels[i];
        pixels[p - 1] = pixels[i - 1];
        pixels[p - 2] = pixels[i - 2];
        pixels[p - 3] = pixels[i - 3]; 
      }
    }
  }

  //show the values:
  updatePixels();

  pop();
}

function get_pixel_index(x, y) {
  return (y * width + x) * 4;
}
