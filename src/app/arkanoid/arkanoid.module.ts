import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ArkanoidComponent } from './arkanoid.component';
import { ArkanoidRoutingModule } from './arkanoid.routing';

@NgModule({
  declarations: [ArkanoidComponent],
  imports: [
    ArkanoidRoutingModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ]
})
export class ArkanoidModule { }
