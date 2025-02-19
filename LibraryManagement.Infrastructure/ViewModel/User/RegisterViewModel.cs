using LibraryManagement.Core;
using LibraryManagement.Core.Entity;

namespace LibraryManagement.Infrastructure.ViewModel.User;

public class RegisterViewModel
{
    public string Email { set; get; }
    public string Password { set; get; }
    public string ConfirmPassword { set; get; }
    public string Name { set; get; }
    public UserTable toUserTable()
    {
        UserTable user = new UserTable();
        user.Name = Name;
        user.Email = Email;
        user.Password = Utils.Encode(Password);
        user.Phone = "";
        user.RoleId = "";
        user.userType = UserType.NonStudent;
        user.userStatus = UserStatus.Created;
        return user;
    }
}