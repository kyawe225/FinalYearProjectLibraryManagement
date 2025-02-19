namespace LibraryManagement.Core.Entity;

public class RoleTable : BaseTable
{
    public string Name { set; get; }
    public string Description { set; get; }
    public RoleStatus Status { set; get; }
}