using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Constants;
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

    public WishBookViewModel(Wish model)
    {
        BookId = model.BookId;
        UserId = model.MemberId;
        Id = model.WishId;
        User = new UserViewModel(model.Member);
        Book = new BookViewModel(model.Book);
    }
}

public class WishBookCreateViewModel
{
    public string BookId { set; get; }
    public string Notes { set; get; }

    public Wish toWishBookTable(string UserId)
    {
        Wish wishBookTable = new Wish();
        wishBookTable.WishId = Utils.ulid(DbPrefixes.WishBook);
        wishBookTable.BookId = BookId;
        wishBookTable.MemberId = UserId;
        wishBookTable.Notes = Notes;
        return wishBookTable;
    }
}

public class WishBookCustomerCreateViewModel
{
    public string BookId { set; get; }

    public Wish toWishBookTable()
    {
        Wish wishBookTable = new Wish();
        wishBookTable.WishId = Utils.ulid(DbPrefixes.WishBook);
        wishBookTable.BookId = BookId;
        wishBookTable.MemberId = "";
        return wishBookTable;
    }
}