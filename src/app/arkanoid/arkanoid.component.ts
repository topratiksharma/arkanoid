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

@Component({
  selector: 'arkanoid',
  templateUrl: './arkanoid.component.html',
  styleUrls: ['./arkanoid.component.scss'],
})
export class ArkanoidComponent implements AfterViewInit {
  @ViewChild('gameCanvas') canvasElement!: ElementRef;

  public width: number = 800;
  public height: number = 600;

  private context!: CanvasRenderingContext2D;
  private arkanoidGame: Arkanoid;
  private ticksPerSecond: number = 60;

  private controlState: ControlState;
  public player2Score = 0;
  public player1Score = 0;
  private interval: any;

  constructor() {
    this.arkanoidGame = new Arkanoid(this.height, this.width);
    this.controlState = { upPressed: false, downPressed: false };
  }

  public ngAfterViewInit(): void {
    this.context = this.canvasElement?.nativeElement.getContext('2d');
    // Draw background
    this.context.fillStyle = CONFIG.BACKGROUND_COLOR;
    this.context.fillRect(0, 0, this.width, this.height);

    // Draw player1 paddle
    this.addPlayer1Panel();

    // Draw player2 paddle
    this.addPlayer2Panel();
  }

  public playGame() {
    this.renderFrame();
    this.interval = setInterval(
      () => this.arkanoidGame.tick(this.controlState),
      1 / this.ticksPerSecond
    );
  }

  public resetPlayground() {
    location.reload();
  }

  private renderFrame(): void {
    // Only run if game still going
    if (this.arkanoidGame.checkScore() === 'left') {
      this.player2Score++;
      this.context.font = '30px Verdana';
      this.context.fillText('Player 2 scored!', 250, 300); // TODO: Add Over in middle
      clearInterval(this.interval);
      return;
    } else if (this.arkanoidGame.checkScore() === 'right') {
      this.player1Score++;
      this.context.font = '30px Verdana';
      this.context.fillText('Player 1 scored!', 250, 300); // TODO: Add Over in middle
      clearInterval(this.interval);
      return;
    }

    // Draw background
    this.context.fillStyle = CONFIG.BACKGROUND_COLOR;
    this.context.fillRect(0, 0, this.width, this.height);

    // Draw player1 paddle
    this.addPlayer1Panel();

    // Draw player2 paddle
    this.addPlayer2Panel();

    // Draw ball
    this.addBall();

    // Render next frame
    window.requestAnimationFrame(() => this.renderFrame());
    this.context.fillStyle = 'rgb(255,255,255)';
  }

  @HostListener('window:keydown', ['$event'])
  public keyUp(event: KeyboardEvent) {
    if (event.code == CONTROLS.UP) {
      this.controlState.upPressed = true;
    }
    if (event.code == CONTROLS.DOWN) {
      this.controlState.downPressed = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  public keyDown(event: KeyboardEvent) {
    if (event.code == CONTROLS.UP) {
      this.controlState.upPressed = false;
    }
    if (event.code == CONTROLS.DOWN) {
      this.controlState.downPressed = false;
    }
  }

  private addPlayer1Panel() {
    this.context.fillStyle = CONFIG.PLAYER_1.COLOR;
    let player1 = this.arkanoidGame.player1;
    const bounds: Boundaries = player1.getCollisionBoundaries();
    this.context.fillRect(
      bounds.left,
      bounds.top,
      player1.getWidth(),
      player1.getHeight()
    );
  }

  private addPlayer2Panel() {
    this.context.fillStyle = CONFIG.PLAYER_2.COLOR;
    let player2 = this.arkanoidGame.player2;
    const bounds: Boundaries = player2.getCollisionBoundaries();
    this.context.fillRect(
      bounds.left,
      bounds.top,
      player2.getWidth(),
      player2.getHeight()
    );
  }

  private addBall() {
    let ball = this.arkanoidGame.ball;
    const bounds: Boundaries = ball.getCollisionBoundaries();
    this.context.fillStyle = CONFIG.BALL.COLOR;
    this.context.beginPath();
    this.context.arc(bounds.left, bounds.top, 10, 0, 2 * Math.PI);
    this.context.fill();
  }
}
