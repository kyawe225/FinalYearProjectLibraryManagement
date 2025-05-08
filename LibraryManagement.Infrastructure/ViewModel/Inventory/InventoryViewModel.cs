using LibraryManagement.Core;
using LibraryManagement.Infrastructure.Constants;
using LibraryManagement.Infrastructure.ViewModel.Book;
using LibraryManagement.Infrastructure.ViewModel.LibraryBranch;

namespace LibraryManagement.Infrastructure.ViewModel.Inventory;

public class InventoryViewModel
{
    public string Id { get; set; } = null!;

    public string BookId { get; set; } = null!;

    public string BranchId { get; set; } = null!;

    public DateOnly AcquisitionDate { get; set; }

    public string? CopyStatus { get; set; }

    public string? Condition { get; set; }
    public virtual LibraryBranchViewModel Branch { get; set; } = null!;

    public InventoryViewModel()
    {

    }

    public InventoryViewModel(Core.Entities.BookCopy model)
    {
        BookId = model.BookId;
        Id = model.CopyId;
        BranchId = model.BranchId;
        AcquisitionDate = model.AcquisitionDate;
        CopyStatus = model.CopyStatus;
        Condition = model.Condition;
        if (model.Branch != null)
            Branch = new LibraryBranchViewModel(model.Branch);
    }
}

public class InventoryBookCreateViewModel()
{
    public string Id { get; set; } = null!;

    public string BookId { get; set; } = null!;

    public string BranchId { get; set; } = null!;

    public DateTime AcquisitionDate { get; set; }

    public string? CopyStatus { get; set; }

    public string? Condition { get; set; }

    public Core.Entities.BookCopy toInventoryBook()
    {
        var model = new Core.Entities.BookCopy();
        model.CopyId = Utils.ulid(DbPrefixes.BookCopy);
        model.BranchId = BranchId;
        model.BookId = BookId;
        model.AcquisitionDate = DateOnly.FromDateTime(AcquisitionDate);
        model.CopyStatus = CopyStatus;
        model.Condition = Condition;
        return model;
    }
}