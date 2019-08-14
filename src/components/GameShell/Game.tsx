import { Worm, Canvas, Keys, Position, Snack, ISize, ColoredDot } from "./Models";

export class Game {
  private intervalId?: NodeJS.Timeout;
  private tick = 0;
  private snacks: Snack[] = [];
  private worms: Worm[] = [];
  private survivorMode = false;
  private canvas: Canvas;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvasSizeinPx: ISize,
    private fps = 50,
    private blockSize = 100,
    wormsNumber = 1,
    snacksNumber = 1
  ) {
    this.canvas = new Canvas(canvasSizeinPx.width, canvasSizeinPx.height, this.blockSize, ctx);
    for (let index = 0; index < wormsNumber; index++) {
      this.worms.push(new Worm(this.canvas.getRandomPosition()));
    }
    this.initSnacks(snacksNumber);
    this.survivorMode = wormsNumber > 1;
  }

  private initSnacks(snacksNumber: number): void {
    for (let index = 0; index < snacksNumber; index++) {
      this.snacks.push(Snack.newRandomly(this.worms.flatMap(x => x.body), this.canvas));
    }
  }

  public start(random: boolean = false): void {
    this.intervalId = setInterval(() => {
      this.run(random);
    }, 1000 / this.fps);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private run(random: boolean): void {
    this.tick++;
    this.worms
      .filter(x => !x.dead)
      .forEach(worm => {
        if (random) {
          const possibleDirections: number[] = [Keys.DOWN, Keys.LEFT, Keys.RIGHT, Keys.UP];
          (window as any).worm = worm;
          let possibleMove = false;
          let key: Keys = Keys.DOWN;
          do {
            if (possibleDirections.length === 0) {
              worm.dead = true;
              possibleMove = true;
            } else {
              const index = Math.floor(Math.random() * possibleDirections.length);
              key = possibleDirections[index];
              possibleMove = this.move(worm, key);
              possibleDirections.splice(index, 1);
            }
          } while (!possibleMove); 
          worm.direction = key;
        }
      });
    this.draw();
    if (this.survivorMode && this.worms.filter(x => !x.dead).length <= 1) {
      this.stop();
    }
  }

  private draw(): void {
    const dots: ColoredDot[] = [];
    this.worms
      .filter(x => !x.dead)
      .forEach(worm => {
        for (let index = 0; index < worm.body.length; index++) {
          const element = worm.body[index];
          const color = index === worm.body.length - 1 ? "red" : worm.dead ? "burlywood" : "black";
          dots.push(new ColoredDot(element.posX, element.posY, color));
        }
      });
    for (let sI = 0; sI < this.snacks.length; sI++) {
      const snack = this.snacks[sI];
      const color = "green";
      dots.push(new ColoredDot(snack.posX, snack.posY, color));
    }
    this.canvas.draw(dots);
  }

  private checkSnack(worm: Worm, index: number, headPosition: Position): void {
    const wormApproachedSnack = this.snacks[index].positionsEqual(headPosition);
    if (wormApproachedSnack) {
      worm.increaseSize();
      this.snacks[index] = Snack.newRandomly(this.worms.flatMap(x => x.body), this.canvas);
    }
  }

  private move(worm: Worm, direction: Keys): boolean {
    const newPosition = worm.nextPosition(direction);
    const possibleMove = this.checkNextMove(newPosition, worm);
    if (possibleMove) {
      for (let index = 0; index < this.snacks.length; index++) {
        this.checkSnack(worm, index, newPosition);
      }
      worm.checkAnotherWorm(newPosition, this.worms);
      worm.headPosition = newPosition;
      return possibleMove;
    }
    return possibleMove;
  }

  public handleKey(key: Keys): void {
    if (!Object.values(Keys).includes(key)) {
      return;
    }
    this.worms[0].direction = key;
  }

  private checkNextMove(headPosition: Position, worm: Worm): boolean {
    if (this.canvas.outOfCanvas(headPosition)) {
      return false;
    }
    const wormApproachedHimself = worm.body.some(x => x.positionsEqual(headPosition));
    if (wormApproachedHimself) {
      return false;
    }
    const anotherWorm = this.worms.find(
      x =>
        !x.headPosition.positionsEqual(worm.headPosition) && !x.dead && x.body.some(y => y.positionsEqual(headPosition))
    );
    if (anotherWorm) {
      return anotherWorm.size <= worm.size;
    }
    return true;
  }
}
