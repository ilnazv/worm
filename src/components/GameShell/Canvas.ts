import { ISize, Position, ColoredDot } from "./Models";

export class Canvas {
  private size: ISize = { width: 0, height: 0 };

  constructor(width: number, height: number, private _blockSize: number = 1, private ctx: CanvasRenderingContext2D) {
    this.size = { width, height };
  }

  public getRandomPosition(): Position {
    return new Position(
      Math.floor(Math.random() * this.canvasSizeInBlocks.width),
      Math.floor(Math.random() * this.canvasSizeInBlocks.height)
    );
  }

  public get canvasSizeInBlocks(): ISize {
    return { width: this.size.width / this._blockSize, height: this.size.height / this._blockSize };
  }

  public outOfCanvas(position: Position): boolean {
    return (
      this.canvasSizeInBlocks.height < position.posY ||
      position.posY < 0 ||
      this.canvasSizeInBlocks.width < position.posX ||
      position.posX < 0
    );
  }

  public draw(dots: ColoredDot[]): void {
    this.ctx.clearRect(0, 0, this.size.width, this.size.height);
    for (let index = 0; index < dots.length; index++) {
      const dot = dots[index];
      this.ctx.fillStyle = dot.color;
      this.ctx.fillRect(dot.posX * this._blockSize, dot.posY * this._blockSize, this._blockSize, this._blockSize);
    }
  }
}
