import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { DialogModule } from '@angular/cdk/dialog';

@NgModule({
  declarations: [FooterComponent, InstructionsComponent],
  imports: [CommonModule, DialogModule],
  exports: [FooterComponent, InstructionsComponent, DialogModule],
})
export class SharedModule {}
