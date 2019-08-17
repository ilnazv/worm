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

export interface ISize {
  width: number;
  height: number;
}

export class ColoredDot extends Position {
  constructor(posX: number, posY: number, public color: string) {
    super(posX, posY);
  }
}
