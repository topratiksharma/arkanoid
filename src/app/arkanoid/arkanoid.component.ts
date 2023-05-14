import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Arkanoid } from '../classes/arkanoid';
import { Boundaries, ControlState, Controls } from '../types/types';

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

  constructor() {
    this.arkanoidGame = new Arkanoid(this.height,this.width);
    this.controlState = { upPressed: false, downPressed: false };
  }
  
  public ngAfterViewInit(): void {
    this.context = this.canvasElement?.nativeElement.getContext('2d');
    this.renderFrame();

    // Game model ticks 60 times per second. Doing this keeps same game speed
    // on higher FPS environments.
    setInterval(() => this.arkanoidGame.tick(this.controlState), 1 / this.ticksPerSecond);
  }

  public renderFrame(): void {
    // Only run if game still going
    if (this.arkanoidGame.gameOver()) {
      this.context.font = "30px Verdana";
      this.context.fillText("Game Over!", 50, 50); // TODO: Add Over in middle
      setTimeout(() => location.reload(), 500); // DO not reload after 500, instead only start after user play
      return; // Add a user play and pause button - add a reset button.
    }

    // Draw background
    this.context.fillStyle = 'rgb(0,0,0)';
    this.context.fillRect(0, 0, this.width, this.height);

    // Set to white for game objects
    this.context.fillStyle = 'rgb(255,255,255)';

    let bounds: Boundaries;

    // Draw player paddle
    let paddleObj = this.arkanoidGame.playerPaddle;
    bounds = paddleObj.getCollisionBoundaries();
    this.context.fillRect(bounds.left, bounds.top, paddleObj.getWidth(), paddleObj.getHeight());

    // Draw enemy paddle
    let enemyObj = this.arkanoidGame.enemyPaddle;
    bounds = enemyObj.getCollisionBoundaries();
    this.context.fillRect(bounds.left, bounds.top, enemyObj.getWidth(), enemyObj.getHeight());

    // Draw ball
    let ballObj = this.arkanoidGame.ball;
    bounds = ballObj.getCollisionBoundaries();
    this.context.fillRect(bounds.left, bounds.top, ballObj.getWidth(), ballObj.getHeight());

    // Render next frame
    window.requestAnimationFrame(() => this.renderFrame());
  }

  @HostListener('window:keydown', ['$event'])
  public keyUp(event: KeyboardEvent) {
    if (event.code == Controls.UP) {
      this.controlState.upPressed = true;
    }
    if (event.code == Controls.DOWN) {
      this.controlState.downPressed = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  public keyDown(event: KeyboardEvent) {
    if (event.code == Controls.UP) {
      this.controlState.upPressed = false;
    }
    if (event.code == Controls.DOWN) {
      this.controlState.downPressed = false;
    }
  }
}
