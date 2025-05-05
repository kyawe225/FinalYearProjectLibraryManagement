import { Component, ViewChild } from '@angular/core';
import { CommonMaterialTableComponent } from '../../admin/share/common-material-table/common-material-table.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonDialogTableComponent } from '../../admin/share/common-dialog-table/common-dialog-table.component';
import { Member, MemberAction, MemberCreate } from '../../model/user';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DialogFieldConfig } from '../../model/crud-dialog-field-config';
import { MemberService } from '../../service/member.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-member-management',
  imports: [
    CommonMaterialTableComponent,
    MatIconModule
  ],
  templateUrl: './member-management.component.html',
  styleUrl: './member-management.component.scss'
})
export class MemberManagementComponent {
  members: Member[] = [];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;

  displayedColumns: string[] = [
    'id', 
    'fullName', 
    'email', 
    'phone_number', 
    'membership_date', 
    'membership_expiry', 
    'membership_status'
  ];

  @ViewChild(CommonMaterialTableComponent) table!: CommonMaterialTableComponent;

  constructor(
    private memberService: MemberService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.loading = true;
    this.memberService.getMembers().subscribe({
      next: (members) => {
        this.members = members.data;
        const displayData = members.data.map(member => this.memberService.formatMemberForDisplay(member));
        this.dataSource = new MatTableDataSource(displayData);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading members', error);
        this.snackBar.open('Failed to load members', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onRowClick(member: any): void {
    this.openMemberDialog('view', member);
  }

  onEditClick(member: any): void {
    this.openMemberDialog('edit', member);
  }

  onDeleteClick(member: any): void {
    this.openCloseAccountDialog(member);
  }

  onCreateMember(): void {
    this.openMemberDialog('create');
  }

  onRefresh(): void {
    this.loadMembers();
  }

  getFormFields(action: MemberAction, data?: any): DialogFieldConfig[] {
    const isReadOnly = action === 'view';
    const isCloseAccount = action === 'close';
    
    return [
      {
        name: 'first_name',
        label: 'First Name',
        type: 'text',
        required: true,
        disabled: isReadOnly || isCloseAccount,
        minLength: 2,
        maxLength: 100,
      },
      {
        name: 'last_name',
        label: 'Last Name',
        type: 'text',
        required: true,
        disabled: isReadOnly || isCloseAccount,
        minLength: 2,
        maxLength: 100,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        disabled: isReadOnly || isCloseAccount,
        maxLength: 100,
      },
      {
        name: 'phone_number',
        label: 'Phone Number',
        type: 'text',
        required: false,
        disabled: isReadOnly || isCloseAccount,
        maxLength: 20,
      },
      {
        name: 'address',
        label: 'Address',
        type: 'textarea',
        required: false,
        disabled: isReadOnly || isCloseAccount,
      },
      {
        name: 'date_of_birth',
        label: 'Date of Birth',
        type: 'date',
        required: false,
        disabled: isReadOnly || isCloseAccount,
      },
      {
        name: 'membership_date',
        label: 'Membership Date',
        type: 'date',
        required: true,
        disabled: isReadOnly || isCloseAccount,
      },
      {
        name: 'membership_expiry',
        label: 'Membership Expiry',
        type: 'date',
        required: false,
        disabled: isReadOnly || isCloseAccount,
      },
      {
        name: 'membership_status',
        label: 'Membership Status',
        type: 'select',
        required: true,
        disabled: isReadOnly || isCloseAccount,
        options: [
          { value: 'Active', label: 'Active' },
          { value: 'Pending', label: 'Pending' },
          { value: 'Suspended', label: 'Suspended' },
          { value: 'Expired', label: 'Expired' }
        ],
      }
    ];
  }

  formatDateForApi(dateString: string | Date | null): Date | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date;
  }

  prepareDataForApi(data: any): MemberCreate {
    return {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone_number: data.phone_number || null,
      address: data.address || null,
      date_of_birth: this.formatDateForApi(data.date_of_birth),
      membership_date: this.formatDateForApi(data.membership_date),
      membership_expiry: this.formatDateForApi(data.membership_expiry),
      membership_status: data.membership_status || 'Pending'
    };
  }

  openMemberDialog(action: MemberAction, data?: any): void {
    const dialogTitle = action === 'create' 
      ? 'Create New Member' 
      : action === 'edit' 
        ? 'Edit Member' 
        : 'View Member Details';
        
    const submitButtonText = action === 'create' 
      ? 'Create' 
      : action === 'edit' 
        ? 'Update' 
        : 'Close';
        
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: dialogTitle,
        submitButtonText: submitButtonText,
        action: action,
        formFields: this.getFormFields(action, data),
        data: data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        const memberData = this.prepareDataForApi(result.data);
        
        if (action === 'create') {
          this.memberService.createMember(memberData).subscribe({
            next: (response) => {
              if (response) {
                this.snackBar.open('Member created successfully', 'Close', { duration: 3000 });
                this.loadMembers();
              }
            },
            error: (error) => {
              console.error('Error creating member', error);
              this.snackBar.open('Failed to create member', 'Close', { duration: 3000 });
            }
          });
        } else if (action === 'edit') {
          this.memberService.updateMember(data.id, memberData).subscribe({
            next: (response) => {
              if (response) {
                this.snackBar.open('Member updated successfully', 'Close', { duration: 3000 });
                this.loadMembers();
              }
            },
            error: (error) => {
              console.error('Error updating member', error);
              this.snackBar.open('Failed to update member', 'Close', { duration: 3000 });
            }
          });
        }
      }
    });
  }

  openCloseAccountDialog(member: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Close Member Account',
        message: `Are you sure you want to close the account for ${member.first_name} ${member.last_name}? This action cannot be undone.`,
        confirmButton: 'Close Account',
        cancelButton: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.memberService.closeMemberAccount(member.id).subscribe({
          next: (success) => {
            if (success) {
              this.snackBar.open('Account closed successfully', 'Close', { duration: 3000 });
              this.loadMembers();
            }
          },
          error: (error) => {
            console.error('Error closing account', error);
            this.snackBar.open('Failed to close account', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}
