import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatefeeListComponent } from './latefee-list.component';

describe('LatefeeListComponent', () => {
  let component: LatefeeListComponent;
  let fixture: ComponentFixture<LatefeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatefeeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatefeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
