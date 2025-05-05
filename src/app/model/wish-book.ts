import { Book } from "./book";
import { User } from "./user";

export interface WishBook {
    id: string;
    bookId: string;
    userId: string;
    book ?: Book;
    user?: User;
    createdAt: Date;
    updatedAt: Date;
}


export interface WishBookCreateViewModel{
    bookId : string;
    userId ?: string;
}

export interface WishFilter {
    member_id?: string;
    book_id?: string;
    date_from?: string;
    date_to?: string;
  }