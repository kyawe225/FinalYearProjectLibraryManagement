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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { CommonMaterialTableComponent } from '../share/common-material-table/common-material-table.component';
import { CommonDialogTableComponent } from '../share/common-dialog-table/common-dialog-table.component';
import { ReservationAdmin } from '../../model/reservation';
import { ReservationService } from '../../service/reservation.service';
import { BookService } from '../../service/book.service';
import { MemberService } from '../../service/member.service';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-reservation',
  imports: [CommonModule,
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
    ReactiveFormsModule,
    MatDividerModule
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent {
  dataSource = signal<MatTableDataSource<ReservationAdmin>>(new MatTableDataSource<ReservationAdmin>([]));
  displayedColumns = signal<string[]>([
    'id',
    'book_title',
    'member_name',
    'reservation_date',
    'book_availability',
    'status'
  ]);

  loading = signal<boolean>(false);
  books = signal<any[]>([]);
  members = signal<any[]>([]);

  // Filter values
  selectedMember = signal<string>('');
  selectedStatus = signal<string>('');

  statuses = signal<string[]>(['Active', 'Fulfilled', 'Expired', 'Cancelled']);

  // Statistics
  activeReservations = signal<number>(0);
  fulfillReservations = signal<number>(0);
  expiredReservations = signal<number>(0);

  constructor(
    private reservationService: ReservationService,
    private bookService: BookService,
    private memberService: MemberService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loading.set(true);

    forkJoin({
      books: this.bookService.getAll(),
      members: this.memberService.getMembers(),
      reservationStats: this.reservationService.getReservationStatistics()
    }).subscribe({
      next: (result) => {
        this.books.set(result.books.data);
        this.members.set(result.members.data);

        // Update statistics
        this.activeReservations.set(result.reservationStats.active_count || 0);
        this.fulfillReservations.set(result.reservationStats.fulfilled_count || 0);
        this.expiredReservations.set(result.reservationStats.expired_count || 0);

        // Load reservations
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
      member_id: this.selectedMember(),
      status: this.selectedStatus()
    };

    this.reservationService.getReservations(filter).subscribe({
      next: (reservations) => {
        // Enhance reservations with related data
        const enhancedReservations = reservations.map(reservation => {
          const book = this.books().find(b => b.book_id === reservation.book_id);
          const member = this.members().find(m => m.id === reservation.member_id);

          // Calculate expiry date (usually 7 days after reservation)
          const reservationDate = new Date(reservation.reservation_date);
          const expiryDate = new Date(reservationDate);
          expiryDate.setDate(reservationDate.getDate() + 7);

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
    this.loadInitialData();
  }

  handleRowClick(reservation: ReservationAdmin): void {
    this.openReservationDialog('view', reservation);
  }

  handleAddClick(): void {
    this.openReservationDialog('add');
  }

  handleEditClick(reservation: ReservationAdmin): void {
    this.openReservationDialog('edit', reservation);
  }

  handleDeleteClick(reservation: ReservationAdmin): void {
    this.openReservationDialog('delete', reservation);
  }

  handleStatusChange(reservation: ReservationAdmin, status: string): void {
    this.loading.set(true);

    this.reservationService.updateReservationStatus(reservation.id, status).subscribe({
      next: () => {
        this.snackBar.open(`Reservation status updated to ${status}`, 'Close', {
          duration: 3000
        });
        this.loadInitialData(); // Reload all data to update statistics
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

  handleConvertToLoan(reservation: ReservationAdmin): void {
    // Check if book is available
    const book = this.books().find(b => b.book_id === reservation.book_id);

    if (!book || book.available_copies <= 0) {
      this.snackBar.open('Cannot convert to loan: Book is currently unavailable', 'Close', {
        duration: 3000
      });
      return;
    }

    this.loading.set(true);

    this.reservationService.convertToLoan(reservation.id).subscribe({
      next: () => {
        this.loading.set(false);
        this.snackBar.open('Reservation converted to loan successfully', 'Close', {
          duration: 3000
        });
        this.loadInitialData(); // Reload all data to update statistics
      },
      error: (error) => {
        console.error('Error converting reservation to loan:', error);
        this.loading.set(false);
        this.snackBar.open('Error converting reservation to loan. Please try again.', 'Close', {
          duration: 3000
        });
      }
    });
  }

  openReservationDialog(action: 'add' | 'edit' | 'view' | 'delete', reservation?: ReservationAdmin): void {
    const formFields: DialogFieldConfig[] = [
      {
        name: 'book_id',
        label: 'Book',
        type: 'select',
        required: true,
        options: this.books().map(book => ({
          value: book.book_id,
          label: book.title
        }))
      },
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
          reservation_date: new Date().toISOString().split('T')[0]
        },
        action: action
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result || result.action === 'cancel') {
        return;
      }

      let operation: Observable<any>;

      switch (action) {
        case 'add':
          operation = this.reservationService.createReservation(result.data);
          break;
        case 'edit':
          operation = this.reservationService.updateReservation({
            ...result.data,
            id: reservation?.id
          });
          break;
        case 'delete':
          operation = this.reservationService.deleteReservation(reservation?.id || '');
          break;
        default:
          return;
      }

      this.loading.set(true);

      operation.subscribe({
        next: () => {
          this.loading.set(false);

          const message = action === 'add' ? 'Reservation created successfully' :
            action === 'edit' ? 'Reservation updated successfully' :
              'Reservation deleted successfully';

          this.snackBar.open(message, 'Close', {
            duration: 3000
          });

          this.loadInitialData(); // Reload all data to update statistics
        },
        error: (error) => {
          console.error(`Error ${action} reservation:`, error);
          this.loading.set(false);

          this.snackBar.open(`Error ${action === 'add' ? 'creating' :
            action === 'edit' ? 'updating' :
              'deleting'} reservation. Please try again.`, 'Close', {
            duration: 3000
          });
        }
      });
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'status-active';
      case 'Fulfilled':
        return 'status-fulfilled';
      case 'Expired':
        return 'status-expired';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getAvailabilityClass(availability: string): string {
    return availability === 'Available' ? 'availability-available' : 'availability-unavailable';
  }
}
