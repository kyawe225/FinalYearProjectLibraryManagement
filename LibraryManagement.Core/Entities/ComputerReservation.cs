using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class ComputerReservation
{
    public string ReservationId { get; set; } = null!;

    public string? ComputerId { get; set; }

    public string MemberId { get; set; } = null!;

    public DateOnly ReservationDate { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public string? Status { get; set; }

    public DateTime CreatedDate { get; set; }

    public virtual Computer? Computer { get; set; }

    public virtual Member Member { get; set; } = null!;
}
