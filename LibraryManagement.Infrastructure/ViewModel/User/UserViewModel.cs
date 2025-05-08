using LibraryManagement.Core;
using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Constants;

namespace LibraryManagement.Infrastructure.ViewModel.User;

public class UserViewModel
{
    public string Id { set; get; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? Address { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Email { get; set; }
    public DateOnly? DateOfBirth { get; set; }

    public DateOnly MembershipDate { get; set; }

    public DateOnly? MembershipExpiry { get; set; }

    public string? Password { get; set; }
    public string MembershipStatus { set; get; }

    public UserViewModel(Member user)
    {
        Id = user.Id;
        FirstName = user.FirstName;
        LastName = user.LastName;
        Email = user.Email;
        Password = "";
        PhoneNumber = user.PhoneNumber;
        DateOfBirth = user.DateOfBirth;
        Address = user.Address;
        MembershipDate = DateOnly.FromDateTime(DateTime.UtcNow);
        MembershipExpiry = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(1));
        MembershipStatus = "active";
    }
}

public class UserCreateViewModel
{
/// <summary>
        /// First name of the member
        /// </summary>
        public string FirstName { get; set; }
        
        /// <summary>
        /// Last name of the member
        /// </summary>
        public string LastName { get; set; }
        
        /// <summary>
        /// Physical address of the member
        /// </summary>
        public string Address { get; set; }
        
        /// <summary>
        /// Phone number of the member
        /// </summary>
        public string PhoneNumber { get; set; }
        
        /// <summary>
        /// Email address of the member
        /// </summary>
        public string Email { get; set; }
        
        /// <summary>
        /// Date of birth of the member
        /// </summary>
        public DateTime? DateOfBirth { get; set; }
        
        /// <summary>
        /// Date when the membership starts
        /// </summary>
        public DateTime? MembershipDate { get; set; }
        
        /// <summary>
        /// Date when the membership expires
        /// </summary>
        public DateTime? MembershipExpiry { get; set; }
        
        /// <summary>
        /// Status of the membership (Active, Pending, etc.)
        /// </summary>
        public string MembershipStatus { get; set; }
        
        /// <summary>
        /// Password for the member's account
        /// </summary>
        public string Password { get; set; }

    public Member toUserTable()
    {
        Member user = new Member();
        user.Id = Utils.ulid(DbPrefixes.Member);
        user.FirstName = FirstName;
        user.LastName = LastName;
        user.Email = Email;
        user.PasswordHash = Utils.Encode(Password);
        user.PhoneNumber = PhoneNumber;
        user.DateOfBirth = DateOnly.FromDateTime(DateOfBirth ?? DateTime.UtcNow);
        user.Address = Address;
        user.MembershipDate = DateOnly.FromDateTime(DateTime.UtcNow);
        user.MembershipExpiry = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(1));
        user.MembershipStatus = "active";
        return user;
    }

    public Member UpdateMember(Member user)
    {
        user.Id = Utils.ulid(DbPrefixes.Member);
        user.FirstName = FirstName;
        user.LastName = LastName;
        user.Email = Email;
        user.PasswordHash = Utils.Encode(Password);
        user.PhoneNumber = PhoneNumber;
        user.DateOfBirth = DateOnly.FromDateTime(DateOfBirth ?? DateTime.UtcNow);
        user.Address = Address;
        user.MembershipDate = DateOnly.FromDateTime(DateTime.UtcNow);
        user.MembershipExpiry = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(1));
        user.MembershipStatus = "active";
        return user;
    }
}