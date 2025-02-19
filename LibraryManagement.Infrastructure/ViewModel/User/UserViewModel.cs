using LibraryManagement.Core;
using LibraryManagement.Core.Entity;

namespace LibraryManagement.Infrastructure.ViewModel.User;

public class UserViewModel
{
    public string Id { set; get; }
    public string Name { set; get; }
    public string Email { set; get; }
    public string Password { set; get; }
    public string Phone { set; get; }
    public string RoleId { set; get; }
    public string Role { set; get; }
    public string userType { set; get; }
    public string userStatus { set; get; }
    public DateTime CreatedAt { set; get; }
    public DateTime UpdatedAt { set; get; }

    public UserViewModel(UserTable user)
    {
        Id = user.Id;
        Name = user.Name;
        Email = user.Email;
        Password = user.Password;
        Phone = user.Phone;
        RoleId = user.RoleId;
        Role = user.Role.Name;
        userType = user.userType.ToString();
        userStatus = user.userStatus.ToString();
        CreatedAt = user.CreatedAt;
        UpdatedAt = user.UpdatedAt;
    }
}

public class UserCreateViewModel
{
    public string Name { set; get; }
    public string Email { set; get; }
    public string Password { set; get; }
    public string Phone { set; get; }
    public string RoleId { set; get; }
    public string userType { set; get; }
    public string userStatus { set; get; }

    public UserTable toUserTable()
    {
        UserTable user = new UserTable();
        user.Name = Name;
        user.Email = Email;
        user.Password = Utils.Encode(Password);
        user.Phone = Phone;
        user.RoleId = RoleId;
        user.userType = Utils.ParseEnum<UserType>(userType);
        user.userStatus = UserStatus.Created;
        return user;
    }
}