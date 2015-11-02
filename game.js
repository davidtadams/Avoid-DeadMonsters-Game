// creating the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// game objects
var hero = {
  speed: 256, //movement in pixels per second
  x: 0,
  y: 0
};

var monster = {
  x: 0,
  y: 0
};

var monstersCaught = 0;

// handle keyboad controls
var keysDown = {};

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
  delete keysDown[e.keyCode];
}, false);

// reset game when player catches a monster
var reset = function() {
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;

  // place monster randomly on the screen
  monster.x = 32 + (Math.random() * (canvas.width - 64));
  monster.y = 32 + (Math.random() * (canvas.height - 64));
}

// update game objects
var update = function(modifier) {
  if (38 in keysDown) {
    //player is holding up
    hero.y -= hero.speed * modifier;
  }
  if (40 in keysDown) {
    //player holding down
    hero.y += hero.speed * modifier;
  }
  if (37 in keysDown) {
    //player holding left
    hero.x -= hero.speed * modifier;
  }
  if (39 in keysDown) {
    //player holding right
    hero.x += hero.speed * modifier;
  }

  // are the monster and hero touching?
  if (
    hero.x <= (monster.x + 32)
    && monster.x <= (hero.x + 32)
    && hero.y <= (monster.y + 32)
    && monster.y <= (hero.y + 32)
  ) {
    ++monstersCaught;
    reset();
  }
}

// draw everything
var render = function() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }

  if (heroReady) {
    ctx.drawImage(heroImage, hero.x, hero.y);
  }

  if (monsterReady) {
    ctx.drawImage(monsterImage, monster.x, monster.y);
  }

  // score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Monsters caught: " + monstersCaught, 32, 32);
};

// main game loop
var main = function() {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  render();

  then = now;

  //request again
  requestAnimationFrame(main);
}

// play game now
var then = Date.now();
reset();
main();
