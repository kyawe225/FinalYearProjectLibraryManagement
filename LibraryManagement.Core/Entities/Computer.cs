using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class Computer
{
    public string ComputerId { get; set; } = null!;

    public string ComputerName { get; set; } = null!;

    public string BranchId { get; set; } = null!;

    public string? LocationInLibrary { get; set; }

    public string ComputerType { get; set; } = null!;

    public string? Specifications { get; set; }

    public string? OperatingSystem { get; set; }

    public string? InstalledSoftware { get; set; }

    public DateOnly? AcquisitionDate { get; set; }

    public DateOnly? LastMaintenanceDate { get; set; }

    public string? Status { get; set; }

    public int? TimeLimitMinutes { get; set; }

    public virtual LibraryBranch Branch { get; set; } = null!;

    public virtual ICollection<ComputerReservation> ComputerReservations { get; set; } = new List<ComputerReservation>();

    public virtual ICollection<ComputerSession> ComputerSessions { get; set; } = new List<ComputerSession>();
}
