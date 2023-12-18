(function(ctx,w,h) {
    const c=ctx.canvas;
    document.body.appendChild(c);
    c.width=w;
    c.height=h;
    let input={};
  document.body.addEventListener('keydown',event=>input[event.key]=true);
    document.body.addEventListener('keyup',event=>input[event.key]=false);
  //*//
    c.style=`position:fixed;
    top:0;left:0;
    width:100vw;height:100vh;
    z-index:-1;
    background-color:#000`;//*/
    c.style.imageRendering='pixelated';
    const { sin, cos, atan2, sqrt, floor, ceil, pow, random, max, sign, PI } = Math;
    const MAPSIZE = 128;
    const WIDTH = 128;
    const HEIGHT = 128;

    const grid = [];
    for (let i = 0; i < MAPSIZE * MAPSIZE; i++) {
        const cell = 1 + floor(random() * 4);
        grid.push(random() < 0.3 ? cell : 0);
    }

// clear path in front of starting position
grid[MAPSIZE / 2 * MAPSIZE + MAPSIZE / 2 + 0] = 0;
grid[MAPSIZE / 2 * MAPSIZE + MAPSIZE / 2 + 1] = 0;
grid[MAPSIZE / 2 * MAPSIZE + MAPSIZE / 2 + 2] = 0;

let state = {
  x: MAPSIZE / 2 + 0.5,
  y: MAPSIZE / 2 + 0.5,
  direction: 0.1,
  grid: grid
};

const getCell = (grid, x, y) => {
  x = floor(x);
  y = floor(y);
  if (x < 0 || MAPSIZE <= x || y < 0 || MAPSIZE <= y) return -1;
  return grid[y * MAPSIZE + x];
};

const fillRect = (x, y, w, h, c) =>{
    ctx.fillStyle=['black','pink','red','purple','green','blue','yellow','orange'][c]||'red';
  ctx.fillRect(floor(x), floor(y), ceil(w), ceil(h));
}


    function u(t){
        const dx = (!!input.ArrowUp-!!input.ArrowDown) * cos(state.direction) * 0.05;
        const dy = (!!input.ArrowDown-!!input.ArrowUp) * sin(state.direction) * 0.05;  
        if (getCell(state.grid, state.x + dx, state.y) <= 0) state.x += dx;
        if (getCell(state.grid, state.x, state.y + dy) <= 0) state.y += dy;
        state.direction += (!!input.ArrowLeft - !!input.ArrowRight) * 0.04;
        state.direction = (state.direction + 2 * PI) % (2 * PI);
        draw(state)
    }





draw = ({ x, y, direction, grid }) => {
  
  // dark outline
  const OUTLINE = true;
  const THICKNESS = 1;

  // perspective
  const FOV = PI / 3;
  const RANGE = 20;
  
  fillRect(0, 64, 128, 64, 0);  // ceiling
  fillRect(0, 0, 128, 64, 5);   // floor
  
  let prevwall = -1;
  let prevheight = -1;
  let prevdist = -1;
  
  // ray casting
  for (let i = 0; i < WIDTH; i++) {
    const angle = direction - FOV / 2 + FOV / WIDTH * i;
    const c = cos(angle);
    const s = -sin(angle);
    let px = x;
    let py = y;
    let wallX = -1;
    let wallY = -1;
    let dist = 0;
    
    while (dist < RANGE) {
      let horX = (c > 0 ? floor(px + 1) : ceil(px - 1)) - px;
      let verY = (s > 0 ? floor(py + 1) : ceil(py - 1)) - py;
      let horY = horX * s / c;
      let verX = verY * c / s;
      let distX = sqrt(horX * horX + horY * horY);
      let distY = sqrt(verX * verX + verY * verY);
      const t = distX < distY;
      px += t ? horX : verX;
      py += t ? horY : verY;
      dist += t ? distX : distY;
      const dx = t ? sign(c) * 0.5 : 0;
      const dy = t ? 0 : sign(s) * 0.5;
      if (getCell(grid, px + dx, py + dy) > 0) {
        wallX = floor(px + dx);
        wallY = floor(py + dy);
      }
      
      if (wallX >= 0 && wallY >= 0) break;
    }
    
    if (dist === 0) dist = RANGE;
    let height = -1;
    let z = -1;
    
    // rendering
    if (wallX >= 0 && wallY >= 0) {
      z = dist * cos(angle - direction);
      height = HEIGHT / z;
      const top = HEIGHT / 2 - height / 2;
      
      const cell = getCell(grid, wallX, wallY);
      if (cell > 0) fillRect(WIDTH - i - 1, top, 1, height, cell);
      
      if (OUTLINE) {
        let w = (1 - z / RANGE) * THICKNESS;
        fillRect(WIDTH - i - 1, top, w, w, 7);
        fillRect(WIDTH - i - 1, top + height, w, w, 7);

        if (prevwall != wallY * MAPSIZE + wallX) {
          const maxheight = max(prevheight, height);
          const maxtop = HEIGHT / 2 - maxheight / 2;
          if (maxheight > height) {
            w = (1 - prevdist / RANGE) * THICKNESS;
          }
          fillRect(WIDTH - i - 1, maxtop, w, maxheight, 7);
        }
      }
    } else if (OUTLINE) {
      if (prevwall != -1) {
        let maxtop = HEIGHT / 2 - prevheight / 2;
        let w = (1 - HEIGHT / prevheight / RANGE) * THICKNESS;
        fillRect(WIDTH - i - 1, maxtop, w, prevheight, 7);
      }
      wallX = -1;
      wallY = 0;
    }

    prevwall = wallY * MAPSIZE + wallX;
    prevheight = height;
    prevdist = z;
  }
};



  let tic=0;
  (function loop(){u(tic);tic+=0.016;requestAnimationFrame(loop);})();
})(document.createElement('canvas').getContext('2d'), 128,128)