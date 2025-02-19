import { Book } from "./book";
import { User } from "./user";

export interface WishBook {
    id: string;
    bookId: string;
    userId: string;
    book: Book;
    user?: User;
    createdAt: Date;
    updatedAt: Date;
}


export interface WishBookCreateViewModel{
    bookId : string;
    userId ?: string;
}