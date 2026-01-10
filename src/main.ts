import { Application, Graphics } from "pixi.js";

type Character = {
  velocityY: number;
  currentVerticalPosition: number;
  gravity: number;
  jumpForce: number;
  isOnGround: boolean;
};

type Enemy = {
  x: number;
  y: number;
  hieght: number;
  width: number;
  speed: number;
  graphic: Graphics;
};

(async () => {
  const app = new Application();
  await app.init({
    background: "#1b1a1f",
    antialias: true,
    resizeTo: window,
  });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const groundY = 600;
  const platform = new Graphics()
    .rect(0, groundY, app.screen.width, 1)
    .fill("yellow");
  app.stage.addChild(platform);

  const enemies: Enemy[] = [
    {
      x: app.screen.width + 10,
      y: groundY - 25,
      hieght: 25,
      width: 15,
      speed: 3,
      graphic: new Graphics().rect(0, 0, 15, 25).fill("red"),
    },
    {
      x: app.screen.width + 150,
      y: groundY - 25,
      hieght: 25,
      width: 15,
      speed: 3,
      graphic: new Graphics().rect(0, 0, 15, 25).fill("red"),
    },
    {
      x: app.screen.width + 300,
      y: groundY - 25,
      hieght: 25,
      width: 15,
      speed: 3,
      graphic: new Graphics().rect(0, 0, 15, 25).fill("red"),
    },
  ];

  enemies.forEach((enemy) => {
    app.stage.addChild(enemy.graphic);
  });

  const hero: Character = {
    velocityY: 0,
    currentVerticalPosition: groundY,
    gravity: 1,
    jumpForce: 16,
    isOnGround: true,
  };

  const heroGraphic = new Graphics().rect(0, 0, 20, 30).fill("blue");
  app.stage.addChild(heroGraphic);

  // Jump input
  window.addEventListener("keydown", (keypress) => {
    if (keypress.key === " " && hero.isOnGround) {
      hero.velocityY -= hero.jumpForce;
      hero.isOnGround = false;
    }
  });

  // Game loop
  app.ticker.add(() => {
    // Apply gravity every frame
    hero.velocityY += hero.gravity;

    // Move hero according to velocity
    hero.currentVerticalPosition += hero.velocityY;

    // Ground collision check
    if (hero.currentVerticalPosition >= groundY) {
      hero.currentVerticalPosition = groundY;
      hero.isOnGround = true;
      hero.velocityY = 0;
    }

    // Update graphics position
    heroGraphic.position.set(256, hero.currentVerticalPosition - 30);

    // Enemy movement
    enemies.forEach((enemy) => {
      enemy.x -= enemy.speed;
      enemy.graphic.position.set(enemy.x, groundY - enemy.hieght);

      if (enemy.x + enemy.width < 0) {
        enemy.x = app.screen.width + Math.random() * 200;
      }
    });
  });
})();
