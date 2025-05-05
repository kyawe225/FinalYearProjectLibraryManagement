export interface DialogFieldConfig {
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'password' | 'email' | 'checkbox' | 'time';
    value?: any;
    required?: boolean;
    validators?: any[];
    errorMessage?: string;
    options?: { value: any; label: string }[]; // For select fields
    minLength?: number;
    maxLength?: number;
    min?: number; // For number fields
    max?: number; // For number fields
    disabled?: boolean;
}

export interface CrudDialogData {
    title: string;
    submitButtonText: string;
    formFields: DialogFieldConfig[];
    data?: any; // Original data object
    action: 'create' | 'update' | 'delete' | 'view' ;
}

export interface CrudDialogResult {
    data: any;
    action: 'submit' | 'cancel' | 'delete';
    originalData?: any;
}

