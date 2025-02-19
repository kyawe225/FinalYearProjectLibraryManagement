using LibraryManagement.Core.Entity;
using LibraryManagement.Infrastructure.ViewModel.Book;
using LibraryManagement.Infrastructure.ViewModel.User;

namespace LibraryManagement.Infrastructure.ViewModel.WishBook;

public class WishBookViewModel
{
    public string Id {set;get;}
    public string BookId { set; get; }
    public string UserId { set; get; }
    public UserViewModel User { set; get; }
    public BookViewModel Book { set; get; }
    public DateTime createdAt {set;get;}
    public DateTime updatedAt {set;get;}

    public WishBookViewModel( WishBookTable model)
    {
        BookId = model.BookId;
        UserId = model.UserId;
        createdAt = model.CreatedAt; 
        updatedAt = model.UpdatedAt;
        Id = model.Id;
        User = new UserViewModel(model.User);
        Book = new BookViewModel(model.BookTable);
    }
}

public class WishBookCreateViewModel
{
    public string BookId { set; get; }
    public string UserId { set; get; }

    public WishBookTable toWishBookTable()
    {
        WishBookTable wishBookTable = new WishBookTable();
        wishBookTable.BookId = BookId;
        wishBookTable.UserId = UserId;
        return wishBookTable;
    }
}