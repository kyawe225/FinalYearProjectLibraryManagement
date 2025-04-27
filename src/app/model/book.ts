import { Publisher } from "./publisher";
import {book_category} from './book_category';
import {author} from './author';

export interface Book {
  added_date: Date;
  author_names?: string | null;
  authors: author[] | null;
  available_copies: number;
  book_id: string;
  category: book_category | null;
  category_id: string | null;
  description: string | null;
  edition: string | null;
  isbn: string | null;
  location_in_library: string | null;
  publication_date: Date | null;
  publisher: Publisher;
  publisher_id: string | null;
  status: string | null;
  title: string;
  total_copies: number;
}

export interface BookCreate {
    title: string;
    isbn?: string;
    publication_date?: Date; // DateOnly becomes string in TypeScript
    publisher_id?: string;
    category_id?: string;
    total_copies: number;
    available_copies: number;
    location_in_library?: Date;
    description : string;
    edition: string;
    added_date: Date; // DateOnly becomes string in TypeScript
    status?: string;
}
