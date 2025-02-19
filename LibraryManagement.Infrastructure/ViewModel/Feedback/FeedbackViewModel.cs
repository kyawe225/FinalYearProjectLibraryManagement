

using System.ComponentModel.DataAnnotations;

public class FeedbackCreateViewModel
{
    [EmailAddress]
    [Required]
    public string Email { set; get; }
    [Required]
    public string Name { set; get; }
    [Required]
    public string Feedback { set; get; }

    public FeedbackTable toFeedbackTable()
    {
        FeedbackTable feedback = new FeedbackTable();
        feedback.Email = Email;
        feedback.Name = Name;
        feedback.Feedback = Feedback;
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
}