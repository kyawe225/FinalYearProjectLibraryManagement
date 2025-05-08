using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class Book
{
    public string BookId { get; set; } = null!;
    public string? Edition { set; get; } = null!;

    public string Title { get; set; } = null!;

    public string? Isbn { get; set; }

    public DateOnly? PublicationDate { get; set; }

    public string? PublisherId { get; set; }

    public string? CategoryId { get; set; }

    public int TotalCopies { get; set; }

    public int AvailableCopies { get; set; }

    public string? LocationInLibrary { get; set; }

    public DateOnly AddedDate { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<BookCopy> BookCopies { get; set; } = new List<BookCopy>();

    public virtual ICollection<BookLoan> BookLoans { get; set; } = new List<BookLoan>();

    public virtual ICollection<BookReview> BookReviews { get; set; } = new List<BookReview>();

    public virtual Category? Category { get; set; }

    public virtual Publishers? Publisher { get; set; }

    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();

    public virtual ICollection<Wish> Wishes { get; set; } = new List<Wish>();

    public virtual ICollection<Author> Authors { get; set; } = new List<Author>();
    public string? Description { get; set; }
}
