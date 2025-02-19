namespace LibraryManagement.Core.Entity;

public class InventoryBooks : BaseTable
{
    public string BookId { set; get; }
    public InventoryBookStatus Status { set; get; }
    public string Barcode { set; get; }
    public BookConditionStatus Condition { set; get; }
}