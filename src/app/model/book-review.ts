/**
 * Interface representing a book review in the library management system
 * Compatible with the database structure from book_reviews table
 */
export interface Review {
  /**
   * Unique identifier for the review 
   * Maps to: review_id character varying(36) NOT NULL
   */
  reviewId: string;

  /**
   * ID of the book being reviewed
   * Maps to: book_id character varying(36) NOT NULL
   */
  bookId: string;

  /**
   * ID of the member who wrote the review
   * Maps to: member_id character varying(36) NOT NULL
   */
  memberId: string;

  /**
   * Numeric rating given to the book (1-5)
   * Maps to: rating integer NOT NULL
   * Constraint: CHECK (((rating >= 1) AND (rating <= 5)))
   */
  rating: number;

  /**
   * Written review content (optional)
   * Maps to: review_text text
   */
  reviewText?: string;

  /**
   * Date when the review was submitted
   * Maps to: review_date date DEFAULT CURRENT_DATE NOT NULL
   */
  reviewDate: Date;

  /**
   * Member's name (not in database, fetched from member table)
   * Used for display purposes only
   */
  memberName?: string;
}

/**
 * Interface for creating a new review
 * Contains only the fields needed for creating a new review
 */
export interface CreateReviewDto {
  /**
   * ID of the book being reviewed
   */
  bookId: string;

  /**
   * Numeric rating given to the book (1-5)
   */
  rating: number;

  /**
   * Written review content (optional)
   */
  reviewText?: string;
}

/**
 * Interface for updating an existing review
 */
export interface UpdateReviewDto {
  /**
   * New rating value (1-5)
   */
  rating?: number;

  /**
   * New review text
   */
  reviewText?: string;
}


// src/app/models/book-review.model.ts

export interface BookReview {
  review_id: string;
  book_id: string;
  member_id: string;
  rating: number;
  review_text: string;
  review_date: string;

  // Additional properties from related tables (for display)
  book_title?: string;
  member_name?: string;
}

export interface BookReviewFilter {
  book_id?: string;
  member_id?: string;
  rating?: number;
  date_from?: string;
  date_to?: string;
}