import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { Game } from './helper-classes/game';
import { Boundaries, ControlState } from '../types/types';
import { CONFIG, CONTROLS } from './contants';
import { Paddle } from './helper-classes/paddle';
import { Ball } from './helper-classes/ball';

@Component({
  selector: 'ark-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements AfterViewInit {
  @ViewChild('gameCanvas')
  canvasElement!: ElementRef;

  public width = 800;
  public height = 600;

  private context!: CanvasRenderingContext2D;
  private GameGame: Game;
  private ticksPerSecond = 60;
  public isTwoPlayerMode = true; // Default to 2-player mode
  public player2Score = 0;
  public player1Score = 0;
  public interval:any;
  private controlState: ControlState = {
    up: false,
    down: false,
    w: false,
    s: false,
  };

  constructor() {
    this.GameGame = new Game(this.height, this.width);
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
      this.GameGame.tick(this.controlState, this.isTwoPlayerMode);
    }, 1 / this.ticksPerSecond);
  }

  public resetPlayground(): void {
    location.reload();
  }

  public onPlayingModeChange() {
    this.clearAndMoveToDefaultPosition();
    this.player1Score = 0;
    this.player2Score = 0;
    clearInterval(this.interval);
  }

  private renderFrame(): void {
    if (this.GameGame.checkScore()) {
      clearInterval(this.interval);
      let scoreMessage = 'Player 1 scored!';
      if (this.GameGame.checkScore() === 'left') {
        scoreMessage = this.isTwoPlayerMode ? 'Player 2 scored!' : 'AI Scored';
        this.player2Score++;
      } else {
        this.player1Score++;
      }
      this.context.fillStyle = CONFIG.TEXT.COLOR;
      this.context.font = '25px poppins';
      this.context.fillText(scoreMessage, this.width / 3 + 10, 300);
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
      this.controlState.up = true;
    }
    if (event.code === CONTROLS.DOWN) {
      this.controlState.down = true;
    }
    if (event.code === CONTROLS.W) {
      this.controlState.w = true;
    }
    if (event.code === CONTROLS.S) {
      this.controlState.s = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  public keyDown(event: KeyboardEvent): void {
    if (event.code === CONTROLS.UP) {
      this.controlState.up = false;
    }
    if (event.code === CONTROLS.DOWN) {
      this.controlState.down = false;
    }
    if (event.code === CONTROLS.W) {
      this.controlState.w = false;
    }
    if (event.code === CONTROLS.S) {
      this.controlState.s = false;
    }
  }

  private drawBackground(): void {
    this.context.fillStyle = CONFIG.BACKGROUND_COLOR;
    this.context.fillRect(0, 0, this.width, this.height);
  }

  private drawPlayer1Paddle(): void {
    this.context.fillStyle = CONFIG.PLAYER_1.COLOR;
    const player1 = this.GameGame.player1;
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
    const player2 = this.GameGame.player2;

    const bounds: Boundaries = player2.getCollisionBoundaries();
    this.context.fillRect(
      bounds.left,
      bounds.top,
      player2.getWidth(),
      player2.getHeight()
    );
  }

  private drawBall(): void {
    const ball = this.GameGame.ball;
    const bounds: Boundaries = ball.getCollisionBoundaries();
    this.context.fillStyle = CONFIG.BALL.COLOR;
    this.context.beginPath();
    this.context.arc(bounds.left, bounds.top, 10, 0, 2 * Math.PI);
    this.context.fill();
  }

  public restartForNextRound(): void {
    this.clearAndMoveToDefaultPosition();
    this.playGame();
  }

  private repositionPaddles(): void {
    this.GameGame.ball = new Ball(
      15,
      15,
      2,
      { x: this.height / 2, y: this.width / 2 },
      { x: 1, y: 1 }
    );
    this.GameGame.player1 = new Paddle(100, 20, 1.5, {
      x: 5,
      y: this.height / 2,
    });
    this.GameGame.player2 = new Paddle(100, 20, 1.5, {
      x: this.width - 5,
      y: this.height / 2,
    });
  }

  private clearAndMoveToDefaultPosition() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.repositionPaddles();
  }
}
