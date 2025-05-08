using LibraryManagement.Core;
using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.ViewModel.Author;
using LibraryManagement.Infrastructure.ViewModel.Category;
using LibraryManagement.Infrastructure.ViewModel.Inventory;
using LibraryManagement.Infrastructure.ViewModel.Publisher;

namespace LibraryManagement.Infrastructure.ViewModel.Book;

public class BookViewModel
{
    /// <summary>
        /// Unique identifier for the book
        /// </summary>
        public string BookId { get; set; }
        
        /// <summary>
        /// Title of the book
        /// </summary>
        public string Title { get; set; }
        
        /// <summary>
        /// International Standard Book Number
        /// </summary>
        public string ISBN { get; set; }
        
        /// <summary>
        /// Date when the book was published
        /// </summary>
        public DateTime? PublicationDate { get; set; }
        
        /// <summary>
        /// ID of the publisher of the book
        /// </summary>
        public string PublisherId { get; set; }
        
        /// <summary>
        /// ID of the category the book belongs to
        /// </summary>
        public string CategoryId { get; set; }
        
        /// <summary>
        /// Total number of copies of the book owned by the library
        /// </summary>
        public int TotalCopies { get; set; }
        
        /// <summary>
        /// Number of copies currently available for borrowing
        /// </summary>
        public int AvailableCopies { get; set; }
        
        /// <summary>
        /// Physical location of the book in the library
        /// </summary>
        public string LocationInLibrary { get; set; }
        
        /// <summary>
        /// Date when the book was added to the library's collection
        /// </summary>
        public DateTime AddedDate { get; set; }
        
        /// <summary>
        /// Current status of the book (Available, Reserved, Maintenance)
        /// </summary>
        public string Status { get; set; }
        
        /// <summary>
        /// Edition of the book
        /// </summary>
        public string Edition { get; set; }
        
        /// <summary>
        /// Description or summary of the book
        /// </summary>
        public string Description { get; set; }
        
        /// <summary>
        /// URL to the book's cover image
        /// </summary>
        public string CoverImageUrl { get; set; }
        
        /// <summary>
        /// Navigation property for the publisher
        /// </summary>
        public virtual PublisherViewModel Publisher { get; set; }
        
        /// <summary>
        /// Navigation property for the category
        /// </summary>
        public virtual CategoryViewModel Category { get; set; }
        
        /// <summary>
        /// Collection of authors of this book
        /// </summary>
        public virtual ICollection<AuthorViewModel> Authors { get; set; }
        
        /// <summary>
        /// Collection of copies of this book
        /// </summary>
        public virtual ICollection<InventoryViewModel> BookCopies { get; set; }
        
        /// <summary>
        /// Collection of loans for this book
        /// </summary>
        public virtual ICollection<BookLoan> BookLoans { get; set; }
        
        /// <summary>
        /// Collection of reviews for this book
        /// </summary>
        public virtual ICollection<BookReview> BookReviews { get; set; }
        
        /// <summary>
        /// Collection of reservations for this book
        /// </summary>
        public virtual ICollection<Reservation> Reservations { get; set; }

    public BookViewModel(Core.Entities.Book model)
    {
        BookId = model.BookId;
        Title = model.Title;
        ISBN = model.Isbn;
        PublicationDate = model.PublicationDate?.ToDateTime(TimeOnly.MinValue) ?? DateTime.UtcNow;
        PublisherId = model.PublisherId;
        CategoryId = model.CategoryId;
        TotalCopies = model.TotalCopies;
        AvailableCopies = model.AvailableCopies;
        LocationInLibrary = model.LocationInLibrary;
        AddedDate = model.AddedDate.ToDateTime(TimeOnly.MinValue);
        Status = model.Status;
        Description = model.Description;
        BookCopies = model.BookCopies.Select(p => new InventoryViewModel(p)).ToList();
        if (model.Category is not null)
        {
            Category = new CategoryViewModel(model.Category);
        }
        if (model.Publisher is not null)
        {
            Publisher = new PublisherViewModel(model.Publisher);
        }

        Authors = model.Authors.Select(p => new AuthorViewModel(p)).ToList();
    }
}

public class BookCreateViewModel
{
    /// <summary>
        /// Title of the book
        /// </summary>
        public string Title { get; set; }
        
        /// <summary>
        /// International Standard Book Number
        /// </summary>
        public string ISBN { get; set; }
        
        /// <summary>
        /// Date when the book was published
        /// </summary>
        public DateTime? PublicationDate { get; set; }
        
        /// <summary>
        /// ID of the publisher of the book
        /// </summary>
        public string PublisherId { get; set; }
        
        /// <summary>
        /// ID of the category the book belongs to
        /// </summary>
        public string CategoryId { get; set; }
        
        /// <summary>
        /// Total number of copies of the book
        /// </summary>
        public int TotalCopies { get; set; }
        
        /// <summary>
        /// Number of copies available for borrowing
        /// </summary>
        public int AvailableCopies { get; set; }
        
        /// <summary>
        /// Physical location of the book in the library
        /// </summary>
        public string LocationInLibrary { get; set; }
        
        /// <summary>
        /// Description or summary of the book
        /// </summary>
        public string Description { get; set; }
        
        /// <summary>
        /// Edition of the book
        /// </summary>
        public string Edition { get; set; }
        
        /// <summary>
        /// Date when the book was added to the library
        /// </summary>
        public DateTime AddedDate { get; set; }
        
        /// <summary>
        /// Status of the book (Available, Reserved, etc.)
        /// </summary>
        public string Status { get; set; }

    public Core.Entities.Book toBookTable()
    {
        Core.Entities.Book model = new Core.Entities.Book();
        model.Title = Title;
        model.Isbn = ISBN;
        model.PublicationDate = DateOnly.FromDateTime(PublicationDate ?? DateTime.UtcNow);
        model.PublisherId = PublisherId;
        model.CategoryId = CategoryId;
        model.TotalCopies = TotalCopies;
        model.AvailableCopies = AvailableCopies;
        model.LocationInLibrary = LocationInLibrary;
        model.AddedDate = DateOnly.FromDateTime(AddedDate);
        model.Status = Status;
        model.Description = Description;
        model.Edition = Edition;
        return model;
    }

    public Core.Entities.Book UpdateBookTable(Core.Entities.Book model)
    {
        model.Title = Title;
        model.Isbn = ISBN;
        model.PublicationDate = DateOnly.FromDateTime(PublicationDate ?? DateTime.UtcNow);
        model.PublisherId = PublisherId;
        model.CategoryId = CategoryId;
        model.TotalCopies = TotalCopies;
        model.AvailableCopies = AvailableCopies;
        model.LocationInLibrary = LocationInLibrary;
        model.AddedDate = DateOnly.FromDateTime(AddedDate);
        model.Status = Status;
        model.Description = Description;
        model.Edition = Edition;
        return model;
    }
}

/// <summary>
/// Represents filter criteria for searching books
/// </summary>
public class BookFilter
{
    /// <summary>
    /// Search term for title, author, or ISBN
    /// </summary>
    public string SearchTerm { get; set; }

    /// <summary>
    /// Category ID to filter by
    /// </summary>
    public string CategoryId { get; set; }

    /// <summary>
    /// Author ID to filter by
    /// </summary>
    public string AuthorId { get; set; }

    /// <summary>
    /// Publisher ID to filter by
    /// </summary>
    public string PublisherId { get; set; }

    /// <summary>
    /// Status to filter by (Available, Reserved, etc.)
    /// </summary>
    public string Status { get; set; }

    /// <summary>
    /// Branch ID to filter by
    /// </summary>
    public string BranchId { get; set; }

    /// <summary>
    /// Publication year to filter by
    /// </summary>
    public int? PublicationYear { get; set; }

    /// <summary>
    /// Page number for pagination
    /// </summary>
    public int PageNumber { get; set; } = 1;

    /// <summary>
    /// Number of items per page
    /// </summary>
    public int PageSize { get; set; } = 10;

    /// <summary>
    /// Field to sort by
    /// </summary>
    public string SortBy { get; set; } = "Title";

    /// <summary>
    /// Sort direction (Ascending or Descending)
    /// </summary>
    public string SortDirection { get; set; } = "Ascending";
}