using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class Fine
{
    public string FineId { get; set; } = null!;

    public string LoanId { get; set; } = null!;

    public string MemberId { get; set; } = null!;

    public decimal FineAmount { get; set; }

    public DateOnly FineDate { get; set; }

    public string? PaymentStatus { get; set; }

    public DateOnly? PaymentDate { get; set; }

    public virtual BookLoan Loan { get; set; } = null!;

    public virtual Member Member { get; set; } = null!;
}
