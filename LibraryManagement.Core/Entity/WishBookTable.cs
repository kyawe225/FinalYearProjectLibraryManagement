using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Core.Entity;

public class WishBookTable : BaseTable
{
    public string BookId { set; get; }
    public string UserId { set; get; }
    [ForeignKey("BookId")]
    public UserTable User { set; get; }
    [ForeignKey("UserId")]
    public BookTable BookTable { set; get; }
}