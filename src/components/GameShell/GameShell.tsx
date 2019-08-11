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
        this.game.changeDirection(event.keyCode);
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

export enum Keys {
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40
}

class Game {
  private intervalId?: NodeJS.Timeout;
  private tick = 0;
  private fps = 5;
  private direction: Keys = Keys.DOWN;
  private wormSize = 1;

  private position: Position = {
    posX: 0,
    posY: 0
  };
  private step = 1;

  private get canvasSizeInBlocks(): CanvasSize {
    return {
      width: this.canvasSizeinPx.width / this.blockSize,
      height: this.canvasSizeinPx.height / this.blockSize,
    }
  }

  constructor(
    private ctx: CanvasRenderingContext2D,
    private canvasSizeinPx: CanvasSize,
    private blockSize = 100
  ) {}

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
  }

  private move(): boolean {
    const newPosition = this.moveTowards(this.direction);
    const possibleMove = this.checkMove(newPosition);
    if (possibleMove) {
      this.position = newPosition;
      return possibleMove;
    }
    return possibleMove;
  }

  public draw(): void {
    this.ctx.clearRect(0, 0, this.canvasSizeinPx.width, this.canvasSizeinPx.height);
    this.ctx.fillRect(this.position.posX * this.blockSize, this.position.posY * this.blockSize, this.blockSize, this.blockSize);
  }

  public changeDirection(key: Keys): void {
    if (!Object.values(Keys).includes(key)) {
      return;
    }
    this.direction = key;
  }

  private moveTowards(key: Keys): Position {
    switch (key) {
      case Keys.UP:
        return {
          posY: this.position.posY - this.step,
          posX: this.position.posX
        };
      case Keys.DOWN:
        return {
          posY: this.position.posY + this.step,
          posX: this.position.posX
        };
      case Keys.LEFT:
        return {
          posY: this.position.posY,
          posX: this.position.posX - this.step
        };
      case Keys.RIGHT:
        return {
          posY: this.position.posY,
          posX: this.position.posX + this.step
        };
      default:
        console.log("no action assigned");
        return this.position;
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
