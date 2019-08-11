import React from "react";

interface GameShellProps {
  canvasSize: CanvasSize;
}

interface CanvasSize {
  width: number;
  height: number;
}

export default class GameShell extends React.Component<
  GameShellProps,
  { tick: number }
> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: GameShellProps) {
    super(props);
    this.canvasRef = React.createRef();

    this.state = {
      tick: 0
    };
  }

  componentDidMount(): void {
    const canvas = this.canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = "green";
    const game = new Game(ctx, this.props.canvasSize, 5, 100, 100);
    game.start(true);
    window.addEventListener("keydown", (event: KeyboardEvent) =>
      game.handleKey(event.keyCode)
    );
  }

  public render(): JSX.Element {
    return (
      <canvas
        ref={this.canvasRef}
        width={this.props.canvasSize.width}
        height={this.props.canvasSize.height}
        style={{ border: "1px solid" }}
      />
    );
  }
}

interface Position {
  posX: number;
  posY: number;
}

const positionsEqual = (left: Position, right: Position): boolean => {
  return left.posX === right.posX && left.posY === right.posY;
};

export enum Keys {
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40,
  SPACE = 32
}

class Worm {
  private _headPosition: Position = {
    posX: 0,
    posY: 0
  };

  public get headPosition(): Position {
    return this._headPosition;
  }

  public set headPosition(value: Position) {
    if (this.body.length >= this.size) {
      this.body.shift();
    }
    this.body.push(value);
    this._headPosition = value;
  }

  public body: Position[] = [];

  constructor(
    headPosition: Position = { posX: 0, posY: 0 },
    public size: number = 3,
    public direction: Keys = Keys.DOWN
  ) {
    this.headPosition = headPosition;
    this.body.push(this.headPosition);
  }
}

class Game {
  private intervalId?: NodeJS.Timeout;
  private tick = 0;
  private fps = 50;
  private snacks: Position[] = [];

  private worms: Worm[] = [];

  private step = 1;

  private get canvasSizeInBlocks(): CanvasSize {
    return {
      width: this.canvasSizeinPx.width / this.blockSize,
      height: this.canvasSizeinPx.height / this.blockSize
    };
  }

  constructor(
    private ctx: CanvasRenderingContext2D,
    private canvasSizeinPx: CanvasSize,
    private blockSize = 100,
    wormsNumber = 1,
    snacksNumber = 1
  ) {
    for (let index = 0; index < wormsNumber; index++) {
      this.worms.push(new Worm());
    }
    this.initSnacks(snacksNumber);
  }

  private async initSnacks(snacksNumber: number): Promise<void> {
    for (let index = 0; index < snacksNumber; index++) {
      this.snacks.push(await this.setSnackPosition());
    }
  }

  private async setSnackPosition(): Promise<Position> {
    let newSnackPosition = {
      posX: Math.floor(Math.random() * this.canvasSizeInBlocks.width),
      posY: Math.floor(Math.random() * this.canvasSizeInBlocks.height)
    };
    while (
      this.worms.some(x =>
        x.body.some(y => positionsEqual(y, newSnackPosition))
      )
    ) {
      newSnackPosition = {
        posX: Math.floor(Math.random() * this.canvasSizeInBlocks.width),
        posY: Math.floor(Math.random() * this.canvasSizeInBlocks.height)
      };
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
    for (let index = 0; index < this.worms.length; index++) {
      const worm = this.worms[index];
      this.move(worm);
      if (random) {
        const key = Keys.LEFT + Math.floor(Math.random() * 4);
        this.changeDirection(key, worm);
      }
    }
    this.draw();
  }

  private async checkSnack(worm: Worm, index: number): Promise<void> {
    const wormApproachedSnack = positionsEqual(this.snacks[index], worm.headPosition);
    if (wormApproachedSnack) {
      worm.size++;
      this.snacks[index] = await this.setSnackPosition();
    }
  }

  private move(worm: Worm): boolean {
    const newPosition = this.moveTowards(worm.direction, worm);
    const possibleMove = this.checkMove(newPosition);
    if (possibleMove) {
      for (let index = 0; index < this.snacks.length; index++) {
        this.checkSnack(worm, index);
      }
      worm.headPosition = newPosition;
      return possibleMove;
    }
    return possibleMove;
  }

  public draw(): void {
    this.ctx.clearRect(
      0,
      0,
      this.canvasSizeinPx.width,
      this.canvasSizeinPx.height
    );
    for (let wI = 0; wI < this.worms.length; wI++) {
      const worm = this.worms[wI];
      for (let index = 0; index < worm.body.length; index++) {
        const element = worm.body[index];
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(
          element.posX * this.blockSize,
          element.posY * this.blockSize,
          this.blockSize,
          this.blockSize
        );
      }      
    }
    for (let sI = 0; sI < this.snacks.length; sI++) {
      const snack = this.snacks[sI];
      this.ctx.fillStyle = "green";
      this.ctx.fillRect(
        snack.posX * this.blockSize,
        snack.posY * this.blockSize,
        this.blockSize,
        this.blockSize
      );
    }
  }

  public handleKey(key: Keys): void {
    if (!Object.values(Keys).includes(key)) {
      return;
    }
    this.changeDirection(key, this.worms[0]);
    if (key === Keys.SPACE) {
      this.worms[0].size++;
    }
  }

  private changeDirection(key: Keys, worm: Worm): void {
    if (worm.direction === Keys.DOWN && key === Keys.UP) {
      return;
    }
    if (worm.direction === Keys.UP && key === Keys.DOWN) {
      return;
    }
    if (worm.direction === Keys.LEFT && key === Keys.RIGHT) {
      return;
    }
    if (worm.direction === Keys.RIGHT && key === Keys.LEFT) {
      return;
    }
    worm.direction = key;
  }

  private moveTowards(key: Keys, worm: Worm): Position {
    switch (key) {
      case Keys.UP:
        return {
          posY: worm.headPosition.posY - this.step,
          posX: worm.headPosition.posX
        };
      case Keys.DOWN:
        return {
          posY: worm.headPosition.posY + this.step,
          posX: worm.headPosition.posX
        };
      case Keys.LEFT:
        return {
          posY: worm.headPosition.posY,
          posX: worm.headPosition.posX - this.step
        };
      case Keys.RIGHT:
        return {
          posY: worm.headPosition.posY,
          posX: worm.headPosition.posX + this.step
        };
      default:
        console.log("no action assigned");
        return worm.headPosition;
    }
  }

  private checkMove(position: Position): boolean {
    if (
      this.canvasSizeInBlocks.height < position.posY + this.step ||
      position.posY < 0 ||
      this.canvasSizeInBlocks.width < position.posX + this.step ||
      position.posX < 0
    ) {
      return false;
    }
    return true;
  }
}
