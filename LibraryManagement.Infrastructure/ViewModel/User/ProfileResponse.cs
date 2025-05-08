using LibraryManagement.Core.Entities;

namespace LibraryManagement.Infrastructure.ViewModel.User;

public class ProfileResponse
{
    public string Name { set; get; }
    public string Email { set; get; }
    public string PhoneNumber { set; get; }
    public DateOnly DateJoined { set; get; }
    public string Status { set; get; }
    public string Role { set; get; }

    public ProfileResponse(Staff staff)
    {
        Name = $"{staff.FirstName} {staff.LastName}";
        Email = staff.Email;
        PhoneNumber = staff.Phone;
        DateJoined = staff.DateHired;
        Status = staff.Status;
        Role = "staff";
    }

    public ProfileResponse(Member member)
    {
        Name = $"{member.FirstName} {member.LastName}";
        Email = member.Email;
        PhoneNumber = member.PhoneNumber;
        DateJoined = member.MembershipDate;
        Status = member.MembershipStatus;
        Role = "member";
    }
}