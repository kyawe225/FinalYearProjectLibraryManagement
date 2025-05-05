import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pickupnotification-component',
  imports: [
    MatIconModule,
    CommonModule
  ],
  templateUrl: './pickupnotification-component.component.html',
  styleUrl: './pickupnotification-component.component.scss'
})
export class PickupnotificationComponent {
  public data: any = inject(MAT_SNACK_BAR_DATA)
constructor(
    private snackBarRef: MatSnackBarRef<PickupnotificationComponent>
  ) { }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}
