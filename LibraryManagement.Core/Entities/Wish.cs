using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class Wish
{
    public string WishId { get; set; } = null!;

    public string MemberId { get; set; } = null!;

    public string BookId { get; set; } = null!;

    public DateOnly DateAdded { get; set; }

    public string? Notes { get; set; }

    public virtual Book Book { get; set; } = null!;

    public virtual Member Member { get; set; } = null!;
}
