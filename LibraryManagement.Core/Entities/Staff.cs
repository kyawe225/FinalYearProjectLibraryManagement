using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class Staff
{
    public string Id { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Position { get; set; } = null!;

    public string? Department { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public DateOnly DateHired { get; set; }

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string Status { get; set; } = null!;

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual ICollection<LibraryBranch> LibraryBranches { get; set; } = new List<LibraryBranch>();
}
