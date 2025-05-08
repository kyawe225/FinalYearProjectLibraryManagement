using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.Repository;
using LibraryManagement.Infrastructure.ViewModel;
using LibraryManagement.Infrastructure.ViewModel.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MembersController : ControllerBase
{
    private readonly IUserRepository _memberService;
    private readonly LibraryManagementContext _context;

    public MembersController(LibraryManagementContext context, IUserRepository memberService)
    {
        _context = context;
        _memberService = memberService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var members = await _context.Members.ToListAsync();
        return Ok(new ResponseModel<List<Member>>
        {
            status = HttpStatusResponse.OK,
            data = members
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var member = await _context.Members.FindAsync(id);
        if (member == null)
            return NotFound();

        return Ok(new ResponseModel<Member>
        {
            status = HttpStatusResponse.OK,
            data = member
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserCreateViewModel model)
    {
        var member = model.toUserTable();
        member.MembershipDate = DateOnly.FromDateTime(DateTime.UtcNow);
        member.MembershipStatus = "Active";

        _context.Members.Add(member);
        await _context.SaveChangesAsync();

        return Ok(member);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Member updated)
    {
        var member = await _context.Members.FindAsync(id);
        if (member == null)
            return NotFound();

        member.FirstName = updated.FirstName;
        member.LastName = updated.LastName;
        member.Email = updated.Email;
        member.PhoneNumber = updated.PhoneNumber;
        member.Address = updated.Address;
        member.DateOfBirth = updated.DateOfBirth;
        member.MembershipExpiry = updated.MembershipExpiry;

        await _context.SaveChangesAsync();
        return Ok(member);
    }

    [HttpPatch("{id}/close")]
    public async Task<IActionResult> CloseAccount(string id)
    {
        var member = await _context.Members.FindAsync(id);
        if (member == null)
            return NotFound();

        member.MembershipStatus = "Closed";
        await _context.SaveChangesAsync();

        return Ok(new { success = true });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var member = await _context.Members.FindAsync(id);
        if (member == null)
            return NotFound();

        _context.Members.Remove(member);
        await _context.SaveChangesAsync();

        return NoContent();
    }
    [HttpGet("profile")]
    [Authorize]
    public IActionResult GetProfile()
    {
        return Ok(_memberService.Profile());
    }
}
