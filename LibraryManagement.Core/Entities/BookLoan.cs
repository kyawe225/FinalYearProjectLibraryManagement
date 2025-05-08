using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class BookLoan
{
    public string LoanId { get; set; } = null!;

    public string BookId { get; set; } = null!;

    public string MemberId { get; set; } = null!;

    public DateOnly DateBorrowed { get; set; }

    public DateOnly DueDate { get; set; }

    public DateOnly? DateReturned { get; set; }

    public string? Status { get; set; }

    public decimal? FineAmount { get; set; }

    public virtual Book Book { get; set; } = null!;

    public virtual ICollection<Fine> Fines { get; set; } = new List<Fine>();

    public virtual Member Member { get; set; } = null!;
}
