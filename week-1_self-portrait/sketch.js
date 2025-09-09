//self-portrait; september 05, 2025.

//use colours from my website:
let cols = [
  [253, 253, 253], //bg
  [60, 60, 60], //primary
  [120, 120, 120], //secondary
  [240, 240, 240], //tertiary
];

//the size of the world:
let world_width = 800;
let world_height = 800;

//the world is made up of many people:
let people = [];

//they're all of the same size:
const size = 6;

let photograph; //to use picture later.

//to preload the image, through which people get colour:
function preload() {
  photograph = loadImage("/assets/sq_passport-photo.jpg");
}

function setup() {
  //the world is born:
  createCanvas(world_width, world_height);

  //don't need stroke.
  noStroke();
  //get colours from the photograph once:
  get_colours_from_img(photograph);

  //people are born in the world:
  const space = size + 1; // people give each other some space.
  for (let x = 0 + size; x <= world_width - size; x += space) {
    for (let y = 0 + 4; y <= world_height - 4; y += space) {
      // //i also want to push the colours of my image here. so:
      let col = convert_coordinates_to_colour(x, y, photograph);

      // //check and swap white for black.
      if (col[0] == 255 && col[1] == 255 && col[2] == 255) {
        col = [0, 0, 0];
      }

      people.push(new People(x, y, col));
    }
  }
}

//helper function to get colours from an image in 'pixels' array.
function get_colours_from_img(img) {
  img.resize(0, width); //fit the width of the screen.
  image(img, 0, 0); //draw from the top-left.

  img.loadPixels();
  background(cols[0]);
}

//helper function to convert coordinates to colours, as passed down in setup.
function convert_coordinates_to_colour(x, y, img) {
  let index = (y * img.width + x) * 4;

  let r = img.pixels[index];
  let g = img.pixels[index + 1];
  let b = img.pixels[index + 2];
  let a = img.pixels[index + 3];

  return [r, g, b, a];
}

function draw() {
  // background(cols[0]);

  //each person:
  for (var person of people) {
    //exists:
    person.exist();
    //moves:
    person.move();
  }

  //people move to take someone's place, or be in someone's space.
  let moving_person = people[int(random(0, people.length))];
  let static_person = people[int(random(0, people.length))]; //sometimes, the moving and the stationary person are the same. this means you're happy where you are. that's humanely (and probabilistically) rare.

  moving_person.destination_x = static_person.x;
  moving_person.destination_y = static_person.y;
}

class People {
  constructor(x, y, col = [0, 0, 0, 255]) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.col = col;

    //people have temporary destinations:
    // but when they're born, those destinations don't exist.
    this.destination_x = x;
    this.destination_y = y;
  }

  exist() {
    strokeWeight(size);
    stroke(this.col);
    point(this.x, this.y);
  }

  move() {
    this.x = lerp(this.x, this.destination_x, 0.01);
    this.y = lerp(this.y, this.destination_y, 0.01);
  }
}
