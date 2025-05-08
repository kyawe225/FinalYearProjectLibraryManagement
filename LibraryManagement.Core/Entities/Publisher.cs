using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class Publishers
{
    public string PublisherId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Address { get; set; }

    public string? ContactPerson { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? Website { get; set; }

    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}
