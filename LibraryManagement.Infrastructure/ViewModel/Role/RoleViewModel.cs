using LibraryManagement.Core;
using LibraryManagement.Core.Entity;

namespace LibraryManagement.Infrastructure.ViewModel.Role;

public class RoleViewModel
{
    public string Name { set; get; }
    public string Description { set; get; }
    public string Status { set; get; }
    public string Id { set; get; }
    public DateTime CreatedAt { set;get; }
    public DateTime UpdatedAt { set; get; }

    public RoleViewModel(RoleTable role)
    {
        Name = role.Name;
        Description = role.Description;
        Status = role.Status.ToString();
        CreatedAt = role.CreatedAt;
        UpdatedAt = role.UpdatedAt;
        Id = role.Id;
    }
}

public class RoleCreateViewModel
{
    public string Name { set; get; }
    public string Description { set; get; }
    public string? Status { set; get; }

    public RoleTable toRoleTable()
    {
        RoleTable role = new RoleTable();
        role.Name = Name;
        role.Description = Description;
        role.Status = RoleStatus.Active;
        //role.Status = Utils.ParseEnum<RoleStatus>(Status);
        return role;
    }
}