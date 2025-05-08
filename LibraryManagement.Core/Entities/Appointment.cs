using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class Appointment
{
    public string AppointmentId { get; set; } = null!;

    public string MemberId { get; set; } = null!;

    public string StaffId { get; set; } = null!;

    public DateOnly AppointmentDate { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public string Purpose { get; set; } = null!;

    public string? Notes { get; set; }

    public string? Status { get; set; }

    public string? BranchId { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public virtual LibraryBranch? Branch { get; set; }

    public virtual Member Member { get; set; } = null!;

    public virtual Staff Staff { get; set; } = null!;
}
