import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Arkanoid } from '../helper-classes/arkanoid';
import { Boundaries, ControlState } from '../types/types';
import { CONFIG, CONTROLS } from './constants';

@Component({
  selector: 'arkanoid',
  templateUrl: './arkanoid.component.html',
  styleUrls: ['./arkanoid.component.scss']
})
export class ArkanoidComponent implements AfterViewInit {

  @ViewChild('gameCanvas') canvasElement!: ElementRef

  public width: number = 800;
  public height: number = 600;

  private context!: CanvasRenderingContext2D;
  private arkanoidGame: Arkanoid;
  private ticksPerSecond: number = 60;

  private controlState: ControlState;
  player2Score = 0;
  player1Score = 0;

  constructor() {
    this.arkanoidGame = new Arkanoid(this.height, this.width);
    this.controlState = { upPressed: false, downPressed: false };
  }

  public ngAfterViewInit(): void {
    this.context = this.canvasElement?.nativeElement.getContext('2d');
    this.playGame();

    // Game model ticks 60 times per second. Doing this keeps same game speed
    // on higher FPS environments.
  }

  public playGame() {
    this.renderFrame()
    setInterval(() => this.arkanoidGame.tick(this.controlState), 1 / this.ticksPerSecond);
  }

  private renderFrame(): void {
    // Only run if game still going
    if (this.arkanoidGame.gameOver()) {
      this.context.font = "30px Verdana";
      this.context.fillText("Game Over!", 300, 300); // TODO: Add Over in middle
      setTimeout(() => location.reload(), 500); // DO not reload after 500, instead only start after user play
      return; // Add a user play and pause button - add a reset button.
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
    this.context.fillRect(bounds.left, bounds.top, player1.getWidth(), player1.getHeight());
  }

  private addPlayer2Panel() {
    this.context.fillStyle = CONFIG.PLAYER_2.COLOR;
    let player2 = this.arkanoidGame.player2;
    const bounds: Boundaries = player2.getCollisionBoundaries();
    this.context.fillRect(bounds.left, bounds.top, player2.getWidth(), player2.getHeight());
  }

  private addBall() {
    let ball = this.arkanoidGame.ball;
    const bounds: Boundaries = ball.getCollisionBoundaries();
    this.context.fillStyle = CONFIG.BALL.COLOR;
    this.context.beginPath();
    this.context.arc(bounds.left, bounds.top, 10, 0, 2 * Math.PI);
    this.context.fill();
  }

  public play() {
    throw new Error('Method not implemented.');
  }
}
