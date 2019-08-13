export class Position {
  constructor(public posX: number, public posY: number) {}

  public positionsEqual = (right: Position): boolean => {
    return this.posX === right.posX && this.posY === right.posY;
  };
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

export interface ISize {
  width: number;
  height: number;
}

export class ColoredDot extends Position {
  constructor(posX: number, posY: number, public color: string) {
    super(posX, posY);
  }
}

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

export class Snack extends Position {
  public static newRandomly(occupiedPosition: Position[], canvas: Canvas): Snack {
    let newSnackPosition = canvas.getRandomPosition();
    while (occupiedPosition.some(y => y.positionsEqual(newSnackPosition))) {
      newSnackPosition = canvas.getRandomPosition();
    }
    const { posX, posY } = newSnackPosition;
    return new this(posX, posY);
  }
}
