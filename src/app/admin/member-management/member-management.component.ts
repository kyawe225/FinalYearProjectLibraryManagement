import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

import { firstValueFrom } from 'rxjs';
import { CommonMaterialTableComponent } from '../share/common-material-table/common-material-table.component';
import { MemberService } from '../../service/member.service';
import { Member } from '../../model/user';
import { MatIconModule } from '@angular/material/icon';
import { CommonDialogTableComponent } from '../share/common-dialog-table/common-dialog-table.component';
import { DialogFieldConfig } from '../../model/crud-dialog-field-config';

@Component({
  selector: 'app-member-management',
  standalone: true,
  imports: [CommonModule, CommonMaterialTableComponent,MatIconModule],
  templateUrl: './member-management.component.html',
  styleUrls: ['./member-management.component.scss']
})
export class MemberManagementComponent implements OnInit {
  // Services
  private memberService = inject(MemberService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Data source
  dataSource = new MatTableDataSource<Member>([]);
  
  // Table configuration
  displayedColumns: string[] = [
    'first_name', 
    'last_name', 
    'email', 
    'phone_number',
    'membership_date', 
    'membership_expiry',
    'membership_status'
  ];
  loading = false;

  ngOnInit(): void {
    this.loadMembers();
  }

  async loadMembers(): Promise<void> {
    this.loading = true;
    try {
      const members = await firstValueFrom(this.memberService.getMembers());
      this.dataSource.data = members.data;
    } catch (error) {
      this.showNotification('Error loading members', 'error');
      console.error('Error loading members:', error);
    } finally {
      this.loading = false;
    }
  }

  onAddMember(): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Add New Member',
        submitButtonText: 'Add Member',
        action: 'add',
        formFields: this.getMemberFormFields()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        this.createMember(result.data);
      }
    });
  }

  onEditMember(member: Member): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Edit Member',
        submitButtonText: 'Update Member',
        action: 'edit',
        data: member,
        formFields: this.getMemberFormFields(true)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        this.updateMember(member.id, result.data);
      }
    });
  }

  onViewMember(member: Member): void {
    this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Member Details',
        action: 'view',
        data: member,
        formFields: this.getMemberFormFields()
      }
    });
  }

  onDeleteMember(member: Member): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '400px',
      data: {
        title: 'Delete Member',
        submitButtonText: 'Delete',
        action: 'delete',
        data: member,
        formFields: [
          {
            name: 'confirmation',
            label: `Are you sure you want to delete member "${member.first_name} ${member.last_name}"?`,
            type: 'text',
            readonly: true
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'delete') {
        this.deleteMember(member.id);
      }
    });
  }

  async createMember(memberData: any): Promise<void> {
    try {
      await firstValueFrom(this.memberService.createMember(memberData));
      this.showNotification('Member added successfully', 'success');
      this.loadMembers();
    } catch (error) {
      this.showNotification('Error adding member', 'error');
      console.error('Error adding member:', error);
    }
  }

  async updateMember(memberId: string, memberData: any): Promise<void> {
    try {
      await firstValueFrom(this.memberService.updateMember(memberId, memberData));
      this.showNotification('Member updated successfully', 'success');
      this.loadMembers();
    } catch (error) {
      this.showNotification('Error updating member', 'error');
      console.error('Error updating member:', error);
    }
  }

  async deleteMember(memberId: string): Promise<void> {
    try {
      await firstValueFrom(this.memberService.deleteMember(memberId));
      this.showNotification('Member deleted successfully', 'success');
      this.loadMembers();
    } catch (error) {
      this.showNotification('Error deleting member', 'error');
      console.error('Error deleting member:', error);
    }
  }

  getMemberFormFields(isEdit: boolean = false): DialogFieldConfig[] {
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
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        maxLength: 100
      },
      {
        name: 'phone_number',
        label: 'Phone Number',
        type: 'text',
        maxLength: 20
      },
      {
        name: 'address',
        label: 'Address',
        type: 'textarea'
      },
      {
        name: 'date_of_birth',
        label: 'Date of Birth',
        type: 'date'
      },
      {
        name: 'membership_date',
        label: 'Membership Date',
        type: 'date',
        required: true,
        value: new Date()
      },
      {
        name: 'membership_expiry',
        label: 'Membership Expiry',
        type: 'date'
      },
      {
        name: 'membership_status',
        label: 'Membership Status',
        type: 'select',
        required: true,
        options: [
          { value: 'Active', label: 'Active' },
          { value: 'Expired', label: 'Expired' },
          { value: 'Suspended', label: 'Suspended' },
          { value: 'Pending', label: 'Pending' }
        ],
        value: 'Active'
      }
    ];

    // Add password field only for new members, not for editing
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
    this.loadMembers();
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