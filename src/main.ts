import {
  Application,
  Graphics,
  Assets,
  Texture,
  AnimatedSprite,
  Rectangle,
} from "pixi.js";

type Character = {
  velocityY: number;
  currentVerticalPosition: number;
  gravity: number;
  jumpForce: number;
  isOnGround: boolean;
  sprite: AnimatedSprite | null;
};

type Enemy = {
  x: number;
  y: number;
  height: number;
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

  // Load the hero sprite sheet
  const heroTexture = await Assets.load("/assets/hero-run.png"); // Update this path

  // Create frames from the sprite sheet
  const frameWidth = heroTexture.width / 10; // Calculate width of each frame
  const frameHeight = heroTexture.height;

  const frames = [];
  for (let i = 0; i < 10; i++) {
    // Create rectangle for each frame
    const frameRect = new Rectangle(i * frameWidth, 0, frameWidth, frameHeight);

    // Create texture from the base texture and rectangle
    const frame = new Texture({
      source: heroTexture.source,
      frame: frameRect,
    });
    frames.push(frame);
  }

  // Create animated sprite
  const heroSprite = new AnimatedSprite(frames);
  heroSprite.animationSpeed = 0.15;
  heroSprite.play();
  heroSprite.scale.set(1.5);
  heroSprite.anchor.set(0.5, 1); // Bottom center anchor

  const hero: Character = {
    velocityY: 0,
    currentVerticalPosition: groundY,
    gravity: 1,
    jumpForce: 16,
    isOnGround: true,
    sprite: heroSprite,
  };

  app.stage.addChild(heroSprite);

  const enemies: Enemy[] = [
    {
      x: app.screen.width + 10,
      y: groundY - 25,
      height: 25,
      width: 15,
      speed: 3,
      graphic: new Graphics().rect(0, 0, 15, 25).fill("red"),
    },
    {
      x: app.screen.width + 150,
      y: groundY - 25,
      height: 25,
      width: 15,
      speed: 3,
      graphic: new Graphics().rect(0, 0, 15, 25).fill("red"),
    },
    {
      x: app.screen.width + 300,
      y: groundY - 25,
      height: 25,
      width: 15,
      speed: 3,
      graphic: new Graphics().rect(0, 0, 15, 25).fill("red"),
    },
  ];

  enemies.forEach((enemy) => {
    app.stage.addChild(enemy.graphic);
  });

  // Jump input
  window.addEventListener("keydown", (keypress) => {
    if (keypress.key === " " && hero.isOnGround && hero.sprite) {
      hero.velocityY -= hero.jumpForce;
      hero.isOnGround = false;
    }
  });

  // Game loop
  app.ticker.add(() => {
    // Apply gravity
    hero.velocityY += hero.gravity;
    hero.currentVerticalPosition += hero.velocityY;

    // Ground collision
    if (hero.currentVerticalPosition >= groundY) {
      hero.currentVerticalPosition = groundY;
      hero.isOnGround = true;
      hero.velocityY = 0;
    }

    // Update hero sprite
    if (hero.sprite) {
      hero.sprite.position.set(256, hero.currentVerticalPosition);

      // Control animation based on state
      if (!hero.isOnGround && hero.sprite.playing) {
        hero.sprite.stop();
      } else if (hero.isOnGround && !hero.sprite.playing) {
        hero.sprite.play();
      }
    }

    // Enemy movement
    enemies.forEach((enemy) => {
      enemy.x -= enemy.speed;
      enemy.graphic.position.set(enemy.x, groundY - enemy.height);

      // Recycle enemies
      if (enemy.x + enemy.width < 0) {
        enemy.x = app.screen.width + Math.random() * 220;
      }
    });
  });
})();
