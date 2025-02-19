using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Core.Entity;

public class LateFeeTable :BaseTable
{
    public string LoanTableId { set; get; }
    [ForeignKey("LoanTableId")]
    public LoanTable LoanTable { set; get; }
    public decimal Amount { set; get; }
    public decimal LateDays { set; get; }
}