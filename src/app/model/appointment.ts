import { Staff } from "./auth";
import { Branch } from "./branch";

export interface Appointment {
    appointment_id: string;
    member_id: string;
    staff_id: string;
    appointment_date: Date;
    start_time: string;
    end_time: string;
    purpose: string;
    notes: string | null;
    status: string;
    branch_id: string;
    created_date: Date;
    modified_date: Date;
    staff: Staff;
    branch: Branch;
  }