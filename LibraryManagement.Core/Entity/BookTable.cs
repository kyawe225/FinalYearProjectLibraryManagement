namespace LibraryManagement.Core.Entity;

public class BookTable : BaseTable
{
    public string Title { get; set; } // Title of the book
    public string Authors { get; set; } // Author(s) of the book
    public string ISBN { get; set; } // ISBN of the book
    public string Publisher { get; set; } // Publisher of the book
    public int PublicationYear { get; set; } // Year the book was published
    public string Genre { get; set; } // Genre or category of the book
    public string Language { get; set; } // Language of the book
    public int PageCount { get; set; } // Total number of pages in the book
    public string CoverImage { get; set; } // URL or file path of the book cover image
    public string Description { get; set; } // Description or summary of the book
    public BookStatus Status { get; set; } // Book's current status (active , inactive)
    public string Category { get; set; } // Library classification (Dewey Decimal, Library of Congress)
    public string Edition { get; set; } // Edition of the book (e.g., 1st edition)
    public string Format { get; set; } // Format of the book (e.g., Hardcover, Paperback, eBook)
    public DateTime DateAdded { get; set; } // Date when the book was added to the library
}