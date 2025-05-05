import { Book } from "./book";

export interface BookLoan {
    loan_id: string;
    book_id: string;
    member_id: string;
    date_borrowed: Date;
    due_date: Date;
    date_returned: Date | null;
    status: string;
    fine_amount: number;
    book: Book;
  }
  