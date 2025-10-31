//pixels ; october 31st, 2025.

let cam;

let rs = [];
let gs = [];
let bs = [];
let as = [];

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

  loadPixels();

  //get rgb values:
  for (let x = 0; x < width; x += pixelation) {
    for (let y = 0; y < height; y += pixelation) {
      let i = get_pixel_index(x, y);

      //push rgb values: 
      rs.push(pixels[i]);
      gs.push(pixels[i + 1]);
      bs.push(pixels[i + 2]);
      bs.push(pixels[i + 3]);
    }
  }
  pop();

  //apply another transformation to draw the rgb values:
  background(0);

  let index = 0;
  for (let x = 0; x < width; x += 10) {
    for (let y = 0; y < height; y += 10) {
      fill(255);
      textSize(8);
      text(values[index], x, y);
      index++;
    }
  }
  values = [];
}

function get_pixel_index(x, y) {
  return (y * width + x) * 4;
}
