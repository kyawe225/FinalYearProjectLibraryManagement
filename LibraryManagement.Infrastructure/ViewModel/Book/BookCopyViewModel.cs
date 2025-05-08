using LibraryManagement.Infrastructure.ViewModel.LibraryBranch;

namespace LibraryManagement.Infrastructure.ViewModel.Book;

/// <summary>
/// Represents a physical copy of a book in the library management system
/// </summary>
public class BookCopy
{
    /// <summary>
    /// Unique identifier for the book copy
    /// </summary>
    public string CopyId { get; set; }

    /// <summary>
    /// ID of the book this is a copy of
    /// </summary>
    public string BookId { get; set; }

    /// <summary>
    /// ID of the branch where this copy is located
    /// </summary>
    public string BranchId { get; set; }

    /// <summary>
    /// Date when this copy was acquired by the library
    /// </summary>
    public DateTime AcquisitionDate { get; set; }

    /// <summary>
    /// Current status of the copy (Available, Checked Out, Lost, Damaged, etc.)
    /// </summary>
    public string CopyStatus { get; set; }

    /// <summary>
    /// Physical condition of the copy (New, Good, Fair, Poor)
    /// </summary>
    public string Condition { get; set; }

    /// <summary>
    /// Navigation property for the book
    /// </summary>
    public virtual BookViewModel? Book { get; set; }

    /// <summary>
    /// Navigation property for the branch
    /// </summary>
    public virtual LibraryBranchViewModel Branch { get; set; }
}