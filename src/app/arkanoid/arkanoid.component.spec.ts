import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkanoidComponent } from './arkanoid.component';

describe('ArkanoidComponent', () => {
  let component: ArkanoidComponent;
  let fixture: ComponentFixture<ArkanoidComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArkanoidComponent]
    });
    fixture = TestBed.createComponent(ArkanoidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
