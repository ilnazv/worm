import React from "react";

export default class GameShell extends React.Component<{}, { tick: number }> {
  private game?: Game;
  private canvasRef: any;
  private ctx?: CanvasRenderingContext2D;

  constructor(props: any) {
    super(props);
    this.canvasRef = React.createRef();

    this.state = {
      tick: 0
    };
  }

  componentDidMount(): void {
    const canvas: HTMLCanvasElement = this.canvasRef.current;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.ctx.fillStyle = "green";
    this.game = new Game(this.ctx);
    this.game.start();
    window.addEventListener("keydown", (event: KeyboardEvent) => {
      if (this.game) {
        this.game.changeDirection(event.keyCode);
      }
      this.setState({
        tick: this.state.tick + 1
      });
    });
  }

  public render(): JSX.Element {
    return (
      <>
        GameShell:
        <canvas ref={this.canvasRef} width={640} height={425} />;
      </>
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

  private position: Position = {
    posX: 0,
    posY: 0
  };
  private step = 10;

  constructor(private ctx: CanvasRenderingContext2D) {}

  public start(): void {
    this.intervalId = setInterval(() => {
      this.run();
      this.draw();
    }, 1000 / this.fps);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private run(): void {
    this.tick++;
    switch (this.direction) {
      case Keys.DOWN:
        this.moveDown();
        break;
      case Keys.UP:
        this.moveUp();
        break;
      case Keys.LEFT:
        this.moveLeft();
        break;
      case Keys.RIGHT:
        this.moveRight();
        break;
      default:
        console.log("no action assigned");
        break;
    }
  }

  public draw(): void {
    this.ctx.clearRect(0, 0, 640, 425);
    this.ctx.fillRect(this.position.posX, this.position.posY, 10, 10);
  }

  public changeDirection(key: Keys): void {
    this.direction = key;
  }

  private moveUp(): void {
    this.position.posY -= this.step;
  }

  private moveDown(): void {
    this.position.posY += this.step;
  }

  private moveLeft(): void {
    this.position.posX -= this.step;
  }

  private moveRight(): void {
    this.position.posX += this.step;
  }
}
