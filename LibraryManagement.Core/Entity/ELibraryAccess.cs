using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Core.Entity;

public class ELibraryAccess : BaseTable
{
    public string UserId { set; get; }
    [ForeignKey("UserId")]
    public UserTable User { set; get; }
    public DateTime ExpireTime { set; get; }
}