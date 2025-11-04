let cam;

let gap = 4;

let cols = [];

let movement = 0;

function setup() {
  createCanvas(100,100, WEBGL);  //somehow i have to create a dummy-canvas first to be able to rotate in 3-dimensional space (otherwise rotateY wasn't working). 
  cam = createCapture(VIDEO, canv_to_asp);
  cam.hide();

  pixelDensity(1);

  background(0);

  colorMode (HSB); 
}

//helper to make canvas based on camera input.
function canv_to_asp() {
  let asp_ratio = cam.height / cam.width;

  let wh = windowWidth * asp_ratio;

  createCanvas(windowWidth, wh, WEBGL);
}

const randomness_range = 10;

function draw() {
  // background (0); 
  cam.loadPixels();

  movement = sin(frameCount * 0.05);

  rotateZ (frameCount*0.03); 

  // rotate(movement);

  for (let x = 0; x <= cam.width; x += gap) {
    for (let y = 0; y <= cam.height; y += gap) {
      let i = get_pixel_index(x, y);
      let c = color(cam.pixels[i], cam.pixels[i + 1], cam.pixels[i + 2], cam.pixels[i + 3]); //get a colour object here.

      //get hue, sat, brightness for same pixel: 
      let h = hue(c); 
      let s = saturation(c); 
      let b = brightness(c); 

      //keep shifting hue:
      let new_h = constrain(map(h + movement, 0, 360, 0, 360), 0, 360);


      //get all values:


      stroke(new_h, s ,b); //colour it with what the thing actually is.

      let z_min = map(movement, 0, 1, -height/2, height/2);
      let z_max = map(movement, 0, 1, height/2, -height/2);

      let z = map(hue(c), 0, 360, z_min, z_max);
      push();
      translate(-cam.width / 2, -cam.height / 2, z+random(-randomness_range, randomness_range));
      strokeWeight(gap/2);
      point(x, y);

      pop();
    }
  }
}

//helper to get index of pixel array from x, y coordinate.
function get_pixel_index(x, y) {
  return (y * cam.width + x) * 4;
}
