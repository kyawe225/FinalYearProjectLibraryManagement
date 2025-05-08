using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class ComputerSession
{
    public string SessionId { get; set; } = null!;

    public string ComputerId { get; set; } = null!;

    public string MemberId { get; set; } = null!;

    public DateTime StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public string? SessionStatus { get; set; }

    public virtual Computer Computer { get; set; } = null!;

    public virtual Member Member { get; set; } = null!;
}
