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
  private game?: Game;
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private ctx?: CanvasRenderingContext2D;

  constructor(props: GameShellProps) {
    super(props);
    this.canvasRef = React.createRef();

    this.state = {
      tick: 0
    };
  }

  componentDidMount(): void {
    const canvas = this.canvasRef.current as HTMLCanvasElement;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.ctx.fillStyle = "green";
    this.game = new Game(this.ctx, this.props.canvasSize, 50);
    this.game.start();
    window.addEventListener("keydown", (event: KeyboardEvent) => {
      if (this.game) {
        this.game.handleKey(event.keyCode);
      }
    });
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
}

export enum Keys {
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40,
  SPACE = 32
}

class Game {
  private intervalId?: NodeJS.Timeout;
  private tick = 0;
  private fps = 5;
  private direction: Keys = Keys.DOWN;
  private wormSize = 1;
  private wormBody: Position[] = [];
  private snackPosition?: Position;

  private _position: Position = {
    posX: 0,
    posY: 0
  };

  private get wormHeadPosition(): Position {
    return this._position;
  }

  private set wormHeadPosition(value: Position) {
    if (this.wormBody.length >= this.wormSize) {
      this.wormBody.shift();
    }
    this.wormBody.push(value);
    this._position = value;
  }

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
    private blockSize = 100
  ) {
    this.wormBody.push(this.wormHeadPosition);
    this.setSnackPosition();
  }

  private setSnackPosition(): void {
    let newSnackPosition = this.wormHeadPosition;
    while (this.wormBody.some(x => positionsEqual(x, newSnackPosition))) {
      newSnackPosition = {
        posX: Math.floor(Math.random() * this.canvasSizeInBlocks.width),
        posY: Math.floor(Math.random() * this.canvasSizeInBlocks.height)
      }
    }
    this.snackPosition = newSnackPosition;
  }

  public start(): void {
    this.intervalId = setInterval(() => {
      this.run();
    }, 1000 / this.fps);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private run(): void {
    this.tick++;
    if (this.move()) {
      this.draw();
    }
    this.checkSnack();
  }

  private checkSnack(): void {
    const wormApproachedSnack =
      this.snackPosition &&
      positionsEqual(this.snackPosition, this.wormHeadPosition)
    if (wormApproachedSnack) {
      this.wormSize++;
      this.setSnackPosition();
    }
  }

  private move(): boolean {
    const newPosition = this.moveTowards(this.direction);
    const possibleMove = this.checkMove(newPosition);
    if (possibleMove) {
      this.wormHeadPosition = newPosition;
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
    for (let index = 0; index < this.wormBody.length; index++) {
      const element = this.wormBody[index];
      this.ctx.fillRect(
        element.posX * this.blockSize,
        element.posY * this.blockSize,
        this.blockSize,
        this.blockSize
      );
    }
    if (this.snackPosition) {
      this.ctx.fillRect(
        this.snackPosition.posX * this.blockSize,
        this.snackPosition.posY * this.blockSize,
        this.blockSize,
        this.blockSize
      );
    }
  }

  public handleKey(key: Keys): void {
    if (!Object.values(Keys).includes(key)) {
      return;
    }
    this.changeDirection(key);
    if (key === Keys.SPACE) {
      this.wormSize++;
    }
  }

  private changeDirection(key: Keys): void {
    if (this.direction === Keys.DOWN && key === Keys.UP) {
      return;
    }
    if (this.direction === Keys.UP && key === Keys.DOWN) {
      return;
    }
    if (this.direction === Keys.LEFT && key === Keys.RIGHT) {
      return;
    }
    if (this.direction === Keys.RIGHT && key === Keys.LEFT) {
      return;
    }
    this.direction = key;
  }

  private moveTowards(key: Keys): Position {
    switch (key) {
      case Keys.UP:
        return {
          posY: this.wormHeadPosition.posY - this.step,
          posX: this.wormHeadPosition.posX
        };
      case Keys.DOWN:
        return {
          posY: this.wormHeadPosition.posY + this.step,
          posX: this.wormHeadPosition.posX
        };
      case Keys.LEFT:
        return {
          posY: this.wormHeadPosition.posY,
          posX: this.wormHeadPosition.posX - this.step
        };
      case Keys.RIGHT:
        return {
          posY: this.wormHeadPosition.posY,
          posX: this.wormHeadPosition.posX + this.step
        };
      default:
        console.log("no action assigned");
        return this.wormHeadPosition;
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
