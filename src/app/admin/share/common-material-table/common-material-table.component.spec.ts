import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonMaterialTableComponent } from './common-material-table.component';

describe('CommonMaterialTableComponent', () => {
  let component: CommonMaterialTableComponent;
  let fixture: ComponentFixture<CommonMaterialTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonMaterialTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonMaterialTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
