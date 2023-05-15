import { ControlState } from '../types/types';
import { Ball } from './ball';
import { Paddle } from './paddle';

export class Arkanoid {
    public ball: Ball;
    public player1: Paddle;
    public player2: Paddle;

    private height: number
    private width: number;

    constructor(height: number, width: number) {
        this.height = height;
        this.width = width;

        // Construct game objects
        this.ball = new Ball(15, 15, 2, { x: height / 2, y: width / 2 }, { x: 1, y: 1 });
        this.player1 = new Paddle(100, 20, 1.5, { x: 5, y: height / 2 });
        this.player2 = new Paddle(100, 20, 1.5, { x: width - 5, y: height / 2 })
    }

    tick(controlState: ControlState) {
        this.ball.move();
        this.movePlayer1Paddle(controlState)
        this.movePlayer2Paddle();

        this.checkCollisions();
    }

    private movePlayer1Paddle(controlState:any) {

        // Set acceleration, move player paddle based on input
        var paddleBounds = this.player1.getCollisionBoundaries();
        if (controlState.upPressed && paddleBounds.top > 0) {
            this.player1.accelerateUp(.03);
        }

        else if (controlState.downPressed && paddleBounds.bottom < this.height) {
            this.player1.accelerateDown(.03);
        }

        else {
            this.player1.decelerate(.05);
        }
        this.player1.move();

    }

    private movePlayer2Paddle() {
        if (this.ball.getPosition().y < this.player2.getPosition().y)
            this.player2.accelerateUp(1)
        else
            this.player2.accelerateDown(1)

        this.player2.move()

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
        if (ballBounds.left <= paddleBounds.right &&
            paddleBounds.right - ballBounds.left <= 3 &&
            ballBounds.bottom >= paddleBounds.top &&
            ballBounds.top <= paddleBounds.bottom) {
            this.ball.reverseX();

            // Set vertical speed ratio by taking ratio of 
            // dist(centerOfBall, centerOfPaddle) to dist(topOfPaddle, centerOfPaddle)
            // Negate because pixels go up as we go down :)
            var vsr = - (this.ball.getPosition().y - this.player1.getPosition().y)
                / (paddleBounds.top - this.player1.getPosition().y);

            // Max vsr is 1
            vsr = Math.min(vsr, 1);
            this.ball.setVerticalSpeedRatio(vsr);
        }

        // Enemy paddle hit
        paddleBounds = this.player2.getCollisionBoundaries();
        if (ballBounds.right <= paddleBounds.left &&
            paddleBounds.left - ballBounds.right <= 3 &&
            ballBounds.bottom >= paddleBounds.top &&
            ballBounds.top <= paddleBounds.bottom) {
            this.ball.reverseX();

            // Set vertical speed ratio by taking ratio of 
            // dist(centerOfBall, centerOfPaddle) to dist(topOfPaddle, centerOfPaddle)
            // Negate because pixels go up as we go down :)
            var vsr = - (this.ball.getPosition().y - this.player2.getPosition().y)
                / (paddleBounds.top - this.player2.getPosition().y);

            // Max vsr is 1
            vsr = Math.min(vsr, 1);
            this.ball.setVerticalSpeedRatio(vsr);
        }
    }

    gameOver(): boolean {
        var collisionBoundaries = this.ball.getCollisionBoundaries();
        if (this.ball.getCollisionBoundaries().left <= 0 ||
            this.ball.getCollisionBoundaries().right >= this.width) return true;
        else return false;
    }
}
