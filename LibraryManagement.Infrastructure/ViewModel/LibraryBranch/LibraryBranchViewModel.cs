using LibraryManagement.Infrastructure.Constants;
using LibraryManagement.Infrastructure.ViewModel.User;

namespace LibraryManagement.Infrastructure.ViewModel.LibraryBranch;

public class LibraryBranchViewModel
{
    /// <summary>
    /// Unique identifier for the branch
    /// </summary>
    public string Id { get; set; }

    /// <summary>
    /// Name of the branch
    /// </summary>
    public string BranchName { get; set; }

    /// <summary>
    /// Physical address of the branch
    /// </summary>
    public string Address { get; set; }

    /// <summary>
    /// Phone number of the branch
    /// </summary>
    public string Phone { get; set; }

    /// <summary>
    /// Email address of the branch
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// ID of the staff member who manages this branch
    /// </summary>
    public string ManagerId { get; set; }

    /// <summary>
    /// Hours of operation for the branch
    /// </summary>
    public string OpeningHours { get; set; }

    /// <summary>
    /// Navigation property for the branch manager
    /// </summary>
    public virtual StaffViewModel Manager { get; set; }

    public LibraryBranchViewModel(Core.Entities.LibraryBranch branch)
    {
        Id = branch.Id;
        BranchName = branch.BranchName;
        Address = branch.Address;
        Phone = branch.Phone;
        Email = branch.Email;
        ManagerId = branch.ManagerId;
        if (branch.Manager != null)
            Manager = new StaffViewModel(branch.Manager);
    }
}

public class LibraryBranchCreateViewModel
{
    public string BranchName { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? ManagerId { get; set; }

    public string? OpeningHours { get; set; }

    public Core.Entities.LibraryBranch toLibraryBranch()
    {
        Core.Entities.LibraryBranch branch = new Core.Entities.LibraryBranch();
        branch.Id = Utils.ulid(DbPrefixes.LibraryBranch);
        branch.BranchName = BranchName;
        branch.Address = Address;
        branch.Phone = Phone;
        branch.Email = Email;
        branch.ManagerId = ManagerId;
        return branch;
    }
}