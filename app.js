const $canvas = document.querySelector('canvas');
const ctx = $canvas.getContext('2d');

let moveLeft = false, moveRight = false, moveDown = false, moveUp = false;

const position1 = {
  x: 10,
  y: 10

}

const render = () =>{
  const { x,y  } = position1;
  ctx.clearRect(0,0,$canvas.width,$canvas.height);
  ctx.fillRect(x, y, 50, 50);
}

const move = () =>{
  moveLeft && (position1.x = position1.x - 5);
  moveRight && (position1.x = position1.x + 5);
  moveUp && (position1.y = position1.y - 5);
  moveDown && (position1.y = position1.y + 5);
}

const update = () =>{
  requestAnimationFrame(update, $canvas)
  move();
  render();
}

update();

window.addEventListener('keydown', ({key}) =>{
  if (key == 'ArrowLeft' && !moveRight) {
    moveLeft = true
  }
  if (key == 'ArrowRight' && !moveLeft) {
    moveRight = true
  }
  if (key == 'ArrowUp' && !moveDown) {
    moveUp = true
  }
  if (key == 'ArrowDown' && !moveUp) {
    moveDown = true
  }
})

window.addEventListener('keyup', ({key}) =>{
  if (key == 'ArrowLeft' && !moveRight) {
    moveLeft = false
  }
  if (key == 'ArrowRight' && !moveLeft) {
    moveRight = false
  }
  if (key == 'ArrowUp' && !moveDown) {
    moveUp = false
  }
  if (key == 'ArrowDown' && !moveUp) {
    moveDown = false
  }
})




