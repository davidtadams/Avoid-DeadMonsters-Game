// creating the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// set up background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = "assets/background.png";

// set up hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function() {
  heroReady = true;
};
heroImage.src = "assets/hero.png";

// set up monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function() {
  monsterReady = true;
};
monsterImage.src = "assets/monster.png";

// set up monster2 image
var deadMonsterReady = false;
var deadMonsterImage = new Image();
deadMonsterImage.onload = function() {
  deadMonsterReady = true;
};
deadMonsterImage.src = "assets/deadMonster.png";

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

var deadMonsters = [];
function DeadMonster(){
  this.x = 32 + (Math.random() * (canvas.width - 96));
  this.y = 32 + (Math.random() * (canvas.height - 96));
}

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
  // place monster randomly on the screen
  monster.x = 32 + (Math.random() * (canvas.width - 96));
  monster.y = 32 + (Math.random() * (canvas.height - 96));

  // add a dead monster
  deadMonsters.push(new DeadMonster());
}

// update game objects
var update = function(modifier) {
  if (38 in keysDown && hero.y > 32) {
    //player is holding up
    hero.y -= hero.speed * modifier;
  }
  if (40 in keysDown && hero.y < canvas.height - 64) {
    //player holding down
    hero.y += hero.speed * modifier;
  }
  if (37 in keysDown && hero.x > 32) {
    //player holding left
    hero.x -= hero.speed * modifier;
  }
  if (39 in keysDown && hero.x < canvas.width - 64) {
    //player holding right
    hero.x += hero.speed * modifier;
  }

  // are the monster and hero touching?
  if (
    hero.x <= (monster.x + 32)
    && hero.y <= (monster.y + 32)
    && monster.x <= (hero.x + 32)
    && monster.y <= (hero.y + 32)
  ) {
    monstersCaught++;
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

  if (deadMonsterReady) {
    for (var i in deadMonsters) {
      ctx.drawImage(deadMonsterImage, deadMonsters[i].x, deadMonsters[i].y);
    }
  }



  // score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Monsters caught: " + monstersCaught, 32, 0);
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
// Start hero in the middle
hero.x = canvas.width / 2;
hero.y = canvas.height / 2;
reset();
main();
