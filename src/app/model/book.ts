import { Publisher } from "./publisher";
import {book_category} from './book_category';
import {author} from './author';

/**
 * Represents a book in the system
 * Maps directly to the books table with joined data
 */
export interface Book {
  // Core fields from books table
  book_id: string;           // book_id character varying(36) NOT NULL
  title: string;            // title character varying(255) NOT NULL
  isbn?: string;            // isbn character varying(20)
  publication_date?: Date;   // publication_date date
  publisher_id?: string;     // publisher_id character varying(36)
  category_id?: string;      // category_id character varying(36)
  total_copies: number;      // total_copies integer DEFAULT 1 NOT NULL
  available_copies: number;  // available_copies integer DEFAULT 1 NOT NULL
  location_in_library?: string; // location_in_library character varying(50)
  added_date: Date;          // added_date date DEFAULT CURRENT_DATE NOT NULL
  status: string;           // status character varying(20) DEFAULT 'Available'

  // Joined fields from related tables
  publisher?: Publisher;    // Joined from publishers table
  category?: book_category;      // Joined from categories table
  authors?: author[];       // Joined from authors table via book_authors
  author_names: string;
  edition : string;

  // UI display fields (not in database)
  cover_image_url?: string;   // URL to book cover image
  related_books?: RelatedBook[]; // Related books for recommendations
  description?: string;     // Book description (not in core table)
}

export interface RelatedBook {
  book_id: string;
  title: string;
  author: string;
  cover_image_url?: string;
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
