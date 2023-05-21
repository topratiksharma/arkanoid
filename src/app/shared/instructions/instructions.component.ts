import { Component } from '@angular/core';
import {  MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ark-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent {

  public rules = [
    "Select game type by toggle switch.",
    "Click on play button to begin the play.",
    "Move your paddle up and down by pressing W(for up) and S(for down), in AI mode.",
    "If playing 2 player mode, first players contros remain same, second player can move his paddle up and down via up and down arrow key.",
    "Click on reset to re-start the game.",
  ]
  constructor(public dialogRef: MatDialogRef<InstructionsComponent>,
  ) {
  }
}
