using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel;
using LibraryManagement.Infrastructure.ViewModel.Book;
using LibraryManagement.Infrastructure.ViewModel.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ReservationsController : ControllerBase
{
    private readonly LibraryManagementContext _context;
    private readonly ICredentialContext _credential;

    public ReservationsController(LibraryManagementContext context, ICredentialContext credential)
    {
        _context = context;
        _credential = credential;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations(
        [FromQuery] string? member_id,
        [FromQuery] string? book_id,
        [FromQuery] string? status,
        [FromQuery] DateTime? date_from,
        [FromQuery] DateTime? date_to)
    {
        var query = _context.Reservations.Include(r => r.Book).Include(r => r.Member).AsQueryable();

        if (!string.IsNullOrWhiteSpace(member_id))
            query = query.Where(r => r.MemberId == member_id);

        if (!string.IsNullOrWhiteSpace(book_id))
            query = query.Where(r => r.BookId == book_id);

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(r => r.Status == status);

        if (date_from.HasValue)
            query = query.Where(r => r.ReservationDate >= DateOnly.FromDateTime((date_from ?? DateTime.Now).ToUniversalTime().Date));

        if (date_to.HasValue)
            query = query.Where(r => r.ReservationDate <= DateOnly.FromDateTime((date_to ?? DateTime.Now.Date).ToUniversalTime().Date));

        return await query.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Reservation>> GetReservationById(string id)
    {
        var reservation = await _context.Reservations
            .Include(r => r.Book)
            .Include(r => r.Member)
            .FirstOrDefaultAsync(r => r.Id == id);

        return reservation == null ? NotFound() : reservation;
    }

    [HttpPost]
    public async Task<ActionResult<Reservation>> CreateReservation(Reservation reservation)
    {
        reservation.Id = Guid.NewGuid().ToString();
        reservation.ReservationDate = DateOnly.FromDateTime(DateTime.UtcNow.Date);
        reservation.Status = "Active";
        reservation.MemberId = _credential.getUserId();

        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetReservationById), new { id = reservation.Id }, reservation);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateReservation(string id, Reservation updated)
    {
        if (id != updated.Id)
            return BadRequest("ID mismatch");

        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null)
            return NotFound();

        reservation.BookId = updated.BookId;
        reservation.Status = updated.Status;
        reservation.ReservationDate = updated.ReservationDate;
        reservation.MemberId = updated.MemberId;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReservation(string id)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null)
            return NotFound();

        _context.Reservations.Remove(reservation);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateReservationStatus(string id, [FromBody] StatusDto dto)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null)
            return NotFound();

        reservation.Status = dto.Status;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{id}/convert-to-loan")]
    public async Task<IActionResult> ConvertToLoan(string id)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null)
            return NotFound();

        if (reservation.Status != "Active")
            return BadRequest("Only active reservations can be converted");

        var loan = new BookLoan
        {
            LoanId = Guid.NewGuid().ToString(),
            BookId = reservation.BookId,
            MemberId = reservation.MemberId,
            DateBorrowed = DateOnly.FromDateTime(DateTime.UtcNow.Date),
            DueDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(14).Date),
            Status = "Active"
        };

        _context.BookLoans.Add(loan);
        reservation.Status = "Converted";
        await _context.SaveChangesAsync();

        return Ok(loan);
    }

    [HttpGet("statistics")]
    public async Task<ActionResult<object>> GetReservationStatistics()
    {
        var total = await _context.Reservations.CountAsync();
        var active = await _context.Reservations.CountAsync(r => r.Status == "Active");
        var cancelled = await _context.Reservations.CountAsync(r => r.Status == "Cancelled");
        var converted = await _context.Reservations.CountAsync(r => r.Status == "Converted");

        return Ok(new
        {
            total,
            active,
            cancelled,
            converted
        });
    }

    [HttpPost("check")]
    public async Task<ActionResult<bool>> CheckUserReservation([FromBody] CheckReservationDto dto)
    {
        var exists = await _context.Reservations.AnyAsync(r =>
            r.MemberId == dto.UserId &&
            r.BookId == dto.BookId &&
            r.Status == "Active");

        return Ok(exists);
    }

    [HttpGet("top-scheduled-pickups")]
    public async Task<IActionResult> GetTopScheduledPickups([FromQuery] int limit = 5)
    {
        var topReservations = await _context.Reservations
            .Where(r => r.Status == "Active")
            .OrderBy(r => r.ReservationDate)
            .Take(limit)
            .Include(r => r.Member).Include(r => r.Book)
            .Select(p=> new { Member = new UserViewModel(p.Member), Book = new BookViewModel(p.Book) , Id = p.Id, ReservationDate = p.ReservationDate, p.Status, p.BookId,p.MemberId})
            .ToListAsync();

        return Ok(topReservations);
    }

    [HttpPost("cancel")]
    public async Task<ActionResult<ResponseModel<bool>>> CancelReservation([FromBody] CancelDto dto)
    {
        var userId = _credential.getUserId();
        var reservation = await _context.Reservations.FirstOrDefaultAsync(r =>
            r.BookId == dto.BookId && r.MemberId == userId && r.Status == "Active");

        if (reservation == null)
            return NotFound(new ResponseModel<bool>(false, "No active reservation found"));

        reservation.Status = "Cancelled";
        await _context.SaveChangesAsync();

        return Ok(new ResponseModel<bool>(true, "Reservation cancelled"));
    }

    public class StatusDto
    {
        public string Status { get; set; } = string.Empty;
    }

    public class CheckReservationDto
    {
        public string UserId { get; set; } = string.Empty;
        public string BookId { get; set; } = string.Empty;
    }

    public class CancelDto
    {
        public string BookId { get; set; } = string.Empty;
    }
}
