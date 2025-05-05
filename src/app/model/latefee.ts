export interface Fine {
    fine_id: string;
    loan_id: string;
    member_id: string;
    fine_amount: number;
    fine_date: Date;
    payment_status: 'Paid' | 'Unpaid' | 'Waived';
    payment_date?: Date;

    // Joined data
    member_name?: string;
    book_title?: string;
    book_isbn?: string;
    days_overdue?: number;
    due_date?: Date;
}

export interface LatefeeCreateViewModel {
    loan_table_id: string;
    amount: number;
    lateDays: number;
}

export interface FineFilter {
    member_id?: string;
    loan_id?: string;
    payment_status?: string;
    date_from?: string;
    date_to?: string;
    min_amount?: number;
    max_amount?: number;
}