const $canvas = document.querySelector("canvas");
const $container = document.querySelector(".container");
const $scoreboard = document.querySelector(".scoreboard");
const ctx = $canvas.getContext("2d");
const $lifeBar = document.querySelector(".bar");
const $record = document.querySelector(".record-number");
const $keyBlue = document.querySelector(".blue-buff-amount");
const $keyBlack = document.querySelector(".black-buff-amount");
const $keyOrange = document.querySelector(".orange-buff-amount");
const $sprintBar = document.querySelector(".sprint-bar");

const imgDictionarie = {
  player: "./src/images/39917.png",
  bot: "./src/images/like.png",
  blue: "./src/images/full-screen.png",
  black: "./src/images/runer-silhouette-running-fast.png",
  orange: "./src/images/gold.png",
  dog: "./src/images/dog.png",
  cat: "./src/images/cat.png",
  monkey: "./src/images/monkey.png",
  clown: "./src/images/clown.png",
  pirate: "./src/images/pirate.png",
  lion: "./src/images/lion.png"
};

const frases = {
  0: 'a vida dá dessas as vezes',
  1: 'não desista, pois cavalo não come pipoca',
  2: 'a morte é a ultima esperança que vive na morte',
  3: 'você perdeu pois não ganhou',
  4: 'não precisa sair chorando e escutar fresno, tá?',
  5: 'perder faz parte, bate a bunda no barril',
  6: 'relaxa, é só um joguin, véi',
  7: 'só não vale xingar a mãe',
  8: 'por que o halls preto é branco?',
  9: 'só chora',
  10: 'NA MORAL, MAN. NÃO É POSSÍVEL',
}

const frasesPower = {
  0: 'cê perdeu com poderzinho HAHAHAHA com poderzinho. COMO PODE?',
  1: 'USA O PODER MIGUINHO. SEM OR',
  2: 'marrapaz tem poderzinho pra quê?',
  3: 'HAHAHAHA moscou. Tinha poderizinho',
  4: 'o poder ia encher sua vida mas cê é moscão',
}

const options = [
  {
    name: "dog",
    record: 0
  },
  {
    name: "cat",
    record: 20
  },
  {
    name: "monkey",
    record: 50
  },
  {
    name: "clown",
    record: 100
  },
  {
    name: "pirate",
    record: 150
  },
  {
    name: "lion",
    record: 185
  }
];

let moveLeft,
  moveRight,
  moveDown,
  moveUp = false;

let wallCollideLeft,
  wallCollideRight,
  wallCollideTop,
  wallCollideBottom = false;

let lifeTime = 100;
let atualBuff;

const gameConfig = {
  speedPlayer: 10,
  diminisher: 0.3
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
  color: "red",
  imgSelected: "dog"
};

const buffControl = {
  status: false,
  green: 50,
  black: 0,
  blue: 0,
  orange: 0
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
  buff: {
    blackbuff: 1,
    position: {
      x: undefined,
      y: undefined
    },
    size: {
      width: undefined,
      height: undefined
    },
    color: ""
  }
};

const render = () => {
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
  Block.render({
    position: botBlock.position,
    width: botBlock.size.width,
    height: botBlock.size.height,
    type: "bot"
  });
  Block.render({
    position: playerBlock.position,
    width: playerBlock.size.width,
    height: playerBlock.size.height,
    type: playerBlock.imgSelected
  });
  Block.render({
    position: botBlock.buff.position,
    width: botBlock.buff.size.width,
    height: botBlock.buff.size.height,
    type: botBlock.buff.color
  });
  $record.textContent = document.cookie;
  $keyBlack.textContent = buffControl.black;
  $keyBlue.textContent = buffControl.blue;
  $keyOrange.textContent = buffControl.orange;
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
  if (
    lifeTime - gameConfig.diminisher * parseInt($scoreboard.textContent) <=
    0
  ) {
    lose.build();
    buffControl.black = 0;
    buffControl.blue = 0;
    buffControl.orange = 0;
    return;
  }
  requestAnimationFrame(update, $canvas);
  move();
  render();
  collision();
  reduceLife();
  sprintLife();
  buffCollision();
};

const Block = {
  render: ({ position, width, height, type, positiony, positionx }) => {
    const img = new Image();
    img.src = imgDictionarie[type];
    position
      ? ctx.drawImage(img, position.x, position.y, width, height)
      : ctx.drawImage(img, positionx, positiony, width, height);
  }
};

const collision = () => {
  if (!(playerBlock.position.x + playerBlock.size.width > botBlock.position.x))
    return;
  if (!(playerBlock.position.x - botBlock.size.width < botBlock.position.x))
    return;
  if (!(playerBlock.position.y + playerBlock.size.height > botBlock.position.y))
    return;
  if (!(playerBlock.position.y - botBlock.size.width < botBlock.position.y))
    return;
  positionBot();
  addPunctuation();
  addLife();
  buff();
};

const positionBot = () => {
  const randomNumbery = Math.floor(Math.random() * 550);
  const randomNumberx = Math.floor(Math.random() * 550);

  const configuredPositiony =
    randomNumbery < 20 || randomNumbery > 580
      ? Math.floor(Math.random() * 600)
      : randomNumbery;
  const configuredPositionx =
    randomNumberx < 20 || randomNumberx > 580
      ? Math.floor(Math.random() * 600)
      : randomNumberx;

  botBlock.position.x = configuredPositionx;
  botBlock.position.y = configuredPositiony;
};

const addPunctuation = () => {
  $scoreboard.textContent = parseInt($scoreboard.textContent) + 1;
};

const wallCollision = () => {
  playerBlock.position.x <= 0
    ? (wallCollideLeft = true)
    : (wallCollideLeft = false);
  playerBlock.position.x >= 600 - playerBlock.size.width
    ? (wallCollideRight = true)
    : (wallCollideRight = false);
  playerBlock.position.y <= 0
    ? (wallCollideTop = true)
    : (wallCollideTop = false);
  playerBlock.position.y >= 600 - playerBlock.size.height
    ? (wallCollideBottom = true)
    : (wallCollideBottom = false);
};

const reduceLife = () => {
  lifeTime = lifeTime - botBlock.buff.blackbuff;
  $lifeBar.style.width = `${lifeTime -
    gameConfig.diminisher * parseInt($scoreboard.textContent)}%`;
  $scoreboard.style.transform = `scale(${.4 + lifeTime/100})`
};

const addLife = () => {
  if (lifeTime + 100 > 100) {
    lifeTime = 100;
  } else {
    lifeTime = lifeTime + 100;
  }
};

const lose = {
  build: () => {
    saveRecord();
    const box = document.createElement("div");
    box.classList.add("box-lose");

    const textLose = document.createElement("span");
    textLose.classList.add("text-lose");
    textLose.textContent = (buffControl.blue > 0 || buffControl.black > 0 || buffControl.orange > 0) ? frasesPower[Math.floor(Math.random() * 5)] : frases[Math.floor(Math.random() * 11)];

    const buttonLose = document.createElement("button");
    buttonLose.classList.add("button-lose");
    buttonLose.textContent = "Recomeçar";

    const optionsBox = document.createElement("div");
    optionsBox.classList.add("options-box");

    options.map(option => {
      const imgRecordWrapper = document.createElement("div");
      imgRecordWrapper.classList.add("image-record-wrapper");

      const image = document.createElement("img");
      image.classList.add("img-option");
      image.src = imgDictionarie[option.name];

      const record = document.createElement("span");
      record.classList.add("record-option");
      record.innerHTML = `<img src="./src/images/award.png" class='award-option'> ${option.record}`;

      image.addEventListener("click", () => {
        const atualRecord = parseInt(document.cookie);
        if (atualRecord < option.record) return;
        playerBlock.imgSelected = option.name;
        lose.remove();
      });

      optionsBox.appendChild(imgRecordWrapper);
      imgRecordWrapper.appendChild(image);
      imgRecordWrapper.appendChild(record);
    });

    const credits = document.createElement("div");
    credits.classList.add("credits");

    const gitHub = document.createElement("a");
    gitHub.href = "https://github.com/marcoshenriquemaia";
    gitHub.innerHTML =
      '<img src="./src/images/github-logo.png" class="credits-image"/>';
    gitHub.target = "_blank";

    const linkedin = document.createElement("a");
    linkedin.href = "https://www.linkedin.com/in/marcos-henrique-57a162188/";
    linkedin.innerHTML =
      '<img src="./src/images/linkedin.png" class="credits-image"/>';
    linkedin.target = "_blank";

    $container.appendChild(box);
    $container.appendChild(credits);
    box.appendChild(optionsBox);
    box.appendChild(textLose);
    box.appendChild(buttonLose);
    credits.appendChild(gitHub);
    credits.appendChild(linkedin);

    window.addEventListener("keypress", lose.remove);

    buttonLose.addEventListener("click", () => {
      lose.remove();
    });
  },
  remove: () => {
    reset();
    update();
    const box = document.querySelector(".box-lose");
    const credits = document.querySelector(".credits");
    window.removeEventListener("keypress", lose.remove);
    box.remove();
    credits.remove();
  },
  initiation: () => {
    saveRecord();
    const box = document.createElement("div");
    box.classList.add("box-lose");

    const textLose = document.createElement("span");
    textLose.classList.add("text-lose");
    textLose.textContent = `Aperte ESPAÇO para começar. Controle pelas setinhas`;

    const buttonLose = document.createElement("button");
    buttonLose.classList.add("button-lose");
    buttonLose.textContent = "Começar";

    const optionsBox = document.createElement("div");
    optionsBox.classList.add("options-box");

    options.map(option => {
      const imgRecordWrapper = document.createElement("div");
      imgRecordWrapper.classList.add("image-record-wrapper");

      const image = document.createElement("img");
      image.classList.add("img-option");
      image.src = imgDictionarie[option.name];

      const record = document.createElement("span");
      record.classList.add("record-option");
      record.innerHTML = `<img src="./src/images/award.png" class='award-option'> ${option.record}`;

      image.addEventListener("click", () => {
        const atualRecord = parseInt(document.cookie);
        if (atualRecord < option.record) return;
        playerBlock.imgSelected = option.name;
        lose.remove();
      });

      optionsBox.appendChild(imgRecordWrapper);
      imgRecordWrapper.appendChild(image);
      imgRecordWrapper.appendChild(record);
    });

    const credits = document.createElement("div");
    credits.classList.add("credits");

    const gitHub = document.createElement("a");
    gitHub.href = "https://github.com/marcoshenriquemaia";
    gitHub.innerHTML =
      '<img src="./src/images/github-logo.png" class="credits-image"/>';
    gitHub.target = "_blank";

    const linkedin = document.createElement("a");
    linkedin.href = "https://www.linkedin.com/in/marcos-henrique-57a162188/";
    linkedin.innerHTML =
      '<img src="./src/images/linkedin.png" class="credits-image"/>';
    linkedin.target = "_blank";

    $container.appendChild(box);
    $container.appendChild(credits);
    box.appendChild(optionsBox);
    box.appendChild(textLose);
    box.appendChild(buttonLose);
    credits.appendChild(gitHub);
    credits.appendChild(linkedin);

    window.addEventListener("keypress", lose.remove);

    buttonLose.addEventListener("click", () => {
      lose.remove();
    });
  }
};

const saveRecord = () => {
  const recordValue = parseInt($scoreboard.textContent);
  const record = document.cookie;
  $record.textContent = record;
  if (recordValue > record) {
    document.cookie = recordValue;
  }
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
  $scoreboard.textContent = "0";
  gameConfig.speedPlayer = 10;
  atualBuff = undefined;
  botBlock.buff.position.x = undefined;
  botBlock.buff.position.y = undefined;
  buffControl.black = 0;
  buffControl.blue = 0;
  buffControl.orange = 0;
  buffControl.status = false;
  playerBlock.size.width = 50;
  playerBlock.size.height = 50;
  gameConfig.speedPlayer = 10;
  botBlock.buff.blackbuff = 1;
  atualBuff = undefined;
  buffControl.status = false;
  botBlock.size.width = 20;
  botBlock.size.height = 20;
  buffControl.green = 50;
};

const buff = () => {
  const probability = Math.floor(Math.random() * 100);
  const positionx = Math.floor(Math.random() * 600);
  const positiony = Math.floor(Math.random() * 600);

  const configuredPositionx =
    positionx < 20 || positionx > 580
      ? Math.floor(Math.random() * 600)
      : positionx;
  const configuredPositiony =
    positiony < 20 || positiony > 580
      ? Math.floor(Math.random() * 600)
      : positiony;
  if (atualBuff) return;

  if (probability < 10) {
    botBlock.buff.position.x = configuredPositionx;
    botBlock.buff.position.y = configuredPositiony;
    botBlock.buff.color = "blue";
    botBlock.buff.size.width = 20;
    botBlock.buff.size.height = 20;
    atualBuff = "blue";
  }
  if (probability > 10 && probability < 20) {
    botBlock.buff.position.x = configuredPositionx;
    botBlock.buff.position.y = configuredPositiony;
    botBlock.buff.color = "black";
    botBlock.buff.size.width = 20;
    botBlock.buff.size.height = 20;
    atualBuff = "black";
  }
  if (probability > 20 && probability < 25) {
    botBlock.buff.position.x = configuredPositionx;
    botBlock.buff.position.y = configuredPositiony;
    botBlock.buff.color = "orange";
    botBlock.buff.size.width = 20;
    botBlock.buff.size.height = 20;
    atualBuff = "orange";
  }
};

const buffCollision = () => {
  if (
    !(
      playerBlock.position.x + playerBlock.size.width >
      botBlock.buff.position.x
    )
  )
    return;
  if (
    !(
      playerBlock.position.x - botBlock.buff.size.width <
      botBlock.buff.position.x
    )
  )
    return;
  if (
    !(
      playerBlock.position.y + playerBlock.size.height >
      botBlock.buff.position.y
    )
  )
    return;
  if (
    !(
      playerBlock.position.y - botBlock.buff.size.height <
      botBlock.buff.position.y
    )
  )
    return;
  attributeBuff();
  botBlock.buff.position.x = undefined;
  botBlock.buff.position.y = undefined;
};

const removeBuff = () => {
  playerBlock.size.width = 50;
  playerBlock.size.height = 50;
  gameConfig.speedPlayer = 10;
  botBlock.buff.blackbuff = 1;
  atualBuff = undefined;
  buffControl.status = false;
  botBlock.size.width = 20;
  botBlock.size.height = 20;
};

const attributeBuff = () => {
  if (atualBuff == "blue") {
    buffControl.blue++;
  }
  if (atualBuff == "black") {
    buffControl.black++;
  }
  if (atualBuff == "orange") {
    buffControl.orange++;
  }
};

const buffAtivationQ = e => {
  if (buffControl.status) return;
  if (e.key != "q") return;
  if (buffControl.blue <= 0) return;
  playerBlock.size.width = 300;
  playerBlock.size.height = 300;
  lifeTime = 100;
  atualBuff = "blue";
  buffControl.blue--;
  buffControl.status = true;
  setTimeout(removeBuff, 5000);
};

const buffAtivationW = e => {
  if (buffControl.status) return;
  if (e.key != "w") return;
  if (buffControl.black <= 0) return;
  gameConfig.speedPlayer = 12;
  botBlock.buff.blackbuff = 0.2;
  lifeTime = 100;
  atualBuff = "black";
  buffControl.black--;
  buffControl.status = true;
  setTimeout(removeBuff, 5000);
};

const buffAtivationE = e => {
  if (buffControl.status) return;
  if (e.key != "e") return;
  if (buffControl.orange <= 0) return;
  botBlock.size.width = 100;
  botBlock.size.height = 100;
  atualBuff = "orange";
  buffControl.orange--;
  playerBlock.size.width = 300;
  playerBlock.size.height = 300;
  buffControl.status = true;
  gameConfig.speedPlayer = 20;
  botBlock.buff.blackbuff = 0.2;
  buffControl.status = true;
  setTimeout(removeBuff, 5000);
};

const buffAtivationR = e => {
  if (e.key != "r") return;
  if (buffControl.green <= 0) return;
  gameConfig.speedPlayer = 25;
};

const buffDesativationR = e => {
  if (e.key != "r") return;
  gameConfig.speedPlayer = 10;
};

const sprintLife = () => {
  if (gameConfig.speedPlayer == 25) {
    buffControl.green = buffControl.green - 5;
  } else {
    buffControl.green <= 100 && (buffControl.green = buffControl.green + 0.2);
  }
  if (buffControl.green <= 0) {
    gameConfig.speedPlayer = 10;
  }
  $sprintBar.style.width = `${buffControl.green}%`;
};

window.onload = lose.initiation();

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

window.addEventListener("keydown", e => buffAtivationQ(e));
window.addEventListener("keydown", e => buffAtivationW(e));
window.addEventListener("keydown", e => buffAtivationE(e));
window.addEventListener("keydown", e => buffAtivationR(e));
window.addEventListener("keyup", e => buffDesativationR(e));
