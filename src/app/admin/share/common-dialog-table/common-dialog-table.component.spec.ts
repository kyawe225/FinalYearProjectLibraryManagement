import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDialogTableComponent } from './common-dialog-table.component';

describe('CommonDialogTableComponent', () => {
  let component: CommonDialogTableComponent;
  let fixture: ComponentFixture<CommonDialogTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonDialogTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonDialogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
