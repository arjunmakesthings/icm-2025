//pixels; arjun & elisa. november 4th, 2025.

/*
ask: 
Manipulate an image or video at the pixel level* to create an alternative reality to the one depicted in the original image. No sound. The image should change over the course of the minute. What is revealed? What is lost? Use the properties of color to focus our attention.
*/

/*
thought(s): 
we had words to unite the two of us, in our interpretation of the brief: 
  for elisa: 
  - alternate reality
  - mutation
  - different from original (via colour, scale, rotation)
  - something with colour (because that is less 'depressing')
  - parallel universe
  - 'dislocated' reality.

  for arjun: 
    - difference (between how a computer sees & how a human sees)
*/

let cam;
let mic;

let gap = 4; //i look at pixel values for each pixel. this sets the gap between them.

let movement = 0; //define an empty variable & change its value over time later.

function setup() {
  createCanvas(100, 100, WEBGL); //somehow i have to create a dummy-canvas first to be able to rotate in 3-dimensional space (otherwise rotateY wasn't working).
  cam = createCapture(VIDEO, { flipped: true }, canv_to_asp); //by default, we get flipped video. mimi showed me this.
  cam.hide();

  pixelDensity(1); //lowering this also gives something cool.

  colorMode(HSB);

  //to get audio:
  mic = new p5.AudioIn();
  mic.start();

  background(0);
}

//helper to make canvas based on camera-input-size (same aspect ratio).
function canv_to_asp() {
  let asp_ratio = cam.height / cam.width;

  let wh = windowWidth * asp_ratio;

  createCanvas(windowWidth, wh, WEBGL);
}

// const randomness_range = 20; //we aren't using this as of right now. but, this is good to break the predictability. right now, there's too much going on.

function draw() {
  //elisa's background attempts. i couldn't find a way to include them:
  // background (0);
  //background((frameCount * 0.5) % 360, 100, 100);
  //background((frameCount * 0.5) % 360, 80, 40, 0.2);

  let vol = mic.getLevel() * 10; //elisa added this. this gives us mic input. change the multiplication to whatever fetches breathing levels (to then use for manipulation later).
  // console.log(vol); //see how much noise is in the room & adjust multiplication post.

  movement = sin(frameCount * 0.05) + vol * 10; //this is what we use for consistent movement.
  // console.log(movement); //to check movement. it returns a value between -1,1.

  cam.loadPixels();

  //   rotateZ (frameCount*0.03);
  // rotateZ(frameCount * 0.03 + vol);
  // rotate(movement);

  for (let x = 0; x <= cam.width; x += gap) {
    for (let y = 0; y <= cam.height; y += gap) {
      //iterate through every single pixel of the camera (with the gap).

      let i = get_pixel_index(x, y);
      let c = color(cam.pixels[i], cam.pixels[i + 1], cam.pixels[i + 2], cam.pixels[i + 3]); //get a colour object here. this is returned as rgb; i believe.

      //get hue, sat, brightness for same pixel :
      let h = hue(c);
      let s = saturation(c);
      let b = brightness(c);

      //keep shifting hue:
      let new_h = constrain(map(h * movement * 0.5, 0, 360, 0, 360), 0, 360); //i also want the colour to map slower than z-rotation, otherwise it looks like they're coupled together.

      // new_h = (new_h + frameCount * 0.3) % 360; //this was elisa's line. i added h * movement above by looking at this. we both want the colour to keep shifting; so we get that here.

      stroke(new_h, s, b); //colour it with what the thing actually is.

      let z_min = map(movement, -1, 1, -height * 2, height * 2);
      let z_max = map(movement, -1, 1, height * 2, -height * 2);

      let z = map(hue(c), 0, 360, z_min, z_max);

      // z -= vol; //elisa added this. however, i moved this change to movement. that way, the colour changes when noise is generated.

      push();
      translate(-cam.width / 2, -cam.height / 2, z);

      strokeWeight(gap / 2);
      point(x, y);

      pop();
    }
  }
}

//helper to get index of pixel array from x, y coordinate.
function get_pixel_index(x, y) {
  return (y * cam.width + x) * 4;
}
