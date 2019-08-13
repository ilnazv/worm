import { Worm, CanvasSize, Keys, Position, Snack } from "./Models";

export class Game {
  private intervalId?: NodeJS.Timeout;
  private tick = 0;
  private snacks: Snack[] = [];
  private worms: Worm[] = [];
  private step = 1;
  private survivorMode = false;

  private get canvasSizeInBlocks(): CanvasSize {
    return CanvasSize.canvasSizeInBlocks(this.canvasSizeinPx, this.blockSize);
  }

  constructor(
    private ctx: CanvasRenderingContext2D,
    private canvasSizeinPx: CanvasSize,
    private fps = 50,
    private blockSize = 100,
    wormsNumber = 1,
    snacksNumber = 1
  ) {
    for (let index = 0; index < wormsNumber; index++) {
      this.worms.push(new Worm(Position.getRandomPosition(this.canvasSizeInBlocks)));
    }
    this.initSnacks(snacksNumber);
    this.survivorMode = wormsNumber > 1;
  }

  private initSnacks(snacksNumber: number): void {
    for (let index = 0; index < snacksNumber; index++) {
      this.snacks.push(Snack.newRandomly(this.worms.flatMap(x => x.body), this.canvasSizeInBlocks));
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
        let possibleMove = this.move(worm);
        if (random) {
          let tryCounter = 0;
          while (!possibleMove) {
            const key = Keys.LEFT + Math.floor(Math.random() * 4);
            worm.direction = key;
            possibleMove = this.move(worm);
            tryCounter++;
            if (tryCounter >= 100) {
              worm.dead = true;
              possibleMove = true;
            }
          }
          const key = Keys.LEFT + Math.floor(Math.random() * 4);
          worm.direction = key;
        }
      });
    this.draw();
    if (this.survivorMode && this.worms.filter(x => !x.dead).length <= 1) {
      this.stop();
    }
  }

  private checkSnack(worm: Worm, index: number, headPosition: Position): void {
    const wormApproachedSnack = this.snacks[index].positionsEqual(headPosition);
    if (wormApproachedSnack) {
      worm.increaseSize();
      this.snacks[index] = Snack.newRandomly(this.worms.flatMap(x => x.body), this.canvasSizeInBlocks);
    }
  }

  private move(worm: Worm): boolean {
    const newPosition = worm.nextPosition();
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

  public draw(): void {
    this.ctx.clearRect(0, 0, this.canvasSizeinPx.width, this.canvasSizeinPx.height);
    this.worms
      .filter(x => !x.dead)
      .forEach(worm => {
        for (let index = 0; index < worm.body.length; index++) {
          const element = worm.body[index];
          this.ctx.fillStyle = index === worm.body.length - 1 ? "red" : worm.dead ? "burlywood" : "black";
          this.ctx.fillRect(
            element.posX * this.blockSize,
            element.posY * this.blockSize,
            this.blockSize,
            this.blockSize
          );
        }
      });
    for (let sI = 0; sI < this.snacks.length; sI++) {
      const snack = this.snacks[sI];
      this.ctx.fillStyle = "green";
      this.ctx.fillRect(snack.posX * this.blockSize, snack.posY * this.blockSize, this.blockSize, this.blockSize);
    }
  }

  public handleKey(key: Keys): void {
    if (!Object.values(Keys).includes(key)) {
      return;
    }
    this.worms[0].direction = key;
  }

  private checkNextMove(headPosition: Position, worm: Worm): boolean {
    const outOfCanvas =
      this.canvasSizeInBlocks.height < headPosition.posY + this.step ||
      headPosition.posY < 0 ||
      this.canvasSizeInBlocks.width < headPosition.posX + this.step ||
      headPosition.posX < 0;
    if (outOfCanvas) {
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
      return anotherWorm.size < worm.size;
    }
    return true;
  }
}
