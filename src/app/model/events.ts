export interface Events {
    event_id: string;
    event_name: string;
    description?: string;
    event_date: Date;
    start_time: string;
    end_time: string;
    branch_id?: string;
    branch_name?: string; // Not in DB, for display purposes
    organizer_id?: string;
    organizer_name?: string; // Not in DB, for display purposes
    max_attendees?: number;
    current_attendees: number;
    registration_required: boolean;
    event_status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
    event_type: string;
}