import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatefeeUpdateComponent } from './latefee-update.component';

describe('LatefeeUpdateComponent', () => {
  let component: LatefeeUpdateComponent;
  let fixture: ComponentFixture<LatefeeUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatefeeUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatefeeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
