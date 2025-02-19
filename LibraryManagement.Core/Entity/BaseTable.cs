namespace LibraryManagement.Core.Entity;

public class BaseTable
{
    public string Id { set; get; } = Guid.NewGuid().ToString();
    public DateTime CreatedAt { set; get; } = DateTime.UtcNow;
    public DateTime UpdatedAt { set; get; } = DateTime.UtcNow;
}