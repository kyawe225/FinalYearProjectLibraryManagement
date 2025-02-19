using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Core.Entity;

public class InvitedPersonsTable :BaseTable
{
    public string UserId { set; get; }
    [ForeignKey("UserId")]
    public UserTable User { set; get; }
    public string AdminMeetingId { set; get; }
    [ForeignKey("AdminMeetingId")]
    public AdminMeetingTable Meeting { set; get; }
}