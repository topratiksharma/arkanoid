import { ControlState } from '../../types/types';
import { Ball } from './ball';
import { Paddle } from './paddle';

export class Arkanoid {
  public ball: Ball;
  public player1: Paddle;
  public player2: Paddle;

  private height: number;
  private width: number;

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;

    // Construct game objects
    this.ball = new Ball(
      15,
      15,
      2,
      { x: height / 2, y: width / 2 },
      { x: 1, y: 1 }
    );
    this.player1 = new Paddle(100, 20, 1.5, { x: 5, y: height / 2 });
    this.player2 = new Paddle(100, 20, 1.5, { x: width - 5, y: height / 2 });
  }

  public tick(controlState: ControlState, isTwoPlayerMode: boolean) {
    this.ball.move();
    this.movePlayer1Paddle(controlState);

    if (isTwoPlayerMode) {
      this.movePlayer2Paddle(controlState);
    } else {
      this.movePlayer2PaddleAuto();
    }
    this.checkCollisions();
  }

  private movePlayer1Paddle(controlState: ControlState) {
    // Set acceleration, move player paddle based on input
    var paddleBounds = this.player1.getCollisionBoundaries();
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
    if (this.ball.getPosition().y < this.player2.getPosition().y)
      this.player2.accelerateUp(1);
    else this.player2.accelerateDown(1);
    this.player2.move();
  }

  private movePlayer2Paddle(controlState: ControlState) {
    // Set acceleration, move player paddle based on input
    var paddleBounds = this.player2.getCollisionBoundaries();
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
    // Bounce off top/bottom
    let ballBounds = this.ball.getCollisionBoundaries();
    if (ballBounds.bottom >= this.height || ballBounds.top <= 0)
      this.ball.reverseY();

    let paddleBounds = this.player1.getCollisionBoundaries();

    // Don't let paddle go past boundaries
    if (paddleBounds.top <= 0 || paddleBounds.bottom >= this.height)
      this.player1.decelerate(1);

    // Player paddle hit
    if (
      ballBounds.left <= paddleBounds.right &&
      paddleBounds.right - ballBounds.left <= 3 &&
      ballBounds.bottom >= paddleBounds.top &&
      ballBounds.top <= paddleBounds.bottom
    ) {
      this.ball.reverseX();

      // Set vertical speed ratio by taking ratio of
      // dist(centerOfBall, centerOfPaddle) to dist(topOfPaddle, centerOfPaddle)
      // Negate because pixels go up as we go down :)
      var vsr =
        -(this.ball.getPosition().y - this.player1.getPosition().y) /
        (paddleBounds.top - this.player1.getPosition().y);

      // Max vsr is 1
      vsr = Math.min(vsr, 1);
      this.ball.setVerticalSpeedRatio(vsr);
    }

    // PLAYER-2 paddle hit
    paddleBounds = this.player2.getCollisionBoundaries();
    if (
      ballBounds.right <= paddleBounds.left &&
      paddleBounds.left - ballBounds.right <= 3 &&
      ballBounds.bottom >= paddleBounds.top &&
      ballBounds.top <= paddleBounds.bottom
    ) {
      this.ball.reverseX();

      // Set vertical speed ratio by taking ratio of
      // dist(centerOfBall, centerOfPaddle) to dist(topOfPaddle, centerOfPaddle)
      // Negate because pixels go up as we go down :)
      var vsr =
        -(this.ball.getPosition().y - this.player2.getPosition().y) /
        (paddleBounds.top - this.player2.getPosition().y);

      // Max vsr is 1
      vsr = Math.min(vsr, 1);
      this.ball.setVerticalSpeedRatio(vsr);
    }
  }

  checkScore() {
    const collisionBoundaries = this.ball.getCollisionBoundaries();
    if (collisionBoundaries.left <= 0) {
      return 'left';
    } else if (collisionBoundaries.right >= this.width) {
      return 'right';
    } else return false;
  }
}
