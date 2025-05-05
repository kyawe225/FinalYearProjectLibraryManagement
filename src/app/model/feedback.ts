export interface Feedback {
    name: string,
    email : string,
    feedback : string
}


export interface Notification {
    id: string;
    type: 'appointment' | 'overdue' | 'return' | 'system';
    message: string;
    time: Date;
    read: boolean;
    related_id?: string; // Can be appointment_id, loan_id, etc.
    staff_id?: string;
  }