import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatefeeCreateComponent } from './latefee-create.component';

describe('LatefeeCreateComponent', () => {
  let component: LatefeeCreateComponent;
  let fixture: ComponentFixture<LatefeeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatefeeCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatefeeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
