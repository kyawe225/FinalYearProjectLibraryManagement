// shared/components/crud-dialog/crud-dialog.component.ts
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

export interface DialogFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'time' | 'timepicker';
  value?: any;
  required?: boolean;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: { value: any; label: string }[];
  errorMessage?: string;
  validators?: any[];
}

export interface CrudDialogData {
  title: string;
  formFields: DialogFieldConfig[];
  data?: any;
  action: 'add' | 'edit' | 'view' | 'delete';
  submitButtonText?: string;
}

interface TimeOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-crud-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './common-dialog-table.component.html',
  styleUrls: ['./common-dialog-table.component.scss']
})
export class CommonDialogTableComponent implements OnInit {
  dialogForm!: FormGroup;
  dialogTitle: string;
  submitButtonText: string;
  formFields: DialogFieldConfig[] = [];
  isReadOnly: boolean = false;
  isDeleteDialog: boolean = false;
  originalData: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CommonDialogTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CrudDialogData
  ) {
    this.dialogTitle = data.title || 'Edit Item';
    this.submitButtonText = data.submitButtonText || 'Save';
    this.formFields = data.formFields || [];
    this.originalData = data.data;
    this.isReadOnly = data.action === 'view';
    this.isDeleteDialog = data.action === 'delete';
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    const formGroupConfig: any = {};
    
    this.formFields.forEach(field => {
      // Get existing value from data if available
      const fieldValue = this.data.data && this.data.data[field.name] !== undefined ? 
                        this.data.data[field.name] : 
                        field.value || (field.type === 'checkbox' ? false : '');
      
      // Build validators array
      let validatorsList: any[] = [];
      
      if (field.required) {
        validatorsList.push(Validators.required);
      }
      
      if (field.minLength) {
        validatorsList.push(Validators.minLength(field.minLength));
      }
      
      if (field.maxLength) {
        validatorsList.push(Validators.maxLength(field.maxLength));
      }
      
      if (field.min !== undefined) {
        validatorsList.push(Validators.min(field.min));
      }
      
      if (field.max !== undefined) {
        validatorsList.push(Validators.max(field.max));
      }
      
      if (field.type === 'email') {
        validatorsList.push(Validators.email);
      }
      
      // Add custom validators if provided
      if (field.validators && field.validators.length) {
        validatorsList = validatorsList.concat(field.validators);
      }
      
      // Create form control with value and validators
      formGroupConfig[field.name] = [{
        value: fieldValue,
        disabled: this.isReadOnly || field.disabled
      }, validatorsList];
    });
    
    this.dialogForm = this.fb.group(formGroupConfig);
  }

  onSubmit(): void {
    if (this.dialogForm.valid) {
      this.dialogRef.close({
        data: this.dialogForm.getRawValue(), // Gets values including disabled fields
        action: 'submit',
        originalData: this.originalData
      });
    }
  }

  onDelete(): void {
    this.dialogRef.close({
      data: this.originalData,
      action: 'delete',
      originalData: this.originalData
    });
  }

  onCancel(): void {
    this.dialogRef.close({
      action: 'cancel'
    });
  }

  // Helper to check if a field has errors
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.dialogForm.get(fieldName);
    return field?.errors?.[errorType] && (field.touched || field.dirty);
  }

  // Helper to get error message
  getErrorMessage(field: DialogFieldConfig): string {
    const formControl = this.dialogForm.get(field.name);
    
    if (!formControl?.errors) {
      return '';
    }
    
    if (formControl.errors['required']) {
      return field.errorMessage || 'This field is required';
    }
    
    if (formControl.errors['minlength']) {
      return `Minimum ${field.minLength} characters required`;
    }
    
    if (formControl.errors['maxlength']) {
      return `Maximum ${field.maxLength} characters allowed`;
    }
    
    if (formControl.errors['min']) {
      return `Minimum value is ${field.min}`;
    }
    
    if (formControl.errors['max']) {
      return `Maximum value is ${field.max}`;
    }
    
    if (formControl.errors['email']) {
      return 'Please enter a valid email address';
    }
    
    return field.errorMessage || 'Invalid input';
  }

  // Generate time options for the timepicker in 30-minute intervals (can be adjusted)
  generateTimeOptions(): TimeOption[] {
    const timeOptions: TimeOption[] = [];
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const h = hour.toString().padStart(2, '0');
        const m = minute.toString().padStart(2, '0');
        
        // 24-hour value (e.g., "14:30")
        const value = `${h}:${m}`;
        
        // Convert to 12-hour format for label
        let displayHour = hour % 12;
        if (displayHour === 0) displayHour = 12;
        const period = hour < 12 ? 'AM' : 'PM';
        
        const label = `${displayHour}:${m} ${period}`;
        
        timeOptions.push({ value, label });
      }
    }
    
    return timeOptions;
  }
}