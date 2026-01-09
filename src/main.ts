import { Application, Graphics } from "pixi.js";

type Character = {
  velocityY: number;
  currentVerticalPosition: number;
  gravity: number;
  jumpForce: number;
  isOnGround: boolean;
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

  const hero: Character = {
    velocityY: 0,
    currentVerticalPosition: groundY,
    gravity: 1,
    jumpForce: 16,
    isOnGround: true,
  };

  const heroGraphic = new Graphics().rect(0, 0, 20, 30).fill("blue");
  app.stage.addChild(heroGraphic);

  // Listen for animate update
  app.ticker.add(() => {
    heroGraphic.position.set(5, hero.currentVerticalPosition - 30);
  });
})();
