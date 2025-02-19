import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishbookUpdateComponent } from './wishbook-update.component';

describe('WishbookUpdateComponent', () => {
  let component: WishbookUpdateComponent;
  let fixture: ComponentFixture<WishbookUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishbookUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishbookUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
