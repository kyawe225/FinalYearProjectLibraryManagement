using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class EventRegistration
{
    public string RegistrationId { get; set; } = null!;

    public string EventId { get; set; } = null!;

    public string MemberId { get; set; } = null!;

    public DateTime RegistrationDate { get; set; }

    public string? AttendanceStatus { get; set; }

    public virtual Event Event { get; set; } = null!;

    public virtual Member Member { get; set; } = null!;
}
