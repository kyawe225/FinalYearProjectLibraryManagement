import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishbookListComponent } from './wishbook-list.component';

describe('WishbookListComponent', () => {
  let component: WishbookListComponent;
  let fixture: ComponentFixture<WishbookListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishbookListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishbookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
