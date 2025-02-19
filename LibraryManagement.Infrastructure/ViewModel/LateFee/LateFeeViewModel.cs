using LibraryManagement.Core.Entity;
using LibraryManagement.Infrastructure.ViewModel.LoanTable;

namespace LibraryManagement.Infrastructure.ViewModel.LateFee;

public class LateFeeViewModel
{
    public string LoanTableId { set; get; }
    public LoanViewModel LoanTable { set; get; }
    public decimal Amount { set; get; }
    public decimal LateDays { set; get; }
    public string Id { set; get; }
    public DateTime UpdatedAt { set; get; }
    public DateTime CreatedAt { set; get; }

    public LateFeeViewModel()
    {
        
    }

    public LateFeeViewModel(LateFeeTable lateFeeTable)
    {
        LoanTableId = lateFeeTable.LoanTableId;
        LoanTable = new LoanViewModel(lateFeeTable.LoanTable);
        Amount = lateFeeTable.Amount;
        LateDays = lateFeeTable.LateDays;
        Id = lateFeeTable.Id;
        UpdatedAt = lateFeeTable.UpdatedAt;
        CreatedAt = lateFeeTable.CreatedAt;
    }
}

public class LateFeeCreateViewModel
{
    public string LoanTableId { set; get; }
    public decimal Amount { set; get; }
    public decimal LateDays { set; get; }

    public LateFeeTable toLateFeeTable()
    {
        LateFeeTable lateFeeTable = new LateFeeTable();
        lateFeeTable.LoanTableId = LoanTableId;
        lateFeeTable.Amount = Amount;
        lateFeeTable.LateDays = LateDays;
        return lateFeeTable;
    }
}