import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { InstructionsComponent } from './instructions/instructions.component';
@NgModule({
  declarations: [FooterComponent, InstructionsComponent],
  imports: [CommonModule],
  exports: [FooterComponent, InstructionsComponent],
})
export class SharedModule {}
