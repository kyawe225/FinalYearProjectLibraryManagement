import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { CommonMaterialTableComponent } from '../share/common-material-table/common-material-table.component';
import { StaffService } from '../../service/staff.service';
import { Staff } from '../../model/auth';
import { CommonDialogTableComponent } from '../share/common-dialog-table/common-dialog-table.component';
import { DialogFieldConfig } from '../../model/crud-dialog-field-config';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, CommonMaterialTableComponent, MatIconModule],
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.scss']
})
export class StaffManagementComponent implements OnInit {
  // Services
  private staffService = inject(StaffService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Data source
  dataSource = new MatTableDataSource<Staff>([]);
  
  // Table configuration
  displayedColumns: string[] = [
    'first_name', 
    'last_name', 
    'position',
    'department',
    'email', 
    'phone',
    'date_hired',
    'status'
  ];
  loading = false;

  ngOnInit(): void {
    this.loadStaff();
  }

  async loadStaff(): Promise<void> {
    this.loading = true;
    try {
      const staff = (await firstValueFrom(this.staffService.getAll())).data;
      this.dataSource.data = staff;
    } catch (error) {
      this.showNotification('Error loading staff members', 'error');
      console.error('Error loading staff members:', error);
    } finally {
      this.loading = false;
    }
  }

  onAddStaff(): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Add New Staff Member',
        submitButtonText: 'Add Staff',
        action: 'add',
        formFields: this.getStaffFormFields()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        this.createStaff(result.data);
      }
    });
  }

  onEditStaff(staff: Staff): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Edit Staff Member',
        submitButtonText: 'Update Staff',
        action: 'edit',
        data: staff,
        formFields: this.getStaffFormFields(true)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        this.updateStaff(staff.id, result.data);
      }
    });
  }

  onViewStaff(staff: Staff): void {
    this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Staff Details',
        action: 'view',
        data: staff,
        formFields: this.getStaffFormFields()
      }
    });
  }

  onDeleteStaff(staff: Staff): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '400px',
      data: {
        title: 'Delete Staff Member',
        submitButtonText: 'Delete',
        action: 'delete',
        data: staff,
        formFields: [
          {
            name: 'confirmation',
            label: `Are you sure you want to delete staff member "${staff.first_name} ${staff.last_name}"?`,
            type: 'text',
            readonly: true
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'delete') {
        this.deleteStaff(staff.id);
      }
    });
  }

  async createStaff(staffData: any): Promise<void> {
    try {
      await firstValueFrom(this.staffService.create(staffData));
      this.showNotification('Staff member added successfully', 'success');
      this.loadStaff();
    } catch (error) {
      this.showNotification('Error adding staff member', 'error');
      console.error('Error adding staff member:', error);
    }
  }

  async updateStaff(staffId: string, staffData: any): Promise<void> {
    try {
      await firstValueFrom(this.staffService.update(staffId, staffData));
      this.showNotification('Staff member updated successfully', 'success');
      this.loadStaff();
    } catch (error) {
      this.showNotification('Error updating staff member', 'error');
      console.error('Error updating staff member:', error);
    }
  }

  async deleteStaff(staffId: string): Promise<void> {
    try {
      await firstValueFrom(this.staffService.delete(staffId));
      this.showNotification('Staff member deleted successfully', 'success');
      this.loadStaff();
    } catch (error) {
      this.showNotification('Error deleting staff member', 'error');
      console.error('Error deleting staff member:', error);
    }
  }

  getStaffFormFields(isEdit: boolean = false): DialogFieldConfig[] {
    const fields: DialogFieldConfig[] = [
      {
        name: 'first_name',
        label: 'First Name',
        type: 'text',
        required: true,
        minLength: 2,
        maxLength: 100
      },
      {
        name: 'last_name',
        label: 'Last Name',
        type: 'text',
        required: true,
        minLength: 2,
        maxLength: 100
      },
      {
        name: 'position',
        label: 'Position',
        type: 'text',
        required: true,
        maxLength: 100
      },
      {
        name: 'department',
        label: 'Department',
        type: 'text',
        maxLength: 100
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        maxLength: 100
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'text',
        maxLength: 20
      },
      {
        name: 'date_hired',
        label: 'Date Hired',
        type: 'date',
        required: true,
        value: new Date()
      },
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        minLength: 3,
        maxLength: 50
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'suspended', label: 'Suspended' }
        ],
        value: 'active'
      }
    ];

    // Add password field only for new staff, not for editing
    if (!isEdit) {
      fields.push({
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        minLength: 8
      });
    }

    return fields;
  }

  onRefresh(): void {
    this.loadStaff();
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
}