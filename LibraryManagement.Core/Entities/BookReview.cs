using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class BookReview
{
    public string ReviewId { get; set; } = null!;

    public string BookId { get; set; } = null!;

    public string MemberId { get; set; } = null!;

    public int Rating { get; set; }

    public string? ReviewText { get; set; }

    public DateOnly ReviewDate { get; set; }

    public virtual Book Book { get; set; } = null!;

    public virtual Member Member { get; set; } = null!;
}
