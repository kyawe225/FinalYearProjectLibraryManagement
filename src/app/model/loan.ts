export interface Loan {
    bookId: string;
    userId: string;
    Id : string;
    updatedAt :Date;
    createdAt :Date;
}

export interface LoanCreateViewModel{
    bookId: string;
    userId: string;
    loanDate: Date;
}
