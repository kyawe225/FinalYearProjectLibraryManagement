import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';


export interface WishNoteDialogData {
  notes : string;
  bookTitle: string;
}

@Component({
  selector: 'app-wish-note-dialog',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatInputModule
  ],
  templateUrl: './wish-note-dialog.component.html',
  styleUrl: './wish-note-dialog.component.scss'
})
export class WishNoteDialogComponent {
  notesControl: FormControl;
  public data: WishNoteDialogData = inject(MAT_DIALOG_DATA);
  
  constructor(
    public dialogRef: MatDialogRef<string>,
    
  ) {
    this.notesControl = new FormControl(this.data.notes, [
      Validators.maxLength(500)
    ]);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.notesControl.valid) {
      this.dialogRef.close(this.notesControl.value);
    }
  }
}
