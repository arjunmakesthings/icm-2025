//name; date.

/* ask: 
Our ability to see patterns is what makes us human. However we also see patterns where none exist because our brains are biased towards detecting certain kinds of patterns over others (e.g. faces). Create a pattern by making something with a lot of repetition.

...

Try creating an algorithmic design with simple parameters. 
*/

/*thought:
i spent a lot of time in the last week explaining for loops to many people who encountered it in the arduino labs. it wasn't introduced as a programming concept before they encountered it, and, hence, they struggled. 

i remember referring a lot of them to 'deprocess', by ben fry: https://www.benfry.com/deprocess/ — to see how pretty repetitions are. i wanted to do something similar — something that explains what a for loop is, live. 
*/

/*
i'm goingt to build a simple particle system that shows a pseudo (or real) for loop, and people can see each iteration of it happen live. 
*/

let line_num = 0; //we're going to have to keep track of the line being run.

//i don't want to change the frameRate for the program, to ensure that a smooth animation plays out.

let margin = 50;
let row_height = 50;
let padding = 10;

let usable_width, usable_height;

let grey_col = 230;

let display_text = `for (let i = 0; i<10; i++){
make_new_ball_with_number[i];
}`;

let font_size = 16;

let y_posis = []; //array for y positions of everything (since everything is in the same line);

let display_text_lines = 3;

function setup() {
  createCanvas(800, 800);

  usable_width = width - margin;
  usable_height = height - margin;

  //reset defaults.
  noStroke();
  noFill();

  //set the y positions for everything.
  for (let y = margin * 3; y <= usable_height; y += usable_height / display_text_lines) {
    y_posis.push(y);
  }
}

function draw() {
  background(255);

  interface();
}

function interface() {
  //the interface has rows.
  let line_num_show = 0;

  //use y_posis to draw lines and write line numbers.
  for (let y = 0; y <= y_posis.length; y++) {
    noStroke();
    noFill();

    rect(margin, y_posis[y], usable_width, row_height);
    fill(grey_col);
    line_num_show++;
    text(line_num_show, margin, y_posis[y]);

    strokeWeight(1);
    stroke(grey_col);
    line(margin, y_posis[y] + padding, usable_width, y_posis[y] + padding);
  }

  //text:
  noStroke();
  fill(0);
  text(`for (let i = 0; i<10; i++) {`, margin + font_size, y_posis[0]);
  text(`make_new_ball_with_number[i];`, margin + font_size, y_posis[1]);
  text(` };`, margin + font_size, y_posis[2]);

  //blinker:
  
}

function balls(reps, line_number){


}

class Ball {
  constructor(x,y){
    this.x = x; 
    this.y = y; 
  }
  display(){

  }
  move(){
    
  }
}