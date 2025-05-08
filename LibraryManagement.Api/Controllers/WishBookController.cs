using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel;
using LibraryManagement.Infrastructure.ViewModel.News;
using LibraryManagement.Infrastructure.ViewModel.WishBook;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WishesController : ControllerBase
{
    private readonly LibraryManagementContext _context;
    private readonly ICredentialContext _credential;

    public WishesController(LibraryManagementContext context, ICredentialContext credential)
    {
        _context = context;
        _credential = credential;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Wish>>> Get([FromQuery] WishFilter filter)
    {
        var query = _context.Wishes.AsQueryable();

        if (!string.IsNullOrEmpty(filter.MemberId))
            query = query.Where(w => w.MemberId == filter.MemberId);

        if (!string.IsNullOrEmpty(filter.BookId))
            query = query.Where(w => w.BookId == filter.BookId);

        if (!string.IsNullOrEmpty(filter.DateFrom))
            query = query.Where(w => w.DateAdded >= DateOnly.FromDateTime(DateTime.Parse(filter.DateFrom)));

        if (!string.IsNullOrEmpty(filter.DateTo))
            query = query.Where(w => w.DateAdded <= DateOnly.FromDateTime(DateTime.Parse(filter.DateTo)));

        return Ok(await query.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Wish>> GetById(string id)
    {
        var wish = await _context.Wishes.FindAsync(id);
        if (wish == null) return NotFound();
        return Ok(wish);
    }

    [HttpPost]
    public async Task<ActionResult<Wish>> Create(WishBookCreateViewModel model)
    {
        var user_id = _credential.getUserId();
        var wish = model.toWishBookTable(user_id);

        _context.Wishes.Add(wish);
        await _context.SaveChangesAsync();
        return Ok(wish);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Wish>> Update(string id, WishBookCreateViewModel model)
    {
        var wish = await _context.Wishes.FindAsync(id);
        if (wish == null) return NotFound();

        wish.Notes = model.Notes;
        await _context.SaveChangesAsync();
        return Ok(wish);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var wish = await _context.Wishes.FindAsync(id);
        if (wish == null) return NotFound();

        _context.Wishes.Remove(wish);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/convert-to-reservation")]
    public async Task<IActionResult> ConvertToReservation(string id)
    {
        var wish = await _context.Wishes.FindAsync(id);
        if (wish == null) return NotFound();

        var reservation = new Reservation
        {
            Id = Guid.NewGuid().ToString(),
            MemberId = wish.MemberId,
            BookId = wish.BookId,
            ReservationDate = DateOnly.FromDateTime(DateTime.Now),
            Status = "Active"
        };

        _context.Reservations.Add(reservation);
        _context.Wishes.Remove(wish);
        await _context.SaveChangesAsync();

        return Ok(new { success = true });
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> GetStatistics()
    {
        var totalWishes = await _context.Wishes.CountAsync();
        var topBooks = await _context.Wishes
            .GroupBy(w => w.BookId)
            .OrderByDescending(g => g.Count())
            .Select(g => new { BookId = g.Key, Count = g.Count() })
            .Take(5)
            .ToListAsync();

        return Ok(new { totalWishes, topBooks });
    }

    [HttpGet("member")]
    public async Task<ActionResult<ResponseModel<List<Wish>>>> GetMemberWishlist()
    {
        var memberId = _credential.getUserId();
        var wishes = await _context.Wishes
            .Where(w => w.MemberId == memberId)
            .ToListAsync();

        return Ok(new ResponseModel<List<Wish>> { status = HttpStatusResponse.OK, data = wishes });
    }

    [HttpGet("check/{bookId}")]
    public async Task<ActionResult<object>> CheckIfInWishlist(string bookId)
    {
        var userId = _credential.getUserId();
        var wish = await _context.Wishes.FirstOrDefaultAsync(w => w.BookId == bookId && w.MemberId == userId);

        return Ok(new
        {
            inWishlist = wish != null,
            wishId = wish?.WishId
        });
    }

    [HttpGet("today")]
    public async Task<IActionResult> GetTodayAppointments([FromQuery] DateTime date)
    {
        var todayAppointments = await _context.Appointments
            .Where(a => a.AppointmentDate == DateOnly.FromDateTime(date.Date))
            .ToListAsync();

        return Ok(todayAppointments);
    }
}
