import { Book } from "./book";
import { User } from "./user";

export interface Reservation {
    userId : string;
    bookId : string;
    user: User;
    book: Book
    AppointDate: Date;
    ApprovedDate : Date;
    Approver : string;
    Status : string;
}

export interface ReservationCreate{
    userId : string;
    bookId : string;
    AppointDate: Date;
}
