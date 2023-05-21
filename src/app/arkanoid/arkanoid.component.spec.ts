import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkanoidComponent } from './arkanoid.component';
import { By } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
  
describe('ArkanoidComponent', () => {
  let component: ArkanoidComponent;
  let fixture: ComponentFixture<ArkanoidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArkanoidComponent],
      imports: [MatSlideToggleModule, SharedModule, MatIconModule, MatDialogModule, FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArkanoidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  describe('POSITIVE test cases', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have a canvas element', () => {
      const canvasElement = fixture.debugElement.query(By.css('canvas'));
      expect(canvasElement).toBeTruthy();
    });

    it('should have a width of 800', () => {
      expect(component.width).toEqual(800);
    });

    it('should have a height of 600', () => {
      expect(component.height).toEqual(600);
    });

    it('should have a ticksPerSecond of 60', () => {
      expect(component['ticksPerSecond']).toEqual(60);
    });

    it('should have a player1Score of 0', () => {
      expect(component.player1Score).toEqual(0);
    });

    it('should have a player2Score of 0', () => {
      expect(component.player2Score).toEqual(0);
    });

    it('should have a controlState object with upPressed and downPressed properties', () => {
      expect(component['controlState']).toEqual({ up: false, down: false, w: false, s: false });
    });

    it('should have a ngAfterViewInit method', () => {
      expect(component.ngAfterViewInit).toBeTruthy();
    });

    it('should have a playGame method', () => {
      expect(component.playGame).toBeTruthy();
    });

    it('should have a resetPlayground method', () => {
      expect(component.resetPlayground).toBeTruthy();
    });

    it('should have a keyUp method', () => {
      expect(component.keyUp).toBeTruthy();
    });

    it('should have a keyDown method', () => {
      expect(component.keyDown).toBeTruthy();
    });

    it('should have a drawBackground method', () => {
      expect(component['drawBackground']).toBeTruthy();
    });

    it('should have a drawPlayer1Paddle method', () => {
      expect(component['drawPlayer1Paddle']).toBeTruthy();
    });

    it('should have a drawPlayer2Paddle method', () => {
      expect(component['drawPlayer2Paddle']).toBeTruthy();
    });

    it('should have a drawBall method', () => {
      expect(component['drawBall']).toBeTruthy();
    });

    it('should have a restartForNextRound method', () => {
      expect(component.restartForNextRound).toBeTruthy();
    });

    it('should have a repositionPaddles method', () => {
      expect(component['repositionPaddles']).toBeTruthy();
    });

  });
  describe('NEGATIVE test cases', () => {

    it('should not have a canvas element with an id of "gameCanvas"', () => {
      const canvasElement = fixture.debugElement.query(By.css('#gameCanvas'));
      expect(canvasElement).toBeFalsy();
    });

    it('should not have a width of 600', () => {
      expect(component.width).not.toEqual(600);
    });

    it('should not have a height of 800', () => {
      expect(component.height).not.toEqual(800);
    });

    it('should not have a ticksPerSecond of 30', () => {
      expect(component['ticksPerSecond']).not.toEqual(30);
    });

    it('should not have a player1Score of 10', () => {
      expect(component.player1Score).not.toEqual(10);
    });

    it('should not have a player2Score of 10', () => {
      expect(component.player2Score).not.toEqual(10);
    });
  });
  describe('EDGE test cases', () => {

    it('should have a canvas element with a width of 800', () => {
      const canvasElement = fixture.debugElement.query(By.css('canvas'));
      expect(canvasElement.nativeElement.width).toEqual(800);
    });

    it('should have a canvas element with a height of 600', () => {
      const canvasElement = fixture.debugElement.query(By.css('canvas'));
      expect(canvasElement.nativeElement.height).toEqual(600);
    });

    it('should have a player1Score of 0 at the start of the game', () => {
      expect(component.player1Score).toEqual(0);
    });

    it('should have a player2Score of 0 at the start of the game', () => {
      expect(component.player2Score).toEqual(0);
    });

    it('should have a controlState object with upPressed and downPressed properties set to false at the start of the game', () => {
      expect(component['controlState']).toEqual({ up: false, down: false, w: false, s: false });
    });

    it('should have a player1 object with a width of 20', () => {
      const player1 = component['arkanoidGame'].player1;
      expect(player1.getWidth()).toEqual(20);
    });

    it('should have a player2 object with a width of 20', () => {
      const player2 = component['arkanoidGame'].player2;
      expect(player2.getWidth()).toEqual(20);
    });

    it('should have a ball object with a starting position of { x: 300, y: 400 }', () => {
      const ball = component['arkanoidGame'].ball;
      expect(ball.getPosition()).toEqual({ x: 300, y: 400 });
    });

    it('should have a player1 object with a starting position of { x: 5, y: 300 }', () => {
      const player1 = component['arkanoidGame'].player1;
      expect(player1.getPosition()).toEqual({ x: 5, y: 300 });
    });

    it('should have a player2 object with a starting position of { x: 795, y: 300 }', () => {
      const player2 = component['arkanoidGame'].player2;
      expect(player2.getPosition()).toEqual({ x: 795, y: 300 });
    });
  });
});