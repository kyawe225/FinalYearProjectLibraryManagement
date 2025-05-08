using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class Reservation
{
    public string Id { get; set; } = null!;

    public string BookId { get; set; } = null!;

    public string MemberId { get; set; } = null!;

    public DateOnly ReservationDate { get; set; }

    public string? Status { get; set; }

    public virtual Book Book { get; set; } = null!;

    public virtual Member Member { get; set; } = null!;
}
