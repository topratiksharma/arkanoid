import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InstructionsComponent } from '../instructions/instructions.component';

@Component({
  selector: 'ark-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  dialog = inject(MatDialog);

  openInstructions() {
    this.dialog.open(InstructionsComponent, {
      width: '555px',
    });
  }
}
