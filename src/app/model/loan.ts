export interface BookLoan {
    loan_id: string;
    book_id: string;
    member_id: string;
    date_borrowed: Date;
    due_date: Date;
    date_returned?: Date;
    status: 'Active' | 'Returned' | 'Overdue' | 'Lost';
    fine_amount: number;

    // Joined data
    book_title?: string;
    book_isbn?: string;
    member_name?: string;
}

export interface LoanCreateViewModel {
    bookId: string;
    memberId: string;
    loanDate: Date;
}
