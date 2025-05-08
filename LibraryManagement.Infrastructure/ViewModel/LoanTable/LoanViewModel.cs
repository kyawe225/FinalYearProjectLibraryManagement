using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Constants;
using LibraryManagement.Infrastructure.ViewModel.Book;
using LibraryManagement.Infrastructure.ViewModel.User;

namespace LibraryManagement.Infrastructure.ViewModel.LoanTable;

public class LoanViewModel
{
    public string LoanId { get; set; } = null!;

    public string BookId { get; set; } = null!;

    public string MemberId { get; set; } = null!;

    public DateOnly DateBorrowed { get; set; }

    public DateOnly DueDate { get; set; }

    public DateOnly? DateReturned { get; set; }

    public string? Status { get; set; }

    public decimal? FineAmount { get; set; }

    public virtual BookViewModel Book { get; set; } = null!;

    public virtual ICollection<Fine> Fines { get; set; } = new List<Fine>();

    public virtual UserViewModel Member { get; set; } = null!;

    public LoanViewModel(BookLoan model)
    {
        LoanId = model.LoanId;
        BookId = model.BookId;
        MemberId = model.MemberId;
        DateBorrowed = model.DateBorrowed;
        DueDate = model.DueDate;
        DateReturned = model.DateReturned;
        Status = model.Status;
        FineAmount = model.FineAmount;
        Book = new BookViewModel(model.Book);
        Fines = model.Fines;
        Member = new UserViewModel(model.Member);
    }
}

public class LoanCreateViewModel
{
    public string BookId { get; set; } = null!;

    public string MemberId { get; set; } = null!;

    public DateOnly DateBorrowed { get; set; }

    public DateOnly? DueDate { get; set; }

    public DateOnly? DateReturned { get; set; }

    public string? Status { get; set; }

    public decimal? FineAmount { get; set; }

    public BookLoan toLoanTable()
    {
        BookLoan loan = new BookLoan();
        loan.BookId = BookId;
        loan.LoanId = Utils.ulid(DbPrefixes.BookLoan);
        loan.MemberId = MemberId;
        loan.DateBorrowed = DateBorrowed;
        loan.DueDate = DueDate ?? DateOnly.FromDateTime(DateTime.UtcNow);
        loan.Status = Status;
        loan.FineAmount = null;
        return loan;
    }

    public BookLoan Update(BookLoan loan)
    {
        loan.BookId = BookId;
        loan.MemberId = MemberId;
        loan.DateBorrowed = DateBorrowed;
        loan.DueDate = DueDate ?? DateOnly.FromDateTime(DateTime.UtcNow);
        loan.Status = Status;
        loan.FineAmount = null;
        return loan;
    }
}

/// <summary>
/// Represents filter criteria for searching fines
/// </summary>
public class FineFilter
{
    /// <summary>
    /// Member ID to filter by
    /// </summary>
    public string MemberId { get; set; }

    /// <summary>
    /// Loan ID to filter by
    /// </summary>
    public string LoanId { get; set; }

    /// <summary>
    /// Payment status to filter by (Paid, Unpaid, Waived)
    /// </summary>
    public string PaymentStatus { get; set; }

    /// <summary>
    /// Start date for filtering by fine date
    /// </summary>
    public string DateFrom { get; set; }

    /// <summary>
    /// End date for filtering by fine date
    /// </summary>
    public string DateTo { get; set; }

    /// <summary>
    /// Minimum fine amount to filter by
    /// </summary>
    public decimal? MinAmount { get; set; }

    /// <summary>
    /// Maximum fine amount to filter by
    /// </summary>
    public decimal? MaxAmount { get; set; }
}

public class BatchLoanRequest
{
    public string MemberId { get; set; } = null!;
    public List<string> BookCopyIds { get; set; } = new();
    public DateTime DueDate { get; set; }
    public string? Notes { get; set; }
}

public class RenewLoanRequest
{
    public DateTime DueDate { get; set; }
}