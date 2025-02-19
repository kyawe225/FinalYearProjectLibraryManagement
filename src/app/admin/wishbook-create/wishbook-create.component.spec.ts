import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishbookCreateComponent } from './wishbook-create.component';

describe('WishbookCreateComponent', () => {
  let component: WishbookCreateComponent;
  let fixture: ComponentFixture<WishbookCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishbookCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishbookCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
