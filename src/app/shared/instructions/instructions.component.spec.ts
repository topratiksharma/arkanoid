import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstructionsComponent } from './instructions.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogModule } from '@angular/cdk/dialog';

describe('InstructionsComponent', () => {
  let component: InstructionsComponent;
  let fixture: ComponentFixture<InstructionsComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstructionsComponent],
      providers: [{ provide: MatDialogRef, useValue: mockDialogRef }],
      imports: [MatDialogModule, DialogModule],
    });
    fixture = TestBed.createComponent(InstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
