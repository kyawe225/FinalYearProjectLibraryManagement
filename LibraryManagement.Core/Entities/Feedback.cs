using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Core.Entities;

[Table("feedbacks")]
public class FeedBack {
    public string Id {set;get;}
    public string Name{set;get;}
    public string Email{set;get;}
    public string Feedback {set;get;}
    public DateTime CreatedAt {set;get;}
}