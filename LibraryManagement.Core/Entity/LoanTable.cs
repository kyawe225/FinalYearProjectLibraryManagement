using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Core.Entity;

public class LoanTable : BaseTable
{
    public string BookId { set; get; }
    public string UserId { set; get; }
    [ForeignKey("BookId")]
    public BookTable BookTable { set; get; }
    [ForeignKey("UserId")]
    public UserTable User { set; get; }
    public DateTime LoanDate { set; get; }
    public DateTime LastReturnDate { set; get; }
    public DateTime? ReturnDate { set; get; }
    
}