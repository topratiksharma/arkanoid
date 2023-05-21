import { Component } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { InstructionsComponent } from '../instructions/instructions.component';

@Component({
  selector: 'ark-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(public dialog: MatDialog){}
  openInstructions(){
    const dialogRef = this.dialog.open(InstructionsComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
