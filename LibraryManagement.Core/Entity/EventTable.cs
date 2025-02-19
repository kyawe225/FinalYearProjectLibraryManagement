namespace LibraryManagement.Core.Entity;

public class EventTable : BaseTable
{
    public string Name { set; get; }
    public string Location { set; get; }
    public DateTime StartDateTime { set; get; }
    public int DurationInMinutes { set; get; }
}