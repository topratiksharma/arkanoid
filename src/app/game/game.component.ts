import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  viewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FooterComponent } from '../shared/footer/footer.component';
import { Game } from './helper-classes/game';
import { Boundaries, ControlState } from '../types/types';
import { CONFIG, CONTROLS } from './contants';
import { Paddle } from './helper-classes/paddle';
import { Ball } from './helper-classes/ball';

@Component({
    selector: 'ark-game',
    imports: [FormsModule, MatIconModule, MatSlideToggleModule, FooterComponent],
    templateUrl: './game.component.html',
    styleUrl: './game.component.scss'
})
export class GameComponent implements AfterViewInit, OnDestroy {
  readonly canvasElement = viewChild.required<ElementRef>('gameCanvas');

  public width = 800;
  public height = 600;

  private context!: CanvasRenderingContext2D;
  private arkanoidGame: Game;
  private ticksPerSecond = 60;
  public isTwoPlayerMode = true;
  public player2Score = 0;
  public player1Score = 0;
  public isPlaying = false;
  public isPaused = false;
  readonly MAX_SPEED = 10;
  readonly speedSegments = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  public ballSpeed = 2;
  public ballCount = 1;
  private interval: ReturnType<typeof setInterval> | undefined;
  private controlState: ControlState = {
    up: false,
    down: false,
    w: false,
    s: false,
  };
  public animationId!: number;

  constructor() {
    this.arkanoidGame = new Game(this.height, this.width);
  }

  public ngAfterViewInit(): void {
    this.context = this.canvasElement().nativeElement.getContext('2d');
    this.drawBackground();
    this.drawPaddles();
  }

  public playGame(): void {
    this.stopLoops();
    this.isPlaying = true;
    this.isPaused = false;
    this.startLoops();
  }

  public pauseGame(): void {
    if (!this.isPlaying || this.isPaused) return;
    this.stopLoops();
    this.isPaused = true;
    this.drawPauseOverlay();
  }

  public resumeGame(): void {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.startLoops();
  }

  private startLoops(): void {
    this.renderFrame();
    this.interval = setInterval(() => {
      this.arkanoidGame.tick(this.controlState, this.isTwoPlayerMode);
    }, 10 / this.ticksPerSecond);
  }

  public resetPlayground(): void {
    this.stopLoops();
    this.player1Score = 0;
    this.player2Score = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.clearAndMoveToDefaultPosition();
    this.drawBackground();
    this.drawPaddles();
  }

  public onPlayingModeChange() {
    this.stopLoops();
    this.player1Score = 0;
    this.player2Score = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.clearAndMoveToDefaultPosition();
  }

  public ngOnDestroy(): void {
    this.stopLoops();
  }

  private stopLoops(): void {
    if (this.interval !== undefined) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
    window.cancelAnimationFrame(this.animationId);
  }

  private renderFrame(): void {
    if (this.arkanoidGame.checkScore()) {
      clearInterval(this.interval);
      this.interval = undefined;
      let scoreMessage = 'Player 1 scored!';
      if (this.arkanoidGame.checkScore() === 'left') {
        scoreMessage = this.isTwoPlayerMode ? 'Player 2 scored!' : 'AI Scored';
        this.player2Score++;
      } else {
        this.player1Score++;
      }
      this.context.fillStyle = CONFIG.TEXT.COLOR;
      this.context.font = '500 28px IBM Plex Mono, monospace';
      this.context.fillText(scoreMessage, this.width / 3 + 10, 300);
      setTimeout(() => {
        this.restartForNextRound();
      }, 500);
      return;
    }

    this.drawBackground();
    this.drawPaddles();
    this.drawBalls();

    this.animationId = window.requestAnimationFrame(() => this.renderFrame());
  }

  @HostListener('window:keydown', ['$event'])
  public keyUp(event: KeyboardEvent): void {
    if (event.code === 'Space' && this.isPlaying) {
      event.preventDefault();
      this.isPaused ? this.resumeGame() : this.pauseGame();
      return;
    }
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

    this.context.setLineDash([6, 14]);
    this.context.strokeStyle = 'rgba(255,255,255,0.06)';
    this.context.lineWidth = 2;
    this.context.beginPath();
    this.context.moveTo(this.width / 2, 0);
    this.context.lineTo(this.width / 2, this.height);
    this.context.stroke();
    this.context.setLineDash([]);
  }

  private drawPaddles() {
    this.drawPlayerPaddle(this.arkanoidGame.player1, CONFIG.PLAYER_1.COLOR);
    this.drawPlayerPaddle(this.arkanoidGame.player2, CONFIG.PLAYER_2.COLOR);
  }

  private drawPlayerPaddle(player: Paddle, color: string): void {
    const bounds: Boundaries = player.getCollisionBoundaries();
    this.context.shadowBlur = 14;
    this.context.shadowColor = color;
    this.context.fillStyle = color;
    this.context.fillRect(
      bounds.left,
      bounds.top,
      player.getWidth(),
      player.getHeight()
    );
    this.context.shadowBlur = 0;
  }

  private drawBalls(): void {
    this.context.shadowBlur = 24;
    this.context.shadowColor = CONFIG.BALL.COLOR;
    this.context.fillStyle = CONFIG.BALL.COLOR;
    for (const ball of this.arkanoidGame.balls) {
      const bounds: Boundaries = ball.getCollisionBoundaries();
      this.context.beginPath();
      this.context.arc(bounds.left, bounds.top, 10, 0, 2 * Math.PI);
      this.context.fill();
    }
    this.context.shadowBlur = 0;
  }

  private drawPauseOverlay(): void {
    this.context.fillStyle = 'rgba(0, 0, 0, 0.55)';
    this.context.fillRect(0, 0, this.width, this.height);

    this.context.textAlign = 'center';
    this.context.fillStyle = '#00f5ff';
    this.context.shadowBlur = 20;
    this.context.shadowColor = '#00f5ff';
    this.context.font = '700 48px IBM Plex Mono, monospace';
    this.context.fillText('PAUSED', this.width / 2, this.height / 2 - 12);
    this.context.font = '400 14px IBM Plex Mono, monospace';
    this.context.fillStyle = 'rgba(255,255,255,0.45)';
    this.context.shadowBlur = 0;
    this.context.fillText('SPACE to resume', this.width / 2, this.height / 2 + 20);
    this.context.textAlign = 'left';
  }

  public restartForNextRound(): void {
    this.clearAndMoveToDefaultPosition();
    this.playGame();
  }

  public setSpeed(level: number): void {
    if (level < 1 || level > this.MAX_SPEED) return;
    this.ballSpeed = level;
    this.arkanoidGame.balls.forEach(b => b.setMaxSpeed(this.ballSpeed));
  }

  public increaseBallSpeed(): void {
    if (this.ballSpeed >= this.MAX_SPEED) return;
    this.ballSpeed++;
    this.arkanoidGame.balls.forEach(b => b.setMaxSpeed(this.ballSpeed));
  }

  public decreaseBallSpeed(): void {
    if (this.ballSpeed <= 1) return;
    this.ballSpeed--;
    this.arkanoidGame.balls.forEach(b => b.setMaxSpeed(this.ballSpeed));
  }

  public increaseBallCount(): void {
    this.ballCount++;
    this.clearAndMoveToDefaultPosition();
    if (this.isPlaying && !this.isPaused) {
      this.stopLoops();
      this.startLoops();
    }
  }

  public decreaseBallCount(): void {
    if (this.ballCount <= 1) return;
    this.ballCount--;
    this.clearAndMoveToDefaultPosition();
    if (this.isPlaying && !this.isPaused) {
      this.stopLoops();
      this.startLoops();
    }
  }

  private repositionPaddles(): void {
    // Spread balls with varied angles so they don't all overlap
    const yRatios = [0.6, -0.4, 0.8, -0.7, 0.3, -0.9, 0.5, -0.6, 0.7, -0.3];
    this.arkanoidGame.balls = Array.from({ length: this.ballCount }, (_, i) =>
      new Ball(
        15,
        15,
        this.ballSpeed,
        { x: this.height / 2, y: this.width / 2 },
        { x: i % 2 === 0 ? 1 : -1, y: yRatios[i % yRatios.length] }
      )
    );
    this.arkanoidGame.player1 = new Paddle(100, 20, 1.5, {
      x: 5,
      y: this.height / 2,
    });
    this.arkanoidGame.player2 = new Paddle(100, 20, 1.5, {
      x: this.width - 5,
      y: this.height / 2,
    });
  }

  private clearAndMoveToDefaultPosition() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.repositionPaddles();
  }
}
