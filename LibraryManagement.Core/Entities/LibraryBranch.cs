using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class LibraryBranch
{
    public string Id { get; set; } = null!;

    public string BranchName { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? ManagerId { get; set; }

    public string? OpeningHours { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<BookCopy> BookCopies { get; set; } = new List<BookCopy>();

    public virtual ICollection<Computer> Computers { get; set; } = new List<Computer>();

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual Staff? Manager { get; set; }
}
