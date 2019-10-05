const $canvas = document.querySelector("canvas");
const $container = document.querySelector(".container");
const $scoreboard = document.querySelector(".scoreboard");
const ctx = $canvas.getContext("2d");
const $lifeBar = document.querySelector(".bar");

let moveLeft,
  moveRight,
  moveDown,
  moveUp = false;

let wallCollideLeft,
  wallCollideRight,
  wallCollideTop,
  wallCollideBottom = false;

let lifeTime = 100;

const gameConfig = {
  speedPlayer: 10,
  diminisher: 1.1
};

const playerBlock = {
  position: {
    x: 10,
    y: 10
  },
  size: {
    width: 50,
    height: 50
  },
  color: "red"
};

const botBlock = {
  position: {
    x: $canvas.width / 2,
    y: $canvas.height / 2
  },
  size: {
    width: 20,
    height: 20
  },
  color: "green"
};

const render = () => {
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
  Block.render({
    position: botBlock.position,
    width: botBlock.size.width,
    height: botBlock.size.height,
    color: botBlock.color
  });
  Block.render({
    position: playerBlock.position,
    width: playerBlock.size.width,
    height: playerBlock.size.height,
    color: playerBlock.color
  });
};

const move = () => {
  wallCollision();
  moveLeft &&
    !wallCollideLeft &&
    (playerBlock.position.x = playerBlock.position.x - gameConfig.speedPlayer);
  moveRight &&
    !wallCollideRight &&
    (playerBlock.position.x = playerBlock.position.x + gameConfig.speedPlayer);
  moveUp &&
    !wallCollideTop &&
    (playerBlock.position.y = playerBlock.position.y - gameConfig.speedPlayer);
  moveDown &&
    !wallCollideBottom &&
    (playerBlock.position.y = playerBlock.position.y + gameConfig.speedPlayer);
};

const update = () => {
  if (lifeTime - (gameConfig.diminisher * parseInt($scoreboard.textContent)) <= 0) return;
  requestAnimationFrame(update, $canvas);
  move();
  render();
  collision();
  reduceLife();
};

const Block = {
  render: ({ position, width, height, color }) => {
    ctx.fillStyle = color;
    ctx.fillRect(position.x, position.y, width, height);
  }
};

const collision = () => {
  if (!(playerBlock.position.x + playerBlock.size.width > botBlock.position.x))
    return;
  if (
    !(
      playerBlock.position.x - playerBlock.size.width + 20 <
      botBlock.position.x
    )
  )
    return;
  if (!(playerBlock.position.y + playerBlock.size.height > botBlock.position.y))
    return;
  if (
    !(
      playerBlock.position.y - playerBlock.size.height + 20 <
      botBlock.position.y
    )
  )
    return;
  positionBot();
  addPunctuation();
  addLife();
};

const positionBot = () => {
  const randomNumbery = Math.floor(Math.random() * 580);
  const randomNumberx = Math.floor(Math.random() * 580);
  botBlock.position.x = randomNumberx;
  botBlock.position.y = randomNumbery;
};

const addPunctuation = () => {
  $scoreboard.textContent = parseInt($scoreboard.textContent) + 1;
};

const wallCollision = () => {
  playerBlock.position.x == 0
    ? (wallCollideLeft = true)
    : (wallCollideLeft = false);
  playerBlock.position.x == 550
    ? (wallCollideRight = true)
    : (wallCollideRight = false);
  playerBlock.position.y == 0
    ? (wallCollideTop = true)
    : (wallCollideTop = false);
  playerBlock.position.y == 550
    ? (wallCollideBottom = true)
    : (wallCollideBottom = false);
};

const numberRecude = gameConfig.diminisher * parseInt($scoreboard.textContent);

const reduceLife = () => {
  lifeTime--;
  $lifeBar.style.width = `${lifeTime - (gameConfig.diminisher * parseInt($scoreboard.textContent))}%`;
  console.log(numberRecude);
};

const addLife = () => {
  if (lifeTime + 100 > 100) {
    lifeTime = 100;
  } else {
    lifeTime = lifeTime + 100;
  }
};

const lose = () => {
  const box = document.createElement("div");
  box.classList.add("box-lose");

  const textLose = document.createElement("span");
  textLose.classList.add("text-lose");
  textLose.textContent = "VOCÊ PERDEU HAHAHAHAHAHA";

  const buttonLose = document.createElement("button");
  buttonLose.classList.add("button-lose");
  buttonLose.textContent = "Recomeçar";

  $container.appendChild(box);
  q;
  box.appendChild(textLose);
  box.appendChild(buttonLose);
};

const reset = () => {
  moveLeft, moveRight, moveDown, (moveUp = false);
  wallCollideLeft,
    wallCollideRight,
    wallCollideTop,
    (wallCollideBottom = false);
  playerBlock.position.x = 10;
  playerBlock.position.y = 10;
  (botBlock.position.x = $canvas.width / 2),
    (botBlock.position.y = $canvas.height / 2);
  lifeTime = 100;
};

update();

window.addEventListener("keydown", ({ key }) => {
  if (key == "ArrowLeft" && !moveRight) {
    moveLeft = true;
  }
  if (key == "ArrowRight" && !moveLeft) {
    moveRight = true;
  }
  if (key == "ArrowUp" && !moveDown) {
    moveUp = true;
  }
  if (key == "ArrowDown" && !moveUp) {
    moveDown = true;
  }
});

window.addEventListener("keyup", ({ key }) => {
  if (key == "ArrowLeft" && !moveRight) {
    moveLeft = false;
  }
  if (key == "ArrowRight" && !moveLeft) {
    moveRight = false;
  }
  if (key == "ArrowUp" && !moveDown) {
    moveUp = false;
  }
  if (key == "ArrowDown" && !moveUp) {
    moveDown = false;
  }
});
