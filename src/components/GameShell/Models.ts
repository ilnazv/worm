export interface Position {
  posX: number;
  posY: number;
}

export const positionsEqual = (left: Position, right: Position): boolean => {
  return left.posX === right.posX && left.posY === right.posY;
};

export enum Keys {
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40
}

export class Worm {
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

  public increaseSize(): void {
    this.size++;
  }

  constructor(
    private _headPosition: Position = { posX: 0, posY: 0 },
    private size: number = 3,
    public direction: Keys = Keys.DOWN
  ) {
    this.body.push(this.headPosition);
  }
}

export class CanvasSize {
  constructor(public width: number, public height: number) {}
  
  public static canvasSizeInBlocks(canvas: CanvasSize, blockSize: number): CanvasSize {
    return {
      width: canvas.width / blockSize,
      height: canvas.height / blockSize
    };
  }
}
