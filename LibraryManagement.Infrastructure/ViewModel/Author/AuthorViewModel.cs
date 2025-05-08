using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Constants;

namespace LibraryManagement.Infrastructure.ViewModel.Author;

public class AuthorViewModel
{
    /// <summary>
    /// Unique identifier for the author
    /// </summary>
    public string AuthorId { get; set; }

    /// <summary>
    /// First name of the author
    /// </summary>
    public string FirstName { get; set; }

    /// <summary>
    /// Last name of the author
    /// </summary>
    public string LastName { get; set; }

    /// <summary>
    /// Biographical information about the author
    /// </summary>
    public string Biography { get; set; }

    /// <summary>
    /// Date of birth of the author
    /// </summary>
    public DateTime? DateOfBirth { get; set; }

    /// <summary>
    /// Full name of the author (calculated property)
    /// </summary>
    public string FullName => $"{FirstName} {LastName}";

    public AuthorViewModel(Core.Entities.Author author)
    {
        AuthorId = author.AuthorId;
        FirstName = author.FirstName;
        LastName = author.LastName;
        Biography = author.Biography;
        DateOfBirth = author.DateOfBirth?.ToDateTime(TimeOnly.MinValue) ?? DateTime.UtcNow;
    }
    public Core.Entities.Author toAuthor()
    {
        var author = new Core.Entities.Author();
        author.AuthorId = Utils.ulid(DbPrefixes.Author);
        author.FirstName = FirstName;
        author.LastName = LastName;
        author.Biography = Biography;
        author.DateOfBirth = DateOnly.FromDateTime(DateOfBirth ?? DateTime.UtcNow);
        return author;
    }

    public Core.Entities.Author updateAuthor(Core.Entities.Author author)
    {
        author.AuthorId = Utils.ulid(DbPrefixes.Author);
        author.FirstName = FirstName;
        author.LastName = LastName;
        author.Biography = Biography;
        author.DateOfBirth = DateOnly.FromDateTime(DateOfBirth ?? DateTime.UtcNow);
        return author;
    }
}