namespace LibraryManagement.Core.Entities;

/// <summary>
/// Represents filter criteria for searching computers
/// </summary>
public class ComputerFilter
{
    /// <summary>
    /// Branch ID to filter by
    /// </summary>
    public string BranchId { get; set; }

    /// <summary>
    /// Computer type to filter by (Desktop, Laptop, etc.)
    /// </summary>
    public string ComputerType { get; set; }

    /// <summary>
    /// Status to filter by (Available, In Use, etc.)
    /// </summary>
    public string Status { get; set; }

    /// <summary>
    /// Search term for computer name or specifications
    /// </summary>
    public string SearchTerm { get; set; }
}