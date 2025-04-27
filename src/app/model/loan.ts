export interface Loan {
    loanId: string;
    bookId: string;
    memberId: string;
    dateBorrowed: Date;  // Using Date since TypeScript doesn't have DateOnly
    dueDate: Date;
    dateReturned: Date | null;
    status: string | null;
    fineAmount: number | null;  // Using number for decimal

    // Navigation properties
    // book: BookViewModel;
    // fines: Fine[];
    // member: UserViewModel;
}

export interface LoanCreateViewModel {
    bookId: string;
    memberId: string;
    loanDate: Date;
}
