using LibraryManagement.Infrastructure.ViewModel.Book;
using LibraryManagement.Infrastructure.ViewModel.User;

namespace LibraryManagement.Infrastructure.ViewModel.LoanTable;

public class LoanViewModel
{
    public string BookId { set; get; }
    public string UserId { set; get; }
    public BookViewModel Book { set; get; }
    public UserViewModel User { set; get; }
    public DateTime LoanDate { set; get; }
    public DateTime LastReturnDate { set; get; }
    public DateTime? ReturnDate { set; get; }
    public string Id { set; get; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public LoanViewModel(Core.Entity.LoanTable model)
    {
        BookId = model.BookId;
        UserId = model.UserId;
        LoanDate = model.LoanDate;
        LastReturnDate = model.LastReturnDate;
        ReturnDate = model.ReturnDate;
        CreatedAt = model.CreatedAt;
        UpdatedAt = model.UpdatedAt;
        Id = model.Id;
        Book = new BookViewModel(model.BookTable);
        User = new UserViewModel(model.User);
    }
    
}

public class LoanCreateViewModel
{
    public string BookId { set; get; }
    public string UserId { set; get; }
    public DateTime LoanDate { set; get; }
    public DateTime LastReturnDate { set; get; }
    public DateTime? ReturnDate { set; get; }

    public Core.Entity.LoanTable toLoanTable()
    {
        Core.Entity.LoanTable model = new Core.Entity.LoanTable();
        model.BookId = BookId;
        model.UserId = UserId;
        model.LoanDate = LoanDate;
        model.LastReturnDate = LastReturnDate;
        model.ReturnDate = ReturnDate;
        return model;
    }
}