using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class BookCopy
{
    public string CopyId { get; set; } = null!;

    public string BookId { get; set; } = null!;

    public string BranchId { get; set; } = null!;

    public DateOnly AcquisitionDate { get; set; }

    public string? CopyStatus { get; set; }

    public string? Condition { get; set; }

    public virtual Book Book { get; set; } = null!;

    public virtual LibraryBranch Branch { get; set; } = null!;
}
