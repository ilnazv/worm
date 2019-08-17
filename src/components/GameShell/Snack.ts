import { Position } from './Models';
import { Canvas } from './Canvas';

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
