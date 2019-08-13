export class Position {
  constructor(public posX: number, public posY: number) {}

  public positionsEqual = (right: Position): boolean => {
    return this.posX === right.posX && this.posY === right.posY;
  };

  public static getRandomPosition(canvasSizeInBlocks: CanvasSize): Position {
    return new this(
      Math.floor(Math.random() * canvasSizeInBlocks.width),
      Math.floor(Math.random() * canvasSizeInBlocks.height)
    );
  }
}

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
        return new Position(this.headPosition.posX, this.headPosition.posY - this._step);
      case Keys.DOWN:
        return new Position(this.headPosition.posX, this.headPosition.posY + this._step);
      case Keys.LEFT:
        return new Position(this.headPosition.posX - this._step, this.headPosition.posY);
      case Keys.RIGHT:
        return new Position(this.headPosition.posX + this._step, this.headPosition.posY);
      default:
        console.log("no action handler for key: ", this.direction);
        return this.headPosition;
    }
  }

  public checkAnotherWorm(headPosition: Position, worms: Worm[]): void {
    const anotherWorm = worms.find(
      x =>
        !x.headPosition.positionsEqual(this.headPosition) && !x.dead && x.body.some(y => y.positionsEqual(headPosition))
    );
    if (anotherWorm) {
      anotherWorm.dead = true;
      this.increaseSize(anotherWorm.size);
    }
  }

  constructor(
    private _headPosition: Position = new Position(0, 0),
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

export class Snack extends Position {
  public static newRandomly(occupiedPosition: Position[], _canvasSizeinBlocks: CanvasSize): Snack {
    let newSnackPosition = Position.getRandomPosition(_canvasSizeinBlocks);
    while (occupiedPosition.some(y => y.positionsEqual(newSnackPosition))) {
      newSnackPosition = Position.getRandomPosition(_canvasSizeinBlocks);
    }
    const { posX, posY } = newSnackPosition;
    return new this(posX, posY);
  }

  constructor(posX: number, posY: number) {
    super(posX, posY);
  }
}
