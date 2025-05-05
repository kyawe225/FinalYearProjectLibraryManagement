
import { Component, OnInit, computed, input, signal } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonMaterialTableComponent } from '../../admin/share/common-material-table/common-material-table.component';
import { Appointment } from '../../model/reservation';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { AppointmentService } from '../../service/appointment.service';


@Component({
  selector: 'app-appointment',
  imports: [
    CommonModule,
    CommonMaterialTableComponent,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss'
})
export class AppointmentComponent {
  // Input for member ID
  memberId = input<string>('');

  // Signals
  loading = signal<boolean>(false);
  appointments = signal<Appointment[]>([]);

  // Computed values
  dataSource = computed(() => new MatTableDataSource<Appointment>(this.appointments()));

  // Table configuration
  displayedColumns: string[] = [
    'appointment_date',
    'time',
    'purpose',
    'staff_name',
    'status'
  ];

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  // Load appointments for the member
  loadAppointments(): void {
    this.loading.set(true);

    this.appointmentService.getAppointmentsByMemberId(this.memberId())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (appointments) => {
          this.appointments.set(appointments);
        },
        error: (error) => {
          console.error('Error loading appointments', error);
          this.snackBar.open('Failed to load appointments. Please try again.', 'Close', {
            duration: 3000
          });
        }
      });
  }

  // Navigate to book transactions page
  viewBookTransactions(appointment: Appointment): void {
    this.router.navigate(['/book-transactions', this.memberId()]);
  }

  // Cancel appointment
  cancelAppointment(appointment: Appointment, event: Event): void {
    event.stopPropagation();

    if (appointment.status !== 'Scheduled') {
      this.snackBar.open('Only scheduled appointments can be cancelled.', 'Close', {
        duration: 3000
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Cancel Appointment',
        message: 'Are you sure you want to cancel this appointment?',
        confirmButton: 'Yes, Cancel',
        cancelButton: 'No, Keep It'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading.set(true);

        this.appointmentService.cancelAppointment(appointment.appointment_id)
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe({
            next: () => {
              this.snackBar.open('Appointment cancelled successfully.', 'Close', {
                duration: 3000
              });
              this.loadAppointments();
            },
            error: (error) => {
              console.error('Error cancelling appointment', error);
              this.snackBar.open('Failed to cancel appointment. Please try again.', 'Close', {
                duration: 3000
              });
            }
          });
      }
    });
  }

  // Format date for display
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'MMM d, yyyy') || '';
  }

  // Format time range
  formatTimeRange(start: string, end: string): string {
    return `${start.substring(0, 5)} - ${end.substring(0, 5)}`;
  }
}
