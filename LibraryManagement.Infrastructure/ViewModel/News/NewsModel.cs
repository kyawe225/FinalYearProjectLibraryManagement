using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography.X509Certificates;
using LibraryManagement.Core;
using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Constants;
using LibraryManagement.Infrastructure.ViewModel.LibraryBranch;
using LibraryManagement.Infrastructure.ViewModel.Publisher;
using LibraryManagement.Infrastructure.ViewModel.User;

namespace LibraryManagement.Infrastructure.ViewModel.News;

public class NewsViewModel
{
    public string Id { set; get; }
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
    public StaffViewModel PublishedBy { get; set; }
    public LibraryBranchViewModel Branch { get; set; }
    public NewsViewModel(NewsTable table)
    {
        Id = table.NewsId;
        Title = table.Title;
        Content = table.Content;
        PublicationDate = table.PublicationDate;
        ExpiryDate = table.ExpiryDate;
        PublishedById = table.PublishedById;
        BranchId = table.BranchId;
        Visibility = table.Visibility;
        Category = table.Category;
        ImageUrl = table.ImageUrl;
        ImportanceLevel = table.ImportanceLevel;
        PublishedBy = new StaffViewModel(table.PublishedBy);
        Branch = new LibraryBranchViewModel(table.Branch);
    }
}

public class NewsCreateViewModel
{
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
    public NewsTable toNewsTable()
    {
        NewsTable model = new NewsTable();
        model.NewsId = Utils.ulid(DbPrefixes.News);
        model.Title = Title;
        model.Content = Content;
        model.PublicationDate = PublicationDate.ToUniversalTime();
        model.ExpiryDate = ExpiryDate?.ToUniversalTime() ?? null;
        model.PublishedById = PublishedById;
        model.BranchId = BranchId;
        model.ImportanceLevel = ImportanceLevel;
        model.Visibility = Visibility;
        model.Category = Category;
        model.ImageUrl = ImageUrl;
        return model;
    }

    public NewsTable UpdateTable(NewsTable model)
    {
        model.Title = Title;
        model.Content = Content;
        model.PublicationDate = PublicationDate.ToUniversalTime();
        model.ExpiryDate = ExpiryDate?.ToUniversalTime() ?? null;
        model.PublishedById = PublishedById;
        model.BranchId = BranchId;
        model.ImportanceLevel = ImportanceLevel;
        model.Visibility = Visibility;
        model.Category = Category;
        model.ImageUrl = ImageUrl;
        return model;
    }
}

/// <summary>
/// Represents filter criteria for searching wishlist items
/// </summary>
public class WishFilter
{
    /// <summary>
    /// Member ID to filter by
    /// </summary>
    [AllowNull]
    public string? MemberId { get; set; }

    /// <summary>
    /// Book ID to filter by
    /// </summary>
    [AllowNull]
    public string? BookId { get; set; }

    /// <summary>
    /// Start date for filtering by date added
    /// </summary>
    [AllowNull]
    public string? DateFrom { get; set; }

    /// <summary>
    /// End date for filtering by date added
    /// </summary>
    [AllowNull]
    public string? DateTo { get; set; }
}