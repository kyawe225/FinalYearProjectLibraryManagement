using LibraryManagement.Core;

namespace LibraryManagement.Infrastructure.ViewModel.Inventory;

public class InventoryViewModel
{
    public string BookId { set; get; }
    public string Status { set; get; }
    public string Barcode { set; get; }
    public string Condition { set; get; }
    public string Id { set; get; }
    public DateTime UpdatedAt { set; get; }
    public DateTime CreatedAt { set; get; }

    public InventoryViewModel()
    {
        
    }

    public InventoryViewModel(Core.Entity.InventoryBooks model)
    {
        BookId = model.BookId;
        Id = model.Id;
        UpdatedAt = model.UpdatedAt;
        CreatedAt = model.CreatedAt;
        Status = model.Status.ToString();
        Barcode = model.Barcode;
        Condition = model.Condition.ToString();
    }
}

public class InventoryBookCreateViewModel()
{
    public string BookId { set; get; }
    public string Status { set; get; }
    public string Barcode { set; get; }
    public string Condition { set; get; }

    public Core.Entity.InventoryBooks toInventoryBook()
    {
        var model = new Core.Entity.InventoryBooks();
        model.BookId = BookId;
        model.Status = Utils.ParseEnum<InventoryBookStatus>(Status);
        model.Barcode = Barcode;
        model.Condition = Utils.ParseEnum<BookConditionStatus>(Condition);
        return model;
    }
}