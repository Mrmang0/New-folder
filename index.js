const canvas = document.createElement("canvas");
canvas.width = 1024;
canvas.height = 1100;

document.body.appendChild(canvas);

const context = canvas.getContext("2d");
context.strokeStyle = "#ffffff10";
let time = 0;

context.fillStyle = "#000000EE";
const { sin, cos, atan2 } = Math;

const render = () => {
  time += 10;
  requestAnimationFrame(() => {
    draw();
    render();
  });
};

class P_Rect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    context.save();
    context.fillStyle = "#ffffff10";
    context.fillRect(this.x, this.y, this.width, this.height);
    context.restore();
  }

  check(item) {
    item.x;
  }
}

const in_radius = (root, elipse, radius) => {
  return (
    Math.sqrt(
      Math.abs(elipse.x - root.x) ** 2 + Math.abs(elipse.y - root.y) ** 2
    ) < radius
  );
};

class P_Cirle {
  constructor(x, y, width, height, signX = 1, signY = 1, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.signY = signY;
    this.signX = signX;
    this.color = color;
    this.force = 1.1;
  }

  draw() {
    context.save();
    context.strokeStyle = this.color;
    context.beginPath();
    context.ellipse(
      this.x,
      this.y,
      this.width / 2,
      this.height / 2,
      Math.PI / 4,
      0,
      2 * Math.PI
    );
    context.stroke();
    context.closePath();
    context.restore();
  }
  step(box, ellipses) {
    let elipChanged = false;
    let x = this.x;
    let y = this.y;
    let signX = this.signX;
    let signY = this.signY;
    this.color = `hsl(${(this.x + this.y) % 360} ${
      (this.x + this.y) % 100
    }% 50%)`;
    ellipses
      .filter((x) => in_radius(this, x, this.width * 3))
      .forEach((ellipse) => {
        if (ellipse == this) return;
        const diffX = x - ellipse.x;
        const diffY = y - ellipse.y;
        if (in_radius(this, ellipse, this.width)) {
          signX = Math.sign(diffX);
          signY = Math.sign(diffY);
          x += this.force * signX;
          y += this.force * signY;
          elipChanged = true;

          if (this.width >= ellipse.width) {
            items = items.filter((x) => x != ellipse);
            this.width += ellipse.width / 2;
            this.height += ellipse.height / 2;
            this.force *= this.force * 0.9;
          }
        }

        if (
          in_radius(this, ellipse, Math.min(Math.max(this.width * 3, 10), 50))
        ) {
          elipChanged = true;
          if (
            this.width - ellipse.width > 30 &&
            in_radius(this, ellipse, this.width - ellipse.width < 5 ? 10 : 30)
          ) {
            x += -diffX * this.force;
            y += -diffY * this.force;
            this.height += ellipse.height * 0.1;
            this.width += ellipse.width * 0.1;
            ellipse.width = ellipse.width * 0.9;
            ellipse.height = ellipse.height * 0.9;
            ellipse.force += 0.35;
          } else if (
            in_radius(this, ellipse, this.width * 3) &&
            this.width - ellipse.width > 30
          ) {
            ellipse.force += 0.1;
          } else {
            if(this.width > 50){
              this.width *= 0.90
              this.height *= 0.90
            }
            x += (diffX * this.force) / 10;
            y += (diffY * this.force) / 10;
          }
        }
      });

    let boxChanged = false;
    let bx = this.x;
    let by = this.y;
    let bmag = 10;

    if (box.y + box.height <= this.y + this.height / 2) {
      signY = -1;
      y -= atan2(box.y, box.x) * bmag;
      boxChanged = true;
    }
    if (box.y >= y - this.height / 2) {
      signY = 1;
      y += atan2(box.y, box.x) * bmag;
      boxChanged = true;
    }
    if (box.x >= x - this.width / 2) {
      signX = 1;
      x += atan2(box.y, box.x) * bmag;
      boxChanged = true;
    }
    if (box.x + box.width <= x + this.width / 2) {
      signX = -1;
      x -= atan2(box.y, box.x) * bmag;
      boxChanged = true;
    }

    this.signX = signX;
    this.signY = signY;
    this.x = x + signX * this.force;
    this.y = y + signY * this.force;
  }
}

const rect = new P_Rect(100, 100, 800, 800);
const ellipse = new P_Cirle(400, 500, 40, 40, 1, 1, "#334455ff");
const ellipse2 = new P_Cirle(600, 500, 20, 20, 1, -1, "#334425ff");
const ellipse3 = new P_Cirle(550, 400, 20, 20, -1, -1, "#232475ff");
const ellipse4 = new P_Cirle(500, 400, 20, 20, 1, -1, "#ff2475ff");

let items = [];

setInterval(() => {
  const r_radius = Math.random() * 3;
  if (time < 10000)
    items.push(
      new P_Cirle(
        100 + Math.random() * 800,
        100 + Math.random() * 800,
        1 + r_radius,
        1 + r_radius,
        Math.random() - 0.5 > 0 ? 1 : -1,
        Math.random() - 0.5 > 0 ? 1 : -1,
        "#232475ff"
      )
    );
  else if (time > 50000) {
    items.push(
      new P_Cirle(
        100 + Math.random() * 800,
        100 + Math.random() * 800,
        1 + r_radius,
        1 + r_radius,
        Math.random() - 0.5 > 0 ? 1 : -1,
        Math.random() - 0.5 > 0 ? 1 : -1,
        "#232475ff"
      )
    );
    items.push(
      new P_Cirle(
        100 + Math.random() * 800,
        100 + Math.random() * 800,
        1 + r_radius,
        1 + r_radius,
        Math.random() - 0.5 > 0 ? 1 : -1,
        Math.random() - 0.5 > 0 ? 1 : -1,
        "#232475ff"
      )
    );
  }
}, 1000);

const draw = () => {
  context.save();
  context.fillStyle = "#00000010";
  context.fillRect(0, 0, 1024, 1024);
  context.restore();
  //   rect.draw();

  items.forEach((x) => {
    x.draw();
    x.step(rect, items);
  });

  for (let index = 1; index < items.length; index++) {
    const elem = items[index];

    items
      .filter((x) => x !== elem)
      .forEach((ellipse) => {
        if (in_radius(ellipse, elem, ellipse.width * 3)) {
          context.save();
          context.strokeStyle = elem.color;
          context.beginPath();
          context.moveTo(elem.x, elem.y);
          context.lineTo(ellipse.x, ellipse.y);
          context.closePath();
          context.stroke();
          context.restore();
        }
      });
  }
};

render();
