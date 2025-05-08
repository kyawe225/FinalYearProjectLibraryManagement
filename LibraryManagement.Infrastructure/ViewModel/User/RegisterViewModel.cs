using LibraryManagement.Core;
using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Constants;
namespace LibraryManagement.Infrastructure.ViewModel.User;

public class RegisterViewModel
{
    public string Email { set; get; }
    public string Password { set; get; }
    public string ConfirmPassword { set; get; }
    public string FirstName { set; get; }
    public string LastName { set; get; }

    public Member toUserTable()
    {
        Member user = new Member();
        user.Id = Utils.ulid(DbPrefixes.Member);
        user.FirstName = FirstName;
        user.LastName = LastName;
        user.Email = Email;
        user.PasswordHash = Utils.Encode(Password);
        user.PhoneNumber = "";
        user.DateOfBirth = null;
        user.Address = "";
        user.MembershipStatus= "pending";
        return user;
    }
}