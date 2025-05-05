// src/app/admin/computer-reservations/computer-reservation-management.component.ts

import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DialogFieldConfig } from '../../model/crud-dialog-field-config';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonMaterialTableComponent } from '../share/common-material-table/common-material-table.component';
import { ComputerReservation } from '../../model/computer-reservation';
import { ComputerService } from '../../service/computer.service';
import { MemberService } from '../../service/member.service';
import { BranchService } from '../../service/branch.service';
import { ComputerReservationService } from '../../service/computer-reservation.service';
import { CommonDialogTableComponent } from '../share/common-dialog-table/common-dialog-table.component';

@Component({
  selector: 'app-computer-reservation-management',
  standalone: true,
  imports: [
    CommonModule,
    CommonMaterialTableComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './computer-reservation-management.component.html',
  styleUrls: ['./computer-reservation-management.component.scss']
})
export class ComputerReservationManagementComponent implements OnInit {
  dataSource = signal<MatTableDataSource<ComputerReservation>>(new MatTableDataSource<ComputerReservation>([]));
  displayedColumns = signal<string[]>([
    'reservation_id',
    'computer_name',
    'member_name',
    'reservation_date',
    'time_slot',
    'status',
    'branch_name'
  ]);
  
  loading = signal<boolean>(false);
  computers = signal<any[]>([]);
  members = signal<any[]>([]);
  branches = signal<any[]>([]);
  
  // Filter values
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  selectedBranch = signal<string>('');
  selectedStatus = signal<string>('');
  
  statuses = signal<string[]>(['Active', 'Completed', 'Cancelled', 'No Show']);
  
  constructor(
    private reservationService: ComputerReservationService,
    private computerService: ComputerService,
    private memberService: MemberService,
    private branchService: BranchService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.loadInitialData();
  }
  
  loadInitialData(): void {
    this.loading.set(true);
    
    forkJoin({
      branches: this.branchService.getAll(),
      computers: this.computerService.getComputers(),
      members: this.memberService.getMembers()
    }).subscribe({
      next: (result) => {
        this.branches.set(result.branches.data);
        this.computers.set(result.computers.data);
        this.members.set(result.members.data);
        
        // Load reservations with initial filters
        this.loadReservations();
      },
      error: (error) => {
        console.error('Error loading initial data:', error);
        this.loading.set(false);
        this.snackBar.open('Error loading data. Please try again later.', 'Close', {
          duration: 3000
        });
      }
    });
  }
  
  loadReservations(): void {
    this.loading.set(true);
    
    // Build filter
    const filter = {
      branch_id: this.selectedBranch(),
      status: this.selectedStatus(),
      date_from: this.selectedDate(),
      date_to: this.selectedDate()
    };
    
    this.reservationService.getComputerReservations(filter).subscribe({
      next: (reservations) => {
        // Enhance reservations with related data
        const enhancedReservations = reservations.map(reservation => {
          const computer = this.computers().find(c => c.computer_id === reservation.computer_id);
          const member = this.members().find(m => m.id === reservation.member_id);
          const branch = computer ? this.branches().find(b => b.id === computer.branch_id) : null;
          
          return {
            ...reservation,
          };
        });
        
        this.dataSource.set(new MatTableDataSource(enhancedReservations));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
        this.loading.set(false);
        this.snackBar.open('Error loading reservations. Please try again later.', 'Close', {
          duration: 3000
        });
      }
    });
  }
  
  onFilterChange(): void {
    this.loadReservations();
  }
  
  handleRefresh(): void {
    this.loadReservations();
  }
  
  handleRowClick(reservation: ComputerReservation): void {
    this.openReservationDialog('view', reservation);
  }
  
  handleAddClick(): void {
    this.openReservationDialog('add');
  }
  
  handleEditClick(reservation: ComputerReservation): void {
    this.openReservationDialog('edit', reservation);
  }
  
  handleDeleteClick(reservation: ComputerReservation): void {
    this.openReservationDialog('delete', reservation);
  }
  
  handleStatusChange(reservation: ComputerReservation, status: string): void {
    this.loading.set(true);
    
    this.reservationService.updateReservationStatus(reservation.reservation_id, status).subscribe({
      next: () => {
        this.snackBar.open(`Reservation status updated to ${status}`, 'Close', {
          duration: 3000
        });
        this.loadReservations();
      },
      error: (error) => {
        console.error('Error updating reservation status:', error);
        this.loading.set(false);
        this.snackBar.open('Error updating reservation status. Please try again.', 'Close', {
          duration: 3000
        });
      }
    });
  }
  
  getAvailableComputers(date: string, startTime: string, endTime: string): Observable<any[]> {
    return this.computerService.getComputers({ status: 'Available' }).pipe(
      switchMap(computers => {
        const availabilityChecks = computers.data.map(computer => 
          this.reservationService.checkOverlap(computer.computer_id, date, startTime, endTime).pipe(
            map(hasOverlap => ({ computer, available: !hasOverlap }))
          )
        );
        
        return forkJoin(availabilityChecks);
      }),
      map(results => results.filter(result => result.available).map(result => result.computer))
    );
  }
  
  openReservationDialog(action: 'add' | 'edit' | 'view' | 'delete', reservation?: ComputerReservation): void {
    // For edit and view, we need the computer data to get branch info
    const computer = reservation ? 
      this.computers().find(c => c.computer_id === reservation.computer_id) : null;
    
    const formFields: DialogFieldConfig[] = [
      {
        name: 'member_id',
        label: 'Member',
        type: 'select',
        required: true,
        options: this.members().map(member => ({
          value: member.id,
          label: `${member.first_name} ${member.last_name}`
        }))
      },
      {
        name: 'reservation_date',
        label: 'Reservation Date',
        type: 'date',
        required: true,
        value: new Date().toISOString().split('T')[0]
      },
      {
        name: 'start_time',
        label: 'Start Time',
        type: 'time',
        required: true,
        value: '09:00'
      },
      {
        name: 'end_time',
        label: 'End Time',
        type: 'time',
        required: true,
        value: '10:00'
      },
      {
        name: 'computer_id',
        label: 'Computer',
        type: 'select',
        required: true,
        options: this.computers()
          .filter(computer => action === 'edit' || action === 'view' || computer.status === 'Available')
          .map(computer => {
            const branch = this.branches().find(b => b.id === computer.branch_id);
            return {
              value: computer.computer_id,
              label: `${computer.computer_name} (${branch ? branch.branch_name : 'Unknown Branch'})`
            };
          })
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: this.statuses().map(status => ({
          value: status,
          label: status
        })),
        value: 'Active'
      }
    ];
    
    let dialogTitle = '';
    let submitButtonText = '';
    
    switch (action) {
      case 'add':
        dialogTitle = 'Add New Reservation';
        submitButtonText = 'Add';
        break;
      case 'edit':
        dialogTitle = 'Edit Reservation';
        submitButtonText = 'Update';
        break;
      case 'view':
        dialogTitle = 'View Reservation Details';
        submitButtonText = 'Close';
        break;
      case 'delete':
        dialogTitle = 'Delete Reservation';
        submitButtonText = 'Delete';
        break;
    }
    
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: dialogTitle,
        submitButtonText: submitButtonText,
        formFields: formFields,
        data: reservation || {
          status: 'Active',
          reservation_date: new Date().toISOString().split('T')[0],
          start_time: '09:00',
          end_time: '10:00'
        },
        action: action
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (!result || result.action === 'cancel') {
        return;
      }
      
      if (action === 'add' || action === 'edit') {
        // Validate time slot
        if (result.data.start_time >= result.data.end_time) {
          this.snackBar.open('End time must be after start time', 'Close', {
            duration: 3000
          });
          return;
        }
        
        // Check for reservation overlaps
        this.loading.set(true);
        
        this.reservationService.checkOverlap(
          result.data.computer_id,
          result.data.reservation_date,
          result.data.start_time,
          result.data.end_time,
          action === 'edit' ? reservation?.reservation_id : undefined
        ).subscribe({
          next: (hasOverlap) => {
            if (hasOverlap) {
              this.loading.set(false);
              this.snackBar.open('This time slot overlaps with an existing reservation', 'Close', {
                duration: 3000
              });
              return;
            }
            
            // Proceed with save
            this.saveReservation(action, result.data, reservation);
          },
          error: (error) => {
            console.error('Error checking time slot overlap:', error);
            this.loading.set(false);
            this.snackBar.open('Error checking time slot availability. Please try again.', 'Close', {
              duration: 3000
            });
          }
        });
      } else if (action === 'delete') {
        this.deleteReservation(reservation!);
      }
    });
  }
  
  saveReservation(action: 'add' | 'edit', formData: any, existingReservation?: ComputerReservation): void {
    let operation: Observable<any>;
    
    if (action === 'add') {
      operation = this.reservationService.createReservation(formData);
    } else {
      operation = this.reservationService.updateReservation({
        ...formData,
        reservation_id: existingReservation?.reservation_id,
        created_date: existingReservation?.created_date
      });
    }
    
    operation.subscribe({
      next: () => {
        this.loading.set(false);
        
        const message = action === 'add' ? 'Reservation created successfully' : 'Reservation updated successfully';
        
        this.snackBar.open(message, 'Close', {
          duration: 3000
        });
        
        this.loadReservations();
      },
      error: (error) => {
        console.error(`Error ${action === 'add' ? 'creating' : 'updating'} reservation:`, error);
        this.loading.set(false);
        
        this.snackBar.open(`Error ${action === 'add' ? 'creating' : 'updating'} reservation. Please try again.`, 'Close', {
          duration: 3000
        });
      }
    });
  }
  
  deleteReservation(reservation: ComputerReservation): void {
    this.loading.set(true);
    
    this.reservationService.deleteReservation(reservation.reservation_id).subscribe({
      next: () => {
        this.loading.set(false);
        this.snackBar.open('Reservation deleted successfully', 'Close', {
          duration: 3000
        });
        this.loadReservations();
      },
      error: (error) => {
        console.error('Error deleting reservation:', error);
        this.loading.set(false);
        this.snackBar.open('Error deleting reservation. Please try again.', 'Close', {
          duration: 3000
        });
      }
    });
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'status-active';
      case 'Completed':
        return 'status-completed';
      case 'Cancelled':
        return 'status-cancelled';
      case 'No Show':
        return 'status-no-show';
      default:
        return '';
    }
  }
  
  formatTimeSlot(startTime: string, endTime: string): string {
    return `${this.formatTime(startTime)} - ${this.formatTime(endTime)}`;
  }
  
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  }
}