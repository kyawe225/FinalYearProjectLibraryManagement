// src/app/models/computer-reservation.model.ts

export interface ComputerReservation {
    reservation_id: string;
    computer_id: string;
    member_id: string;
    reservation_date: string;
    start_time: string;
    end_time: string;
    status: string;
    created_date: string;
    
    // For display purposes
    computer_name?: string;
    member_name?: string;
    branch_name?: string;
  }
  
  export interface ComputerReservationFilter {
    computer_id?: string;
    member_id?: string;
    date_from?: string;
    date_to?: string;
    status?: string;
    branch_id?: string;
  }