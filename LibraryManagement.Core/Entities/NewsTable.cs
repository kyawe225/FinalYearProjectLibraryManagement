using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.Core.Entities;

public partial class NewsTable
{
    [Key]
    public string NewsId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime PublicationDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public string PublishedById { get; set; }
    public string BranchId { get; set; }
    public string ImportanceLevel { get; set; }
    public string Visibility { get; set; }
    public string Category { get; set; }
    public string ImageUrl { get; set; }

    // Navigation properties
    public Staff PublishedBy { get; set; }
    public LibraryBranch Branch { get; set; }
}