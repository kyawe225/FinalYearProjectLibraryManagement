

using System.ComponentModel.DataAnnotations;
using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure;
using LibraryManagement.Infrastructure.Constants;

public class FeedbackCreateViewModel
{
    [EmailAddress]
    [Required]
    public string Email { set; get; }
    [Required]
    public string Name { set; get; }
    [Required]
    public string Feedback { set; get; }

    public FeedBack toFeedbackTable()
    {
        FeedBack feedback = new FeedBack();
        feedback.Id = Utils.ulid(DbPrefixes.Feedback);
        feedback.Email = Email;
        feedback.Name = Name;
        feedback.Feedback = Feedback;
        feedback.CreatedAt = DateTime.UtcNow;
        return feedback;
    }
}

public class FeedbackViewModel
{
    public string Id {set;get;}
    public string Email { set; get; }
    public string Name { set; get; }
    public string Feedback { set; get; }
    public DateTime CreatedAt { set; get; } = DateTime.UtcNow;
    public DateTime UpdatedAt { set; get; } = DateTime.UtcNow;
    public FeedbackViewModel(FeedBack feedback){
        Id = feedback.Id;
        Email = feedback.Email;
        Name = feedback.Name;
        Feedback = feedback.Feedback;
    }
}