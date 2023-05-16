import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { Arkanoid } from '../helper-classes/arkanoid';
import { Boundaries, ControlState } from '../types/types';
import { CONFIG, CONTROLS } from './contants';
import { Paddle } from '../helper-classes/paddle';
import { Ball } from '../helper-classes/ball';

@Component({
  selector: 'app-arkanoid',
  templateUrl: './arkanoid.component.html',
  styleUrls: ['./arkanoid.component.scss'],
})
export class ArkanoidComponent implements AfterViewInit {
  @ViewChild('gameCanvas')
  canvasElement!: ElementRef;

  public width = 800;
  public height = 600;

  private context!: CanvasRenderingContext2D;
  private arkanoidGame: Arkanoid;
  private ticksPerSecond = 60;

  public player2Score = 0;
  public player1Score = 0;
  private interval: any;
  private controlState: ControlState = { upPressed: false, downPressed: false };

  constructor() {
    this.arkanoidGame = new Arkanoid(this.height, this.width);
  }

  public ngAfterViewInit(): void {
    this.context = this.canvasElement.nativeElement.getContext('2d');
    this.drawBackground();
    this.drawPlayer1Paddle();
    this.drawPlayer2Paddle();
  }

  public playGame(): void {
    this.renderFrame();
    this.interval = setInterval(() => {
      this.arkanoidGame.tick(this.controlState);
    }, 1 / this.ticksPerSecond);
  }

  public resetPlayground(): void {
    location.reload();
  }

  private renderFrame(): void {
    if (this.arkanoidGame.checkScore()) {
      clearInterval(this.interval);
      let scoreMessage = 'Player 1 scored!'
      if (this.arkanoidGame.checkScore() === 'left') {
        scoreMessage = 'Player 2 scored!';
        this.player2Score++
      } else {
        this.player1Score++
      }
      this.context.font = '30px Verdana';
      this.context.fillText(scoreMessage, 250, 300); // TODO: Add Game Over in the middle

      setTimeout(() => {
        this.restartForNextRound();
      }, 500);
      return;
    }

    this.drawBackground();
    this.drawPlayer1Paddle();
    this.drawPlayer2Paddle();
    this.drawBall();

    window.requestAnimationFrame(() => this.renderFrame());
  }

  @HostListener('window:keydown', ['$event'])
  public keyUp(event: KeyboardEvent): void {
    if (event.code === CONTROLS.UP) {
      this.controlState.upPressed = true;
    }
    if (event.code === CONTROLS.DOWN) {
      this.controlState.downPressed = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  public keyDown(event: KeyboardEvent): void {
    if (event.code === CONTROLS.UP) {
      this.controlState.upPressed = false;
    }
    if (event.code === CONTROLS.DOWN) {
      this.controlState.downPressed = false;
    }
  }

  private drawBackground(): void {
    this.context.fillStyle = CONFIG.BACKGROUND_COLOR;
    this.context.fillRect(0, 0, this.width, this.height);
  }

  private drawPlayer1Paddle(): void {
    this.context.fillStyle = CONFIG.PLAYER_1.COLOR;
    const player1 = this.arkanoidGame.player1;
    const bounds: Boundaries = player1.getCollisionBoundaries();
    this.context.fillRect(
      bounds.left,
      bounds.top,
      player1.getWidth(),
      player1.getHeight()
    );
  }

  private drawPlayer2Paddle(): void {
    this.context.fillStyle = CONFIG.PLAYER_2.COLOR;
    const player2 = this.arkanoidGame.player2;

    const bounds: Boundaries = player2.getCollisionBoundaries();
    this.context.fillRect(
      bounds.left,
      bounds.top,
      player2.getWidth(),
      player2.getHeight()
    );
  }

  private drawBall(): void {
    const ball = this.arkanoidGame.ball;
    const bounds: Boundaries = ball.getCollisionBoundaries();
    this.context.fillStyle = CONFIG.BALL.COLOR;
    this.context.beginPath();
    this.context.arc(bounds.left, bounds.top, 10, 0, 2 * Math.PI);
    this.context.fill();
  }

  public restartForNextRound(): void {
    this.context.clearRect(0, 0, this.width, this.height);
    this.repositionPaddles();
    this.playGame();
  }

  private repositionPaddles(): void {
    this.arkanoidGame.ball = new Ball(
      15,
      15,
      2,
      { x: this.height / 2, y: this.width / 2 },
      { x: 1, y: 1 }
    );
    this.arkanoidGame.player1 = new Paddle(100, 20, 1.5, { x: 5, y: this.height / 2 });
    this.arkanoidGame.player2 = new Paddle(100, 20, 1.5, { x: this.width - 5, y: this.height / 2 });
  }
}
