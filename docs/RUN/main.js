title = "RUN!";

description = `Run as far 
as you can!
`;

characters = [
  `
 llll
lPllPl
PPPPPP
PPPPPP
PPPPPP
 l  l
`
];

const G = {
  WIDTH: 100,
  HEIGHT: 150,
  SPAWN_INTERVAL: 40,
  MIN_SPEED: 0.5,
  MAX_SPEED: 3,
  CAR_HEIGHT: 7
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  isPlayingBgm: false,
  theme: "pixel"
};

/**
 * @typedef {{
 * pos: Vector,
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * color: Color,
 * length: number,
 * speed: number
 * }} Car
 */

/**
 * @type { Car[] }
 */
let cars = [];
/**
 * @type { Color[] }
 */
let possibleColors = ["red", "blue", "yellow", "green", "purple"];
let currentScore = 0;
let prevScore = 0;
let deltaScore;
let carSpeed = G.MIN_SPEED

function update() {

  if (!ticks) {
    player = {
      pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.75)
    };
    spawnNewCar(carSpeed);
  }
  color("black");
  char("a", player.pos);

  // increases speed of cars based on Score up to a maximum
  currentScore = score;
  deltaScore = currentScore - prevScore;
  if (deltaScore > G.SPAWN_INTERVAL) {
    prevScore = currentScore;
    if (carSpeed < G.MAX_SPEED) {
      carSpeed += 0.1;
    }
    spawnNewCar(carSpeed);
  }

  // Updates car's positions and draws them
  cars.forEach((c) => {
    c.pos.x += c.speed;

    // wraps cars horizontally
    if (c.pos.x < -20) {
      c.pos.x = G.WIDTH + randomInt(10, 20);
    }
    if (c.pos.x > G.WIDTH + 20) {
      c.pos.x = -randomInt(10, 20);
    }

    color(c.color);
    rect(c.pos, c.length, G.CAR_HEIGHT);
  });


  // ends game on collision
  remove(cars, (c) => {
    color(c.color);
    const isColliding = rect(c.pos, c.length, G.CAR_HEIGHT).isColliding.char.a;

    if (isColliding) {
      play("explosion");
      cleanup();
    }

    return isColliding;
  });

  // adds score the further you get and moves the player up
  if (input.isPressed) {
    addScore(1);
    cars.forEach((c) => {
      c.pos.y += 1;
    });
  }
}

// function used to spawn new car of random color
function spawnNewCar(carSpeed) {
  let color;
  color = possibleColors[randomInt(0, possibleColors.length)];
  let side = randomInt(1, 10);
  let car;
  if (side > 5) {
    car = {
      pos: vec((G.WIDTH + randomInt(10, 20)), -10),
      color: color,
      length: randomInt(7, 12),
      speed: carSpeed
    };
  } else {
    car = {
      pos: vec(randomInt(10, 20) * -1, -10),
      color: color,
      length: randomInt(7, 12),
      speed: -carSpeed
    };
  }

  cars.push(car);
}

// helper function - generates random number between min and max (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * max + min);
}

// reset things for gamestart
function cleanup() {
  cars.length = 0;
  currentScore = 0;
  prevScore = 0;
  carSpeed = G.MIN_SPEED;
  end();
}
