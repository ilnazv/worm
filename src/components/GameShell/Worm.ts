import { Position, Keys } from './Models';

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
      x =>
        !x.headPosition.positionsEqual(headPosition) && !x.dead && x.body.some(y => y.positionsEqual(headPosition))
    );
  }

  public checkHimself(headPosition: Position): boolean {
    const positionBlockedVertically = this.body.some(x => x.positionsEqual(new Position(
      headPosition.posX,
      headPosition.posY - 1
    ))) && this.body.some(x => x.positionsEqual(new Position(
      headPosition.posX,
      headPosition.posY + 1
    )));
    const positionBlockedHorizontally = this.body.some(x => x.positionsEqual(new Position(
      headPosition.posX - 1,
      headPosition.posY
    ))) && this.body.some(x => x.positionsEqual(new Position(
      headPosition.posX + 1,
      headPosition.posY
    )));
    const approachedDeadEnd = positionBlockedHorizontally || positionBlockedVertically;
    return approachedDeadEnd || this.body.some(x => x.positionsEqual(headPosition));
  }

  public get leftPositions(): Position[] {
    const mostLeftPosition = this.body.sort((a, b) => a.posX - b.posX)[0];
    return this.body.filter(x => x.posX === mostLeftPosition.posX);
  }

  public get rightPositions(): Position[] {
    const mostRightPosition = this.body.sort((a, b) => b.posX - a.posX)[0];
    return this.body.filter(x => x.posX === mostRightPosition.posX);
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
