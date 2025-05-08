using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Constants;
using LibraryManagement.Infrastructure.ViewModel.LoanTable;

namespace LibraryManagement.Infrastructure.ViewModel.LateFee;

public class LateFeeViewModel
{
    public string FineId { get; set; } = null!;

    public string LoanId { get; set; } = null!;

    public string MemberId { get; set; } = null!;

    public decimal FineAmount { get; set; }

    public DateOnly FineDate { get; set; }

    public string? PaymentStatus { get; set; }

    public DateOnly? PaymentDate { get; set; }

    public LateFeeViewModel()
    {
        
    }

    public LateFeeViewModel(Fine lateFeeTable)
    {
        FineId = lateFeeTable.FineId;
        LoanId = lateFeeTable.LoanId;
        MemberId = lateFeeTable.MemberId;
        FineAmount = lateFeeTable.FineAmount;
        FineDate = lateFeeTable.FineDate;
        PaymentStatus = lateFeeTable.PaymentStatus;
        PaymentDate = lateFeeTable.PaymentDate;
    }
}

public class LateFeeCreateViewModel
{
    public string LoanTableId { set; get; }
    public decimal Amount { set; get; }
    public string MemberId{set;get;}
    public DateTime FineDate { set; get; }

    public Fine toLateFeeTable()
    {
        Fine lateFeeTable = new Fine();
        lateFeeTable.FineId = LoanTableId ?? Utils.ulid(DbPrefixes.Fine);
        lateFeeTable.FineAmount = Amount;
        lateFeeTable.FineDate = DateOnly.FromDateTime(FineDate.ToUniversalTime());
        lateFeeTable.MemberId = MemberId;
        return lateFeeTable;
    }
}