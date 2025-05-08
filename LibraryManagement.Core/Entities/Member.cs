using System;
using System.Collections.Generic;

namespace LibraryManagement.Core.Entities;

public partial class Member
{
    public string Id { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? Address { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Email { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public DateOnly MembershipDate { get; set; }

    public DateOnly? MembershipExpiry { get; set; }

    public string? MembershipStatus { get; set; }

    public string? PasswordHash { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<BookLoan> BookLoans { get; set; } = new List<BookLoan>();

    public virtual ICollection<BookReview> BookReviews { get; set; } = new List<BookReview>();

    public virtual ICollection<ComputerReservation> ComputerReservations { get; set; } = new List<ComputerReservation>();

    public virtual ICollection<ComputerSession> ComputerSessions { get; set; } = new List<ComputerSession>();

    public virtual ICollection<EventRegistration> EventRegistrations { get; set; } = new List<EventRegistration>();

    public virtual ICollection<Fine> Fines { get; set; } = new List<Fine>();

    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();

    public virtual ICollection<Wish> Wishes { get; set; } = new List<Wish>();
}
