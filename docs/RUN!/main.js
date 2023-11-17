title = "RUN!";

description = `Run as far as you can!
`;

characters = [
  `
LLLL
  LL
    LL
    LL
  LL
`,
  `
LLLL
    LL
    LL
    LL
`,
];

const G = {
  WIDTH: 100,
  HEIGHT: 150,
  TIMER_START: 15,
  BOX_SIZE: 7,
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  seed: 8,
  isPlayingBgm: true,
  theme: "pixel"
};

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Player
 */

/**
 * @type { Player }
 */
let crane;

/**
 * @typedef {{
 * pos: Vector
 * color: Color,
 * size: number,
 * }}Box
 */

/**
 * @type { Box[] }
 */
let boxes = [];
/**
 * @type { Color[] }
 */
let possibleColors = ["red", "blue", "yellow"];
let time = -1;
let boxSpawner = null;
let lastTimer = performance.now();
let boxTimer = performance.now();
let timeElapsed = performance.now();
let targetColor = possibleColors[randomInt(0, possibleColors.length)];
let boxSpeed = 0.5;

function update() {
  if (!ticks) {
    time = G.TIMER_START;
    crane = {
      pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.25),
      speed: 1,
    };
  }

  const currentTime = performance.now();
  if (currentTime - lastTimer >= 1000) {
    lastTimer = currentTime;
    subTime();
  }

  if (currentTime - boxTimer >= 1000) {
    boxTimer = currentTime;
    spawnNewBox();
  }

  if (currentTime - timeElapsed >= 2000) {
    timeElapsed = currentTime;
    boxSpeed += 0.02;
  }

  if (time == 0) {
    cleanup();
  }
  // display timer text
  text("Time: " + time, 3, 10, {
    color: "black",
  });
  text("Target: ", 3, 20, {
    color: "black",
  });
  text(targetColor, 50, 20, {
    color: targetColor,
  });

  color("light_black");
  if (input.isPressed) {
    crane.pos.y += 1;
    play("hit");
    char("b", crane.pos.x + 2, crane.pos.y);
    char("b", crane.pos.x - 2, crane.pos.y, {
      mirror: { x: -1 },
    });
  } else {
    crane.pos.y == G.HEIGHT / 4 ? 0 : (crane.pos.y = G.HEIGHT / 4);
    //crane.pos.x += crane.speed;
    char("a", crane.pos.x + 2, crane.pos.y);
    char("a", crane.pos.x - 2, crane.pos.y, {
      mirror: { x: -1 },
    });
  }
  if (crane.pos.y > G.HEIGHT) {
    crane.pos.y == G.HEIGHT / 4 ? 0 : (crane.pos.y = G.HEIGHT / 4);
  }
  line(0, G.HEIGHT / 4 - 5, G.WIDTH, G.HEIGHT / 4 - 5);

  // Checks Collison on boxes here
  remove(boxes, (b) => {
    color(b.color);
    b.pos.x -= boxSpeed;
    const isColliding = box(b.pos, b.size).isColliding.char.b;

    if (isColliding) {
      crane.pos.y == G.HEIGHT / 4 ? 0 : (crane.pos.y = G.HEIGHT / 4);
      spawnNewBox();
      particle(b.pos, 10, 2);
      if (targetColor == b.color) {
        play("coin");
        targetColor = possibleColors[randomInt(0, possibleColors.length)];
        addTime(5);
        addScore(10, b.pos);
      }
      else {
        addTime(-1);
        play("laser");
      }
    }

    return isColliding;
  });
}

// function used to spawn new box of random color and location
function spawnNewBox() {
  let color;
  // 45% chance that the target color is spawned
  if (Math.random() <= 0.45) {
    color = targetColor;
  }
  else {
    color = possibleColors[randomInt(0, possibleColors.length)];
  }
  let box = {
    pos: vec(G.WIDTH + randomInt(10, 30), G.HEIGHT * 0.75),
    color: color,
    size: G.BOX_SIZE,
  };
  boxes.push(box);
}

// helper function - generates random number between min and max (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * max + min);
}

// reset things for gamestart
function cleanup() {
  boxSpeed = 0.5;
  boxes.length = 0;
  clearInterval(boxSpawner);
  end();
}

function subTime() {
  if (time > 0) {
    time -= 1;
  }
}

function addTime(num) {
  time += num;
}
