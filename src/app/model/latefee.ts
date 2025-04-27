export interface Latefee {
    bookId: string;
    userId: string;
    loanDate: Date;
    lastReturnDate: Date;
    returnDate: Date | null;
    id : string;
    updated_at :Date;
    created_at :Date;
}

export interface LatefeeCreateViewModel{
    loan_table_id : string;
    amount: number;
    lateDays : number;
}
