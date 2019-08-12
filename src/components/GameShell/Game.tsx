import { Worm, CanvasSize, positionsEqual, Keys, Position, getRandomPosition } from "./Models";

export class Game {
  private intervalId?: NodeJS.Timeout;
  private tick = 0;
  private snacks: Position[] = [];

  private worms: Worm[] = [];

  private step = 1;

  private survivorMode = false;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private canvasSizeinPx: CanvasSize,
    private fps = 50,
    private blockSize = 100,
    wormsNumber = 1,
    snacksNumber = 1
  ) {
    for (let index = 0; index < wormsNumber; index++) {
      const canvasSizeInBlocks = CanvasSize.canvasSizeInBlocks(this.canvasSizeinPx, this.blockSize);
      this.worms.push(new Worm(getRandomPosition(canvasSizeInBlocks)));
    }
    this.initSnacks(snacksNumber);
    this.survivorMode = wormsNumber > 1;
  }

  private async initSnacks(snacksNumber: number): Promise<void> {
    for (let index = 0; index < snacksNumber; index++) {
      this.snacks.push(await this.setSnackPosition());
    }
  }

  private async setSnackPosition(): Promise<Position> {
    const canvasSizeInBlocks = CanvasSize.canvasSizeInBlocks(this.canvasSizeinPx, this.blockSize);
    let newSnackPosition = getRandomPosition(canvasSizeInBlocks);
    while (this.worms.some(x => x.body.some(y => positionsEqual(y, newSnackPosition)))) {
      newSnackPosition = getRandomPosition(canvasSizeInBlocks);
    }
    return newSnackPosition;
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
            this.changeDirection(key, worm);
            possibleMove = this.move(worm);
            tryCounter++;
            if (tryCounter >= 100) {
              worm.dead = true;
              possibleMove = true;
            }
          }
          const key = Keys.LEFT + Math.floor(Math.random() * 4);
          this.changeDirection(key, worm);
        }
      });
    this.draw();
    if (this.survivorMode && this.worms.filter(x => !x.dead).length <= 1) {
      this.stop();
    }
  }

  private async checkSnack(worm: Worm, index: number, headPosition: Position): Promise<void> {
    const wormApproachedSnack = positionsEqual(this.snacks[index], headPosition);
    if (wormApproachedSnack) {
      worm.increaseSize();
      this.snacks[index] = await this.setSnackPosition();
    }
  }

  private checkAnotherWorm(worm: Worm, headPosition: Position): void {
    const anotherWorm = this.worms.find(x => !positionsEqual(x.headPosition, worm.headPosition) && !x.dead && x.body.some(y => positionsEqual(y, headPosition)));
    if (anotherWorm) {
      anotherWorm.dead = true;
      worm.increaseSize(anotherWorm.size);
    }
  }

  private move(worm: Worm): boolean {
    const newPosition = this.tryToMoveTowards(worm.direction, worm);
    const possibleMove = this.checkNextMove(newPosition, worm);
    if (possibleMove) {
      for (let index = 0; index < this.snacks.length; index++) {
        this.checkSnack(worm, index, newPosition);
      }
      this.checkAnotherWorm(worm, newPosition);
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
    this.changeDirection(key, this.worms[0]);
  }

  private changeDirection(key: Keys, worm: Worm): void {
    if (
      (worm.direction === Keys.DOWN && key === Keys.UP) ||
      (worm.direction === Keys.UP && key === Keys.DOWN) ||
      (worm.direction === Keys.LEFT && key === Keys.RIGHT) ||
      (worm.direction === Keys.RIGHT && key === Keys.LEFT)
    ) {
      return;
    }
    worm.direction = key;
  }

  private tryToMoveTowards(key: Keys, worm: Worm): Position {
    switch (key) {
      case Keys.UP:
        return {
          posX: worm.headPosition.posX,
          posY: worm.headPosition.posY - this.step
        };
      case Keys.DOWN:
        return {
          posX: worm.headPosition.posX,
          posY: worm.headPosition.posY + this.step
        };
      case Keys.LEFT:
        return {
          posX: worm.headPosition.posX - this.step,
          posY: worm.headPosition.posY
        };
      case Keys.RIGHT:
        return {
          posX: worm.headPosition.posX + this.step,
          posY: worm.headPosition.posY
        };
      default:
        console.log("no action handler for key: ", key);
        return worm.headPosition;
    }
  }

  private checkNextMove(headPosition: Position, worm: Worm): boolean {
    const outOfCanvas =
      CanvasSize.canvasSizeInBlocks(this.canvasSizeinPx, this.blockSize).height < headPosition.posY + this.step ||
      headPosition.posY < 0 ||
      CanvasSize.canvasSizeInBlocks(this.canvasSizeinPx, this.blockSize).width < headPosition.posX + this.step ||
      headPosition.posX < 0;
    if (outOfCanvas) {
      return false;
    }
    const wormApproachedHimself = worm.body.some(x => positionsEqual(x, headPosition));
    if (wormApproachedHimself) {
      return false;
    }
    const anotherWorm = this.worms.find(x => !positionsEqual(x.headPosition, worm.headPosition) && !x.dead && x.body.some(y => positionsEqual(y, headPosition)));
    if (anotherWorm) {
      return anotherWorm.size < worm.size;
    }
    return true;
  }
}
