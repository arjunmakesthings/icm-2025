//relationships; with maythana (may); 22 september, 2025.

/*
the ask is make a program that uses conditional statements, and asks people to make difficult choices that have surprising consequences. 

may had an idea of showing how it's a difficult choice to go to college (because you lose money), versus stay in the job that you're in (make the same, and, eventually, more money). but the consequences are surprising — you're initially more happy in college (you get to do the thing you want to do), and then make more money once you graduate (because you're more 'skilled'). 
*/

/*
this is now quick writing by arjun to define the structure of the program. 

there is a canvas. a person has 3 choices: 
- stay where you are, and stagnate (center). 
- go to college (left), stay with your job (right). 
    -   go to college (left) means you: 
        - lose money
        - increase happiness 
        - after a certain amount of time, make more money. 
    - stay in job (right) means that you: 
        - let the money you have remain
        - lose happiness
        - eventually get a little more money. 
*/

//javascript does not have enum support. so, i'll stick with passing a string.

let stage = "nothing"; //when the sketch starts, the person hasn't done anything.

//there are only two other objects in the sketch: money & happiness.
let money = [];
let happiness = [];
let panels = [];

let t_size = 36; //change font size from here.

let time;

let speed = 50;

function setup() {
  createCanvas(windowWidth, windowHeight); //make canvas open to whatever size you give the window.
  textSize(t_size); //set default text size.
  textAlign(CENTER, CENTER);

  noStroke();
  noFill();

  //create panels:
  panels[0] = new Panel(0, 0, "go to college");
  panels[1] = new Panel(width * (2 / 3), 0, "stay in corporate america");

  //create money & happiness:
  for (let x = width / 3 + t_size; x <= width / 3 + width / 3; x += t_size * 2) {
    for (let y = 0 + t_size * 2; y <= height - t_size * 2; y += t_size * 2) {
      var n = random(0, 1);

      if (n < 0.5) {
        money.push(new Money(x, y));
      } else {
        happiness.push(new Happiness(x, y));
      }
    }
  }
}

function draw() {
  background(0);

  //calculate time:
  time = int(millis() / 60); //get time and convert to seconds.

  for (let panel of panels) {
    panel.display();
  }

  //display text:
  //   fill(255);
  //   noStroke();
  //   textSize(t_size / 1.5);
  //   text("go to college", (width / 3) * 0.5, height * 0.75);
  //   text("stay in corporate america", width * (2 / 3) + (0.5 * width) / 3, height * 0.75);

  //display objects:
  for (let items of money) {
    items.display();
    items.move();
  }
  for (let items of happiness) {
    items.display();
    items.move();
  }

  //check and do things:

  //if mouse is on canvas:
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    //check where the mouse is:
    if (mouseX > 0 && mouseX < width / 3) {
      for (let i = 0; i < panels.length; i++) {
        panels[i].c = 0;
        panels[i].tc = 255;
      }
      //it's on panel 1 (college):
      panels[0].c = 255;
      panels[0].tc = 0;
      stage = "going to college";
    } else if (mouseX > width / 3 && mouseX < width / 3 + width / 3) {
      for (let i = 0; i < panels.length; i++) {
        panels[i].c = 0;
        panels[i].tc = 255;
      }
      //it's on panel 2 (center):
      stage = "staying in center";
    } else {
      for (let i = 0; i < panels.length; i++) {
        panels[i].c = 0;
        panels[i].tc = 255;
      }
      //it's on panel 3 (job):
      panels[1].c = 255;
      panels[1].tc = 0;
      stage = "choosing job";
    }
  }

  hover_stuff();
}

function hover_stuff() {
  //we'll do everything with time.
  if (stage == "going to college") {
    if (time % 10 == 0) {
      let n = int(random(0, money.length));

      if (n < happiness.length && n < money.length) {
        money[n].dest_x = width;
        happiness[n].dest_x = happiness[n].origin_x;
      }
    }
  } else if (stage == "staying in center") {
  } else if (stage == "choosing job") {
    if (time % 10 == 0) {
      let n = int(random(0, happiness.length));
      if (n < happiness.length && n < money.length) {
        happiness[n].dest_x = 0;
        money[n].dest_x = money[n].origin_x;
      }
    }
  }
}

class Money {
  constructor(x, y) {
    //positions are set when the creation of this object is called.
    this.x = x;
    this.y = y;

    this.origin_x = x;
    this.origin_y = y;
    this.dest_x = x;
    this.dest_y = y;

    this.t = random(["💵", "💷", "💰"]); //change these to have more variety for money (insert emoticons with "").
    this.s = t_size;
  }
  display() {
    // fontSize (this.s);
    text(this.t, this.x, this.y);
  }
  move() {
    //complicated movement is below:
    // if (movement == 0) {
    //   //go left.
    //   this.x--;
    // } else if (movement == 1) {
    //   //go up.
    // } else if (movement == 2) {
    // }

    //let's keep it simple:
    this.x = lerp(this.x, this.dest_x, 0.05);
  }
}

class Happiness {
  constructor(x, y) {
    //positions are set when the creation of this object is called.
    this.x = x;
    this.y = y;

    this.origin_x = x;
    this.origin_y = y;
    this.dest_x = x;
    this.dest_y = y;

    this.t = random(["😄", "🤗", "😌", "🕺🏽"]); //change these to have more variety for happiness (insert emoticons with "").
    this.s = t_size;
  }
  display() {
    // fontSize (this.s);
    text(this.t, this.x, this.y);
  }
  move() {
    //complicated movement is below:
    // if (movement == 0) {
    //   //go left.
    //   this.x--;
    // } else if (movement == 1) {
    //   //go up.
    // } else if (movement == 2) {
    // }

    //let's keep it simple:
    this.x = lerp(this.x, this.dest_x, 0.05);
  }
}

class Panel {
  constructor(x, y, text_inside) {
    this.x = x;
    this.y = y;
    this.c = 0;
    this.tc = 255;
    this.text_inside = text_inside;
  }
  display() {
    //display panels:
    fill(this.c);
    //   strokeWeight (3);
    //   stroke (255);
    rect(this.x, this.y, width / 3, height);

    noStroke();
    textSize(t_size / 1.5);
    fill(this.tc);
    text(this.text_inside, this.x + width / 3 / 2, this.y + height * 0.75);
  }
}
