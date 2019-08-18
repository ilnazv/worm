import { Position, Keys, ISize } from "./Models";

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

  public nextPosition(direction: Keys): Position {
    switch (direction) {
      case Keys.UP:
        return new Position(this.headPosition.posX, this.headPosition.posY - this._step);
      case Keys.DOWN:
        return new Position(this.headPosition.posX, this.headPosition.posY + this._step);
      case Keys.LEFT:
        return new Position(this.headPosition.posX - this._step, this.headPosition.posY);
      case Keys.RIGHT:
        return new Position(this.headPosition.posX + this._step, this.headPosition.posY);
      default:
        console.log("no action handler for key: ", direction);
        return this.headPosition;
    }
  }

  public checkAnotherWorm(headPosition: Position, worms: Worm[]): void {
    const anotherWorm = this.approachedAnotherWorm(worms, headPosition);
    if (anotherWorm) {
      anotherWorm.dead = true;
      this.increaseSize(anotherWorm.size);
    }
  }

  public approachedAnotherWorm(worms: Worm[], headPosition: Position): Worm | undefined {
    return worms.find(
      x => !x.headPosition.positionsEqual(headPosition) && !x.dead && x.body.some(y => y.positionsEqual(headPosition))
    );
  }

  public checkHimself(headPosition: Position, canvasSize: ISize): boolean {
    return this.body.some(x => x.positionsEqual(headPosition)) || this.pointIsInPoly(headPosition, canvasSize);
  }

  public pointIsInPoly(headPosition: Position, canvasSize: ISize): boolean {
    let isInside = false;

    const polygon: Position[] = [...this.body];

    const minX = Math.min(...polygon.map(x => x.posX));
    const minY = Math.min(...polygon.map(x => x.posY));
    const maxX = Math.max(...polygon.map(x => x.posX));
    const maxY = Math.max(...polygon.map(x => x.posY));

    if (minX === 0) {
      for (let index = minY; index < maxY; index++) {
        polygon.push(new Position(-1, index));
      }
    }

    if (minY === 0) {
      for (let index = minX; index < maxX; index++) {
        polygon.push(new Position(index, -1));
      }
    }

    if (maxX === canvasSize.width) {
      for (let index = minY; index < maxY; index++) {
        polygon.push(new Position(canvasSize.width + 1, index));
      }
    }

    if (maxY === canvasSize.height) {
      for (let index = minX; index < maxX; index++) {
        polygon.push(new Position(index, canvasSize.height + 1));
      }
    }

    if (headPosition.posX < minX || headPosition.posX > maxX || headPosition.posY < minY || headPosition.posY > maxY) {
      return false;
    }

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      if (
        polygon[i].posY > headPosition.posY !== polygon[j].posY > headPosition.posY &&
        headPosition.posX <
          ((polygon[j].posX - polygon[i].posX) * (headPosition.posY - polygon[i].posY)) /
            (polygon[j].posY - polygon[i].posY) +
            polygon[i].posX
      ) {
        isInside = !isInside;
      }
    }

    return isInside;
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
