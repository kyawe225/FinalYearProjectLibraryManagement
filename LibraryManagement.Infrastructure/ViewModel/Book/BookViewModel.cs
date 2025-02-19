using LibraryManagement.Core;
using LibraryManagement.Core.Entity;

namespace LibraryManagement.Infrastructure.ViewModel.Book;

public class BookViewModel
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
    public string Status { get; set; } // Book's current status (active , inactive)
    public string Category { get; set; } // Library classification (Dewey Decimal, Library of Congress)
    public string Edition { get; set; } // Edition of the book (e.g., 1st edition)
    public string Format { get; set; } // Format of the book (e.g., Hardcover, Paperback, eBook)
    public DateTime DateAdded { get; set; } // Date when the book was added to the library
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string Id { set; get; }

    public BookViewModel(Core.Entity.BookTable model)
    {
        Title = model.Title;
        Authors = model.Authors;
        ISBN = model.ISBN;
        Publisher = model.Publisher;
        PublicationYear = model.PublicationYear;
        Genre = model.Genre;
        Language = model.Language;
        PageCount = model.PageCount;
        CoverImage = model.CoverImage;
        Description = model.Description;
        Status = model.Status.ToString();
        Category = model.Category;
        Edition = model.Edition;
        Format = model.Format;
        DateAdded = model.DateAdded;
        CreatedAt = model.CreatedAt;
        UpdatedAt = model.UpdatedAt;
        Id = model.Id;
    }
}

public class BookCreateViewModel
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
    public string Status { get; set; } // Book's current status (active , inactive)
    public string Category { get; set; } // Library classification (Dewey Decimal, Library of Congress)
    public string Edition { get; set; } // Edition of the book (e.g., 1st edition)
    public string Format { get; set; } // Format of the book (e.g., Hardcover, Paperback, eBook)
    public DateTime DateAdded { get; set; } // Date when the book was added to the library

    public BookTable toBookTable()
    {
        BookTable model = new BookTable();
        model.Title = Title;
        model.Authors = Authors;
        model.ISBN = ISBN;
        model.Publisher = Publisher;
        model.PublicationYear = PublicationYear;
        model.Genre = Genre;
        model.Language = Language;
        model.PageCount = PageCount;
        model.CoverImage = CoverImage;
        model.Description = Description;
        model.Status = Utils.ParseEnum<BookStatus>(Status);
        model.Category = Category;
        model.Edition = Edition;
        model.Format = Format;
        model.DateAdded = DateAdded;
        return model;
    }
}

public class BookSearchRequest{
    public string Type;
    public string Title;
    public string Author;
    public string Publisher;
    public string PublicationYear;
    public string Genre;
    public string Category;
    public string page;
    public string pageSize;
}