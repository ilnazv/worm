import React from "react";
import { Game } from "./Game";
import { ISize } from "./Models";

interface GameShellProps {
  canvasSize: ISize;
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
    const game = new Game(ctx, this.props.canvasSize, 5, 50, 1, 100);
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
