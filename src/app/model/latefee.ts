export interface Latefee {
    bookId: string;
    userId: string;
    loanDate: Date;
    lastReturnDate: Date;
    returnDate: Date | null;
    Id : string;
    updatedAt :Date;
    createdAt :Date;
}

export interface LatefeeCreateViewModel{
    loanTableId : string;
    amount: number;
    lateDays : number;
}
