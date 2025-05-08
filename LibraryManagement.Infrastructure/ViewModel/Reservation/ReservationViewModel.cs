using LibraryManagement.Core;
using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.ViewModel.Book;
using LibraryManagement.Infrastructure.ViewModel.User;

namespace LibraryManagement.Infrastructure.ViewModel;

public class ReservationViewModel
{
    public string Id { get; set; } = null!;

    public string BookId { get; set; } = null!;

    public string MemberId { get; set; } = null!;

    public DateOnly ReservationDate { get; set; }

    public string? Status { get; set; }

    public virtual BookViewModel Book { get; set; } = null!;

    public virtual UserViewModel Member { get; set; } = null!;

    public ReservationViewModel(Reservation reservation){
        Id = reservation.Id;
        BookId = reservation.BookId;
        MemberId = reservation.MemberId;
        Status = reservation.Status;
        ReservationDate = reservation.ReservationDate;
        Book = new BookViewModel(reservation.Book);
        Member = new UserViewModel(reservation.Member);
    }
}


public class ReservationCreateViewModel
{
    public string BookId { set; get; }
    public string UserId { set; get; }
    public DateOnly AppointDate { set; get; }
    public Reservation toReservation(){
        Reservation reservation = new Reservation();
        reservation.BookId = BookId;
        reservation.MemberId = UserId;
        reservation.ReservationDate = reservation.ReservationDate;
        return reservation;
    }
}

