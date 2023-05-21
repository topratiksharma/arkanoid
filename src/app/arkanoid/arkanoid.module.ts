import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ArkanoidComponent } from './arkanoid.component';
import { ArkanoidRoutingModule } from './arkanoid.routing';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [ArkanoidComponent],
  imports: [
    ArkanoidRoutingModule,
    SharedModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    FormsModule,
    MatDialogModule,
  ],
})
export class ArkanoidModule {}
