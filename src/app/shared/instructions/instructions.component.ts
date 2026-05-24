import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'ark-instructions',
  standalone: true,
  imports: [NgFor, MatDialogModule],
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss'],
})
export class InstructionsComponent {
  public rules = [
    'Select the game type by toggle switch, Between AI Mode and two player.',
    'Click on the play button to begin.',
    'Move your paddle up and down by pressing W(for up) and S(for down) for player 1.',
    'If playing 2 player mode, first players controls remain same, second player can move their paddle up and down via up and down arrow key.',
    'Click on reset to re-start the game.',
  ];

  constructor(public dialogRef: MatDialogRef<InstructionsComponent>) {}
}
