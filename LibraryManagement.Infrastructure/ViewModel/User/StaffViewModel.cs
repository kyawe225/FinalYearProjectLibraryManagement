using System.ComponentModel.DataAnnotations;
using LibraryManagement.Core;
using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Constants;

namespace LibraryManagement.Infrastructure.ViewModel.User;

public class StaffViewModel
{
    /// <summary>
        /// Unique identifier for the staff member
        /// </summary>
        public string Id { get; set; }
        
        /// <summary>
        /// First name of the staff member
        /// </summary>
        public string FirstName { get; set; }
        
        /// <summary>
        /// Last name of the staff member
        /// </summary>
        public string LastName { get; set; }
        
        /// <summary>
        /// Position or role of the staff member in the library
        /// </summary>
        public string Position { get; set; }
        
        /// <summary>
        /// Department the staff member belongs to
        /// </summary>
        public string Department { get; set; }
        
        /// <summary>
        /// Email address of the staff member
        /// </summary>
        public string Email { get; set; }
        
        /// <summary>
        /// Phone number of the staff member
        /// </summary>
        public string Phone { get; set; }
        
        /// <summary>
        /// Date when the staff member was hired
        /// </summary>
        public DateTime DateHired { get; set; }
        
        /// <summary>
        /// Username for the staff member's account
        /// </summary>
        public string Username { get; set; }
        
        /// <summary>
        /// Hashed password for the staff member's account
        /// </summary>
        public string PasswordHash { get; set; }
        
        /// <summary>
        /// Current status of the staff member (active, inactive, on leave, etc.)
        /// </summary>
        public string Status { get; set; }
        
        /// <summary>
        /// Full name of the staff member (calculated property)
        /// </summary>
        public string FullName => $"{FirstName} {LastName}";

    public StaffViewModel(Staff user)
    {
        Id = user.Id;
        FirstName = user.FirstName;
        LastName = user.LastName;
        Position = user.Position;
        Department = user.Department;
        Email = user.Email;
        Phone = user.Phone;
        DateHired = user.DateHired.ToDateTime(TimeOnly.MinValue);
        Username = user.Username;
        PasswordHash = user.PasswordHash;
        Status = user.Status;
    }
}

public class StaffCreateViewModel
{
    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? Address { get; set; }

    public string? Phone{ get; set; }
    public string? Email { get; set; }
    [Required]
    public string Position {set;get;}
    public string Department{set;get;}
    public DateOnly? DateOfBirth { get; set; }
    public DateOnly MembershipDate { get; set; }
    public string? Password { get; set; }
    public DateTime DateHired { get; set; }
    public string Username {set;get;}

    public Staff toUserTable()
    {
        Staff user = new Staff();
        user.Id = Utils.ulid(DbPrefixes.Staff);
        user.FirstName = FirstName;
        user.LastName = LastName;
        user.Position = Position;
        user.Department = Department;
        user.Email = Email;
        user.Phone = Phone;
        user.DateHired = DateOnly.FromDateTime(DateHired);
        user.Username = Username;
        user.PasswordHash = Utils.Encode(Password);
        user.Status = (DateHired.Date >= DateTime.Now.Date) ? "active" : "pending";
        return user;
    }

    public Staff UpdateMember(Staff user)
    {
        user.Id = Utils.ulid(DbPrefixes.Staff);
        user.FirstName = FirstName;
        user.LastName = LastName;
        user.Position = Position;
        user.Department = Department;
        user.Email = Email;
        user.Phone = Phone;
        user.DateHired = DateOnly.FromDateTime(DateHired);
        user.Username = Username;
        user.PasswordHash = Utils.Encode(Password);
        user.Status = (DateHired.Date >= DateTime.Now.Date) ? "active" : "pending";
        return user;
    }
}