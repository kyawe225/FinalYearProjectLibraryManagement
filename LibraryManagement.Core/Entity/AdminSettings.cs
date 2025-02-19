using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Core.Entity;

public class AdminSettings : BaseTable
{
    public string Name { set; get; }
    public string Value { set; get; }
    public string? VariableValues { set; get; }
    public string UpdatedUserId { set; get; }
    [ForeignKey("UpdatedUserId")]
    public UserTable UpdatedUser { set; get; }
}