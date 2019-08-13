export interface Position {
  posX: number;
  posY: number;
}

export const getRandomPosition = (canvasSizeInBlocks: CanvasSize): Position => {
  return {
    posX: Math.floor(Math.random() * canvasSizeInBlocks.width),
    posY: Math.floor(Math.random() * canvasSizeInBlocks.height)
  };
};

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

  public increaseSize(value: number = 1): void {
    this._size = this.size + value;
  }

  public dead = false;

  public get size(): number {
    return this._size;
  }

  public get direction(): Keys {
    return this._direction;
  }

  public set direction(key: Keys) {
    const wrongDirection =
      (this._direction === Keys.DOWN && key === Keys.UP) ||
      (this._direction === Keys.UP && key === Keys.DOWN) ||
      (this._direction === Keys.LEFT && key === Keys.RIGHT) ||
      (this._direction === Keys.RIGHT && key === Keys.LEFT);

    if (!wrongDirection) {
      this._direction = key;
    }
  }

  public nextPosition(): Position {
    switch (this.direction) {
      case Keys.UP:
        return {
          posX: this.headPosition.posX,
          posY: this.headPosition.posY - this._step
        };
      case Keys.DOWN:
        return {
          posX: this.headPosition.posX,
          posY: this.headPosition.posY + this._step
        };
      case Keys.LEFT:
        return {
          posX: this.headPosition.posX - this._step,
          posY: this.headPosition.posY
        };
      case Keys.RIGHT:
        return {
          posX: this.headPosition.posX + this._step,
          posY: this.headPosition.posY
        };
      default:
        console.log("no action handler for key: ", this.direction);
        return this.headPosition;
    }
  }

  public checkAnotherWorm(headPosition: Position, worms: Worm[]): void {
    const anotherWorm = worms.find(
      x =>
        !positionsEqual(x.headPosition, this.headPosition) &&
        !x.dead &&
        x.body.some(y => positionsEqual(y, headPosition))
    );
    if (anotherWorm) {
      anotherWorm.dead = true;
      this.increaseSize(anotherWorm.size);
    }
  }

  constructor(
    private _headPosition: Position = { posX: 0, posY: 0 },
    private _size: number = 3,
    private _direction: Keys = Keys.DOWN,
    private _step: number = 1
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

export class Snack implements Position {
  public posX: number;
  public posY: number;

  public static newRandomly(occupiedPosition: Position[], _canvasSizeinBlocks: CanvasSize) {
    let newSnackPosition = getRandomPosition(_canvasSizeinBlocks);
    while (occupiedPosition.some(y => positionsEqual(y, newSnackPosition))) {
      newSnackPosition = getRandomPosition(_canvasSizeinBlocks);
    }
    const { posX, posY } = newSnackPosition;
    return new this(posX, posY);
  }

  constructor(posX: number, posY: number) {
    this.posX = posX;
    this.posY = posY;
  }
}
