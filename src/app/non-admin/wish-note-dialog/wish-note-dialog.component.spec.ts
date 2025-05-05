import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishNoteDialogComponent } from './wish-note-dialog.component';

describe('WishNoteDialogComponent', () => {
  let component: WishNoteDialogComponent;
  let fixture: ComponentFixture<WishNoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishNoteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
