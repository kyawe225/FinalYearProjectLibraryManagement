import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { CommonMaterialTableComponent } from '../share/common-material-table/common-material-table.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { DialogFieldConfig } from '../../model/crud-dialog-field-config';
import { Fine } from '../../model/latefee';
import { CommonDialogTableComponent } from '../share/common-dialog-table/common-dialog-table.component';
import { MatTableDataSource } from '@angular/material/table';
import { BookLoansService } from '../../service/book-loan.service';
import { MemberService } from '../../service/member.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FineService } from '../../service/fine.service';

@Component({
  selector: 'app-latefee-management',
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
  templateUrl: './latefee-management.component.html',
  styleUrl: './latefee-management.component.scss'
})
export class LatefeeManagementComponent {
  dataSource = signal<MatTableDataSource<Fine>>(new MatTableDataSource<Fine>([]));
  displayedColumns = signal<string[]>([
    'fine_id',
    'member_name',
    'book_title',
    'fine_amount',
    'fine_date',
    'days_overdue',
    'payment_status'
  ]);

  loading = signal<boolean>(false);
  loans = signal<any[]>([]);
  members = signal<any[]>([]);

  // Filter values
  selectedMember = signal<string>('');
  selectedStatus = signal<string>('');

  paymentStatuses = signal<string[]>(['Unpaid', 'Paid', 'Waived']);

  // Statistics
  totalUnpaidFines = signal<number>(0);
  totalPaidFines = signal<number>(0);
  totalWaivedFines = signal<number>(0);

  constructor(
    private fineService: FineService,
    private loanService: BookLoansService,
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
      members: this.memberService.getMembers(),
      loans: this.loanService.getBookLoans(),
      fineStats: this.fineService.getFineStatistics()
    }).subscribe({
      next: (result) => {
        this.members.set(result.members.data);
        this.loans.set(result.loans.data);

        // Update statistics
        this.totalUnpaidFines.set(result.fineStats.unpaid_total || 0);
        this.totalPaidFines.set(result.fineStats.paid_total || 0);
        this.totalWaivedFines.set(result.fineStats.waived_total || 0);

        // Load fines
        this.loadFines();
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

  loadFines(): void {
    this.loading.set(true);

    // Build filter
    const filter = {
      member_id: this.selectedMember(),
      payment_status: this.selectedStatus()
    };

    this.fineService.getFines(filter).subscribe({
      next: (fines) => {
        // Enhance fines with related data
        const enhancedFines = fines.map(fine => {
          const member = this.members().find(m => m.id === fine.member_id);
          const loan = this.loans().find(l => l.loan_id === fine.loan_id);

          return {
            ...fine,
          };
        });

        this.dataSource.set(new MatTableDataSource(enhancedFines));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading fines:', error);
        this.loading.set(false);
        this.snackBar.open('Error loading fines. Please try again later.', 'Close', {
          duration: 3000
        });
      }
    });
  }

  calculateDaysOverdue(dueDate: Date, fineDate: string): number {
    const fineDateObj = new Date(fineDate);
    const diffTime = Math.abs(fineDateObj.getTime() - dueDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  onFilterChange(): void {
    this.loadFines();
  }

  handleRefresh(): void {
    this.loadInitialData();
  }

  handleRowClick(fine: Fine): void {
    this.openFineDialog('view', fine);
  }

  handleAddClick(): void {
    this.openFineDialog('add');
  }

  handleEditClick(fine: Fine): void {
    this.openFineDialog('edit', fine);
  }

  handleDeleteClick(fine: Fine): void {
    this.openFineDialog('delete', fine);
  }

  handleRecordPayment(fine: Fine): void {
    const formFields: DialogFieldConfig[] = [
      {
        name: 'payment_date',
        label: 'Payment Date',
        type: 'date',
        required: true,
        value: new Date().toISOString().split('T')[0]
      },
      {
        name: 'fine_amount',
        label: 'Payment Amount',
        type: 'number',
        required: true,
        value: fine.fine_amount
      },
      {
        name: 'payment_method',
        label: 'Payment Method',
        type: 'select',
        required: true,
        options: [
          { value: 'Cash', label: 'Cash' },
          { value: 'Credit Card', label: 'Credit Card' },
          { value: 'Debit Card', label: 'Debit Card' },
          { value: 'Online', label: 'Online' }
        ],
        value: 'Cash'
      },
      {
        name: 'notes',
        label: 'Notes',
        type: 'textarea',
        required: false
      }
    ];

    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '500px',
      data: {
        title: 'Record Payment',
        submitButtonText: 'Save Payment',
        formFields: formFields,
        data: {
          payment_date: new Date().toISOString().split('T')[0],
          fine_amount: fine.fine_amount
        },
        action: 'custom'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result || result.action === 'cancel') {
        return;
      }

      this.loading.set(true);

      this.fineService.recordPayment(
        fine.fine_id,
        result.data.payment_date,
        result.data.fine_amount
      ).subscribe({
        next: () => {
          this.loading.set(false);
          this.snackBar.open('Payment recorded successfully', 'Close', {
            duration: 3000
          });
          this.loadInitialData(); // Reload all data to update statistics
        },
        error: (error) => {
          console.error('Error recording payment:', error);
          this.loading.set(false);
          this.snackBar.open('Error recording payment. Please try again.', 'Close', {
            duration: 3000
          });
        }
      });
    });
  }

  handleWaiveFine(fine: Fine): void {
    const formFields: DialogFieldConfig[] = [
      {
        name: 'reason',
        label: 'Reason for Waiving Fine',
        type: 'textarea',
        required: true
      }
    ];

    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '500px',
      data: {
        title: 'Waive Fine',
        submitButtonText: 'Waive Fine',
        formFields: formFields,
        data: {},
        action: 'custom'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result || result.action === 'cancel') {
        return;
      }

      this.loading.set(true);

      this.fineService.waiveFine(fine.fine_id, result.data.reason).subscribe({
        next: () => {
          this.loading.set(false);
          this.snackBar.open('Fine waived successfully', 'Close', {
            duration: 3000
          });
          this.loadInitialData(); // Reload all data to update statistics
        },
        error: (error) => {
          console.error('Error waiving fine:', error);
          this.loading.set(false);
          this.snackBar.open('Error waiving fine. Please try again.', 'Close', {
            duration: 3000
          });
        }
      });
    });
  }

  openFineDialog(action: 'add' | 'edit' | 'view' | 'delete', fine?: Fine): void {
    const formFields: DialogFieldConfig[] = [
      {
        name: 'loan_id',
        label: 'Book Loan',
        type: 'select',
        required: true,
        options: this.loans()
          .filter(loan => loan.date_returned === null || action !== 'add') // Only show active loans for new fines
          .map(loan => ({
            value: loan.loan_id,
            label: `${loan.book_title || 'Unknown Book'} - ${loan.member_name || 'Unknown Member'}`
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
        })),
        disabled: action === 'edit' || action === 'view' // Can't change member for existing fines
      },
      {
        name: 'fine_amount',
        label: 'Fine Amount',
        type: 'number',
        required: true,
        min: 0,
      },
      {
        name: 'fine_date',
        label: 'Fine Date',
        type: 'date',
        required: true,
        value: new Date().toISOString().split('T')[0]
      },
      {
        name: 'payment_status',
        label: 'Payment Status',
        type: 'select',
        required: true,
        options: this.paymentStatuses().map(status => ({
          value: status,
          label: status
        })),
        value: 'Unpaid'
      },
      {
        name: 'payment_date',
        label: 'Payment Date',
        type: 'date',
        required: false,
        disabled: action === 'add' || (fine && fine.payment_status === 'Unpaid')
      }
    ];

    let dialogTitle = '';
    let submitButtonText = '';

    switch (action) {
      case 'add':
        dialogTitle = 'Add New Fine';
        submitButtonText = 'Add';
        break;
      case 'edit':
        dialogTitle = 'Edit Fine';
        submitButtonText = 'Update';
        break;
      case 'view':
        dialogTitle = 'View Fine Details';
        submitButtonText = 'Close';
        break;
      case 'delete':
        dialogTitle = 'Delete Fine';
        submitButtonText = 'Delete';
        break;
    }

    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: dialogTitle,
        submitButtonText: submitButtonText,
        formFields: formFields,
        data: fine || {
          payment_status: 'Unpaid',
          fine_date: new Date().toISOString().split('T')[0]
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
          // For new fines, if a loan is selected, auto-calculate amount
          if (result.data.loan_id && (!result.data.fine_amount || result.data.fine_amount <= 0)) {
            this.loading.set(true);
            this.fineService.calculateFineForLoan(result.data.loan_id).subscribe({
              next: (calculation) => {
                if (calculation.amount > 0) {
                  result.data.fine_amount = calculation.amount;
                  this.createOrUpdateFine(action, result.data, fine);
                } else {
                  this.loading.set(false);
                  this.snackBar.open('No fine amount calculated. Please enter an amount manually.', 'Close', {
                    duration: 3000
                  });
                }
              },
              error: (error) => {
                console.error('Error calculating fine:', error);
                this.loading.set(false);
                this.snackBar.open('Error calculating fine. Please enter an amount manually.', 'Close', {
                  duration: 3000
                });
              }
            });
          } else {
            this.createOrUpdateFine(action, result.data, fine);
          }
          break;
        case 'edit':
          this.createOrUpdateFine(action, result.data, fine);
          break;
        case 'delete':
          this.loading.set(true);
          this.fineService.deleteFine(fine?.fine_id || '').subscribe({
            next: () => {
              this.loading.set(false);
              this.snackBar.open('Fine deleted successfully', 'Close', {
                duration: 3000
              });
              this.loadInitialData(); // Reload all data to update statistics
            },
            error: (error) => {
              console.error('Error deleting fine:', error);
              this.loading.set(false);
              this.snackBar.open('Error deleting fine. Please try again.', 'Close', {
                duration: 3000
              });
            }
          });
          break;
      }
    });
  }

  createOrUpdateFine(action: 'add' | 'edit', formData: any, existingFine?: Fine): void {
    this.loading.set(true);

    let operation: Observable<any>;

    if (action === 'add') {
      operation = this.fineService.createFine(formData);
    } else {
      operation = this.fineService.updateFine({
        ...formData,
        fine_id: existingFine?.fine_id
      });
    }

    operation.subscribe({
      next: () => {
        this.loading.set(false);

        const message = action === 'add' ? 'Fine created successfully' : 'Fine updated successfully';

        this.snackBar.open(message, 'Close', {
          duration: 3000
        });

        this.loadInitialData(); // Reload all data to update statistics
      },
      error: (error) => {
        console.error(`Error ${action === 'add' ? 'creating' : 'updating'} fine:`, error);
        this.loading.set(false);

        this.snackBar.open(`Error ${action === 'add' ? 'creating' : 'updating'} fine. Please try again.`, 'Close', {
          duration: 3000
        });
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Unpaid':
        return 'status-unpaid';
      case 'Paid':
        return 'status-paid';
      case 'Waived':
        return 'status-waived';
      default:
        return '';
    }
  }
}
