namespace LibraryManagement.Core.Entity;

public class UserTable : BaseTable
{
    public string Name { set; get; }
    public string Email { set; get; }
    public string Password { set; get; }
    public string Phone { set; get; }
    public string RoleId { set; get; }
    public RoleTable Role { set; get; }
    public UserType userType { set; get; }
    public UserStatus userStatus { set; get; }
}