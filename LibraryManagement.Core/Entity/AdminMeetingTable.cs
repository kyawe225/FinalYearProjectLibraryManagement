using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Core.Entity;

public class AdminMeetingTable: BaseTable
{
    public string Name { set; get; }
    public string Description { set; get; }
    public string Location { set; get; }
}