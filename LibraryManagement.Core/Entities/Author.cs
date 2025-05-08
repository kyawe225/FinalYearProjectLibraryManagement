using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class Author
{
    public string AuthorId { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? Biography { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}
