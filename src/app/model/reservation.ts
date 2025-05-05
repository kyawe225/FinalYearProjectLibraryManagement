import { Book } from "./book";
import { User } from "./user";

export interface Reservation {
    id? : string;
    userId: string;
    bookId: string;
    user?: User;
    book?: Book
    AppointDate: Date;
    ApprovedDate?: Date;
    Approver?: string;
    Status: string;
}

export interface ReservationCreate {
    userId: string;
    bookId: string;
    AppointDate: Date;
}


export interface Appointment {
    appointment_id: string;
    member_id: string;
    staff_id: string;
    appointment_date: Date;
    start_time: string;
    end_time: string;
    purpose: string;
    notes?: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show' | 'In Progress';
    branch_id?: string;
    created_date: Date;
    modified_date?: Date;

    // Joined data
    member_name?: string;
    staff_name?: string;
    branch_name?: string;
}


// src/app/models/reservation.model.ts

export interface ReservationAdmin {
    id: string;
    book_id: string;
    member_id: string;
    reservation_date: string;
    status: string;
    
    // For display purposes
    book_title?: string;
    member_name?: string;
    book_availability?: string;
    expiry_date?: string;
  }
  
  export interface ReservationFilter {
    member_id?: string;
    book_id?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  }