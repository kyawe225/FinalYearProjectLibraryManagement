using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Core.Entity;

public class NewsTable : BaseTable
{
    public string title{set;get;}
    public string content {set;get;}
    public string userId {set;get;}
    [ForeignKey("userId")]
    public UserTable user {set;get;}
    public NewsType type {set;get;}
    public bool isPublish{set;get;} = false;
}
