import { ControlState } from '../../types/types';
import { Ball } from './ball';
import { Paddle } from './paddle';

export class Game {
  public balls: Ball[];
  public player1: Paddle;
  public player2: Paddle;

  private height: number;
  private width: number;

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;

    this.balls = [
      new Ball(15, 15, 2, { x: height / 2, y: width / 2 }, { x: 1, y: 1 }),
    ];
    this.player1 = new Paddle(100, 20, 1.5, { x: 5, y: height / 2 });
    this.player2 = new Paddle(100, 20, 1.5, { x: width - 5, y: height / 2 });
  }

  public tick(controlState: ControlState, isTwoPlayerMode: boolean) {
    this.balls.forEach(ball => ball.move());
    this.movePlayer1Paddle(controlState);

    if (isTwoPlayerMode) {
      this.movePlayer2Paddle(controlState);
    } else {
      this.movePlayer2PaddleAuto();
    }
    this.checkCollisions();
  }

  private movePlayer1Paddle(controlState: ControlState) {
    const paddleBounds = this.player1.getCollisionBoundaries();
    if (controlState.w && paddleBounds.top > 0) {
      this.player1.accelerateUp(0.03);
    } else if (controlState.s && paddleBounds.bottom < this.height) {
      this.player1.accelerateDown(0.03);
    } else {
      this.player1.decelerate(0.05);
    }
    this.player1.move();
  }

  private movePlayer2PaddleAuto() {
    // Track the ball closest to player 2 (rightmost x position)
    const target = this.balls.reduce((nearest, ball) =>
      ball.getPosition().x > nearest.getPosition().x ? ball : nearest
    );
    if (target.getPosition().y < this.player2.getPosition().y)
      this.player2.accelerateUp(1);
    else this.player2.accelerateDown(1);
    this.player2.move();
  }

  private movePlayer2Paddle(controlState: ControlState) {
    const paddleBounds = this.player2.getCollisionBoundaries();
    if (controlState.up && paddleBounds.top > 0) {
      this.player2.accelerateUp(0.03);
    } else if (controlState.down && paddleBounds.bottom < this.height) {
      this.player2.accelerateDown(0.03);
    } else {
      this.player2.decelerate(0.05);
    }
    this.player2.move();
  }

  private checkCollisions() {
    const p1Bounds = this.player1.getCollisionBoundaries();
    const p2Bounds = this.player2.getCollisionBoundaries();

    if (p1Bounds.top <= 0 || p1Bounds.bottom >= this.height)
      this.player1.decelerate(1);

    for (const ball of this.balls) {
      const ballBounds = ball.getCollisionBoundaries();

      // Bounce off top/bottom
      if (ballBounds.bottom >= this.height || ballBounds.top <= 0)
        ball.reverseY();

      // Player 1 paddle hit
      if (
        ballBounds.left <= p1Bounds.right &&
        p1Bounds.right - ballBounds.left <= 3 &&
        ballBounds.bottom >= p1Bounds.top &&
        ballBounds.top <= p1Bounds.bottom
      ) {
        ball.reverseX();
        let vsr =
          -(ball.getPosition().y - this.player1.getPosition().y) /
          (p1Bounds.top - this.player1.getPosition().y);
        vsr = Math.min(vsr, 1);
        ball.setVerticalSpeedRatio(vsr);
      }

      // Player 2 paddle hit
      if (
        ballBounds.right >= p2Bounds.left &&
        ballBounds.right - p2Bounds.left <= 3 &&
        ballBounds.bottom >= p2Bounds.top &&
        ballBounds.top <= p2Bounds.bottom
      ) {
        ball.reverseX();
        let vsr =
          -(ball.getPosition().y - this.player2.getPosition().y) /
          (p2Bounds.top - this.player2.getPosition().y);
        vsr = Math.min(vsr, 1);
        ball.setVerticalSpeedRatio(vsr);
      }
    }
  }

  public checkScore(): 'left' | 'right' | false {
    for (const ball of this.balls) {
      const bounds = ball.getCollisionBoundaries();
      if (bounds.left <= 0) return 'left';
      if (bounds.right >= this.width) return 'right';
    }
    return false;
  }
}
