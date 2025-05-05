import { Staff } from "./auth";

export interface Branch {
    id?: string;
    branch_name: string;
    address: string;
    phone: string;
    email: string;
    manager_id: string;
    opening_hours: string | null;
    manager ?: Staff;
}
