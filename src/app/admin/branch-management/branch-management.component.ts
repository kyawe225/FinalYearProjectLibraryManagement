import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { CommonMaterialTableComponent } from '../share/common-material-table/common-material-table.component';
import { StaffService } from '../../service/staff.service';
import { Branch } from '../../model/branch';
import { Staff } from '../../model/auth';
import { CommonDialogTableComponent } from '../share/common-dialog-table/common-dialog-table.component';
import { DialogFieldConfig } from '../../model/crud-dialog-field-config';
import { BranchService } from '../../service/branch.service';

@Component({
  selector: 'app-branch-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './branch-management.component.html',
  styleUrls: ['./branch-management.component.scss']
})
export class BranchManagementComponent implements OnInit {
  // Services
  private branchService = inject(BranchService);
  private staffService = inject(StaffService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Data sources
  dataSource = new MatTableDataSource<Branch>([]);
  staff: Staff[] = [];
  
  // Table configuration
  displayedColumns: string[] = [
    'branch_name', 
    'address', 
    'phone', 
    'email',
    'manager_name', 
    'opening_hours'
  ];
  loading = false;

  ngOnInit(): void {
    this.loadBranches();
    this.loadStaff();
  }

  async loadBranches(): Promise<void> {
    this.loading = true;
    try {
      const branches = (await firstValueFrom(this.branchService.getAll())).data;
      
      // Add manager names to branches for display
      if (this.staff.length > 0) {
        branches.forEach(branch => {
          if (branch.manager_id) {
            const manager = this.staff.find(s => s.id === branch.manager_id);
            if (manager) {
              branch.manager!.first_name = `${manager.first_name} `;
              branch.manager!.last_name = `${manager.last_name}`;
            }
          }
        });
      }
      
      this.dataSource.data = branches;
    } catch (error) {
      this.showNotification('Error loading branches', 'error');
      console.error('Error loading branches:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadStaff(): Promise<void> {
    try {
      this.staff = (await firstValueFrom(this.staffService.getAll())).data;
    } catch (error) {
      console.error('Error loading staff:', error);
    }
  }

  onAddBranch(): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Add New Branch',
        submitButtonText: 'Add Branch',
        action: 'add',
        formFields: this.getBranchFormFields()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        this.createBranch(result.data);
      }
    });
  }

  onEditBranch(branch: Branch): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Edit Branch',
        submitButtonText: 'Update Branch',
        action: 'edit',
        data: branch,
        formFields: this.getBranchFormFields()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        this.updateBranch(branch.id || '', result.data);
      }
    });
  }

  onViewBranch(branch: Branch): void {
    this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Branch Details',
        action: 'view',
        data: branch,
        formFields: this.getBranchFormFields()
      }
    });
  }

  onDeleteBranch(branch: Branch): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '400px',
      data: {
        title: 'Delete Branch',
        submitButtonText: 'Delete',
        action: 'delete',
        data: branch,
        formFields: [
          {
            name: 'confirmation',
            label: `Are you sure you want to delete branch "${branch.branch_name}"?`,
            type: 'text',
            readonly: true
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'delete') {
        this.deleteBranch(branch.id || '');
      }
    });
  }

  async createBranch(branchData: any): Promise<void> {
    try {
      await firstValueFrom(this.branchService.create(branchData));
      this.showNotification('Branch added successfully', 'success');
      this.loadBranches();
    } catch (error) {
      this.showNotification('Error adding branch', 'error');
      console.error('Error adding branch:', error);
    }
  }

  async updateBranch(branchId: string, branchData: any): Promise<void> {
    try {
      await firstValueFrom(this.branchService.update(branchId, branchData));
      this.showNotification('Branch updated successfully', 'success');
      this.loadBranches();
    } catch (error) {
      this.showNotification('Error updating branch', 'error');
      console.error('Error updating branch:', error);
    }
  }

  async deleteBranch(branchId: string): Promise<void> {
    try {
      await firstValueFrom(this.branchService.delete(branchId));
      this.showNotification('Branch deleted successfully', 'success');
      this.loadBranches();
    } catch (error) {
      this.showNotification('Error deleting branch', 'error');
      console.error('Error deleting branch:', error);
    }
  }

  getBranchFormFields(): DialogFieldConfig[] {
    return [
      {
        name: 'branch_name',
        label: 'Branch Name',
        type: 'text',
        required: true,
        minLength: 2,
        maxLength: 100
      },
      {
        name: 'address',
        label: 'Address',
        type: 'textarea',
        required: true
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'text',
        maxLength: 20
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        maxLength: 100
      },
      {
        name: 'manager_id',
        label: 'Branch Manager',
        type: 'select',
        options: this.staff
          .filter(s => s.position.toLowerCase().includes('manager') || s.position.toLowerCase().includes('librarian'))
          .map(s => ({ value: s.id, label: `${s.first_name} ${s.last_name} (${s.position})` }))
      },
      {
        name: 'opening_hours',
        label: 'Opening Hours',
        type: 'textarea'
      }
    ];
  }

  onRefresh(): void {
    this.loadBranches();
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