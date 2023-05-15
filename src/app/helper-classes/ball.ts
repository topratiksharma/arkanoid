import { Position, SpeedRatio } from '../types/types';
import { MoveableObject } from './moveableObject';

export class Ball extends MoveableObject {
  private speedRatio: SpeedRatio;

  constructor(height: number, width: number, maxSpeed: number, position: Position, speedRatio: SpeedRatio) {
    super(height, width, maxSpeed, position);
    this.speedRatio = speedRatio;
  }

  public reverseX(): void {
    this.speedRatio.x = -this.speedRatio.x;
  }

  public reverseY(): void {
    this.speedRatio.y = -this.speedRatio.y;
  }

  public setVerticalSpeedRatio(verticalSpeedRatio: number): void {
    this.speedRatio.y = verticalSpeedRatio;
  }

  override move(): void {
    super.move(this.speedRatio);
  }
}
