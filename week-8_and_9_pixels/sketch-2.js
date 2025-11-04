let cam;

let gap = 4;

let cols = []; 

function setup() {
  cam = createCapture(VIDEO, canv_to_asp);
  cam.hide();

  pixelDensity(1);
  noStroke();
}

function canv_to_asp() {
  let asp_ratio = cam.height / cam.width;

  let wh = windowWidth * asp_ratio;

  createCanvas(windowWidth, wh, WEBGL);
}

function draw() {
  // background(0);

  cam.loadPixels();

  // push();
  // translate(-cam.width / 2, -cam.height / 2, 0);
  // image (cam, 0,0); //for debug; video layer.
  // pop();

  for (let x = 0; x <= cam.width; x += gap) {
    for (let y = 0; y <= cam.height; y += gap) {
      let i = get_pixel_index(x, y);
      let c = color(cam.pixels[i], cam.pixels[i + 1], cam.pixels[i + 2], cam.pixels[i + 3]);
      
      noStroke();
      fill(c); //colour it with what the thing actually is. 
      
      let z = map(hue(c), 0, 360, 0, width);
      push();
      translate(-cam.width / 2, -cam.height / 2, z);
      rect(x, y, gap, gap );
      pop();
    }
  }

  cols = []; //clear cols array.
}

//helper to get index of pixel array from x, y coordinate.
function get_pixel_index(x, y) {
  return (y * cam.width + x) * 4;
}
