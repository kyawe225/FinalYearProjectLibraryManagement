import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Appointment } from '../../model/reservation';
import { AppointmentService } from '../../service/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../../model/user';
import { BookLoansService } from '../../service/book-loan.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-appointment-fulfillment',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './appointment-fulfillment.component.html',
  styleUrl: './appointment-fulfillment.component.scss'
})
export class AppointmentFulfillmentComponent {
  appointment: Appointment | null = null;
  member: Member | null = null;
  currentStep = 1;
  memberCheckedIn = false;
  serviceNotesForm: FormGroup;
  loading = false;
  appointmentId: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private appointmentsService: AppointmentService,
    private bookLoansService: BookLoansService
  ) {
    this.serviceNotesForm = this.fb.group({
      notes: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    // this.appointmentId = this.route.snapshot.paramMap.get('id');
    // if (this.appointmentId) {
    //   this.loadAppointment(this.appointmentId);
    // } else {
    //   this.router.navigate(['/appointments']);
    // }
  }

  loadAppointment(id: string): void {
    this.loading = true;
    this.appointmentsService.getAppointmentById(id)
      .subscribe({
        next: (data) => {
          this.appointment = data;
          this.loadMemberDetails(data.member_id);
        },
        error: (error) => {
          console.error('Error loading appointment', error);
          this.loading = false;
        }
      });
  }

  loadMemberDetails(memberId: string): void {
    this.appointmentsService.getMemberById(memberId)
      .subscribe({
        next: (data) => {
          this.member = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading member details', error);
          this.loading = false;
        }
      });
  }

  markMemberArrived(): void {
    this.memberCheckedIn = true;
  }

  startAppointment(): void {
    if (!this.appointmentId) return;
    
    this.loading = true;
    this.appointmentsService.updateAppointmentStatus(this.appointmentId, 'In Progress')
      .subscribe({
        next: () => {
          // Update appointment status locally
          if (this.appointment) {
            this.appointment.status = 'In Progress';
          }
          this.currentStep = 2;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error starting appointment', error);
          this.loading = false;
        }
      });
  }

  markMemberNoShow(): void {
    if (!this.appointmentId) return;
    
    this.loading = true;
    this.appointmentsService.updateAppointmentStatus(this.appointmentId, 'No Show')
      .subscribe({
        next: () => {
          this.router.navigate(['/appointments']);
        },
        error: (error) => {
          console.error('Error marking no-show', error);
          this.loading = false;
        }
      });
  }

  navigateToCreateBookTransaction(): void {
    if (this.appointmentId) {
      this.router.navigate(['/book-transaction/create'], { 
        queryParams: { 
          appointmentId: this.appointmentId 
        } 
      });
    }
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  formatTime(time: string): string {
    // Format time from HH:MM:SS to HH:MM
    return time ? time.substring(0, 5) : '';
  }
}
