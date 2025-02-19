using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Core.Entity;

public class AttendPersonsTable : BaseTable
{
    public string UserId { set; get; }
    public string EventId { set; get; }
    [ForeignKey("EventId")]
    public EventTable Event { set; get; }
    [ForeignKey("UserId")]
    public UserTable User { set; get; }
}