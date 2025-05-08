using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class Event
{
    public string EventId { get; set; } = null!;

    public string EventName { get; set; } = null!;

    public string? Description { get; set; }

    public DateOnly EventDate { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public string? BranchId { get; set; }

    public string? OrganizerId { get; set; }

    public int? MaxAttendees { get; set; }

    public int? CurrentAttendees { get; set; }

    public bool? RegistrationRequired { get; set; }

    public string? EventStatus { get; set; }

    public string EventType { get; set; } = null!;

    public virtual LibraryBranch? Branch { get; set; }

    public virtual ICollection<EventRegistration> EventRegistrations { get; set; } = new List<EventRegistration>();

    public virtual Staff? Organizer { get; set; }
}
