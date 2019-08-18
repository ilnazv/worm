import { ISize, Position, ColoredDot } from "./Models";

export class Canvas {
  private size: ISize = { width: 0, height: 0 };
  private backgroundColor = '#aab9b4';
  private emptyBlockColor = '#8a9b93';

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
    return { width: Math.floor(this.size.width / this._blockSize), height: Math.floor(this.size.height / this._blockSize) };
  }

  public outOfCanvas(position: Position): boolean {
    return (
      this.canvasSizeInBlocks.height <= position.posY ||
      position.posY < 0 ||
      this.canvasSizeInBlocks.width <= position.posX ||
      position.posX < 0
    );
  }

  public draw(dots: ColoredDot[]): void {
    this.ctx.clearRect(0, 0, this.size.width, this.size.height);
    this.drawEmptyBlocks();
    for (let index = 0; index < dots.length; index++) {
      const dot = dots[index];
      this.drawBlock(dot);
    }
  }

  private drawEmptyBlocks(): void {
    for (let i = 0; i < this.canvasSizeInBlocks.width; i++) {
      for (let j = 0; j < this.canvasSizeInBlocks.height; j++) {
        this.drawBlock(new ColoredDot(i, j, this.emptyBlockColor));
      }
    }
  }

  private drawBlock(dot: ColoredDot): void {
    this.ctx.fillStyle = dot.color;
    this.ctx.fillRect(dot.posX * this._blockSize, dot.posY * this._blockSize, this._blockSize, this._blockSize);
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(dot.posX * this._blockSize + 1, dot.posY * this._blockSize + 1, this._blockSize - 2, this._blockSize - 2);
    this.ctx.fillStyle = dot.color;
    this.ctx.fillRect(dot.posX * this._blockSize + 2, dot.posY * this._blockSize + 2, this._blockSize - 4, this._blockSize - 4);
  }
}
