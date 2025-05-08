using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure;
using LibraryManagement.Infrastructure.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
//completed
public class ComputerReservationsController : ControllerBase
{
    private readonly LibraryManagementContext _context;
    private readonly ICredentialContext _credential;

    public ComputerReservationsController(LibraryManagementContext context, ICredentialContext credential)
    {
        _context = context;
        _credential = credential;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ComputerReservation>>> GetReservations(
        [FromQuery] string? computer_id,
        [FromQuery] string? member_id,
        [FromQuery] DateTime? date_from,
        [FromQuery] DateTime? date_to,
        [FromQuery] string? status,
        [FromQuery] string? branch_id)
    {
        var query = _context.ComputerReservations
            .Include(r => r.Computer)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(computer_id))
            query = query.Where(r => r.ComputerId == computer_id);

        if (!string.IsNullOrWhiteSpace(member_id))
            query = query.Where(r => r.MemberId == member_id);

        if (date_from.HasValue)
        {
            DateTime dt_from = date_from ?? DateTime.Now;
             query = query.Where(r => r.ReservationDate >= DateOnly.FromDateTime(dt_from));
        }


        if (date_to.HasValue)
        {
            DateTime dt_to = date_to ?? DateTime.Now;
            query = query.Where(r => r.ReservationDate <= DateOnly.FromDateTime(dt_to));
        }
        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(r => r.Status == status);

        if (!string.IsNullOrWhiteSpace(branch_id))
            query = query.Where(r => r.Computer.BranchId == branch_id);

        return await query.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ComputerReservation>> GetReservationById(string id)
    {
        var reservation = await _context.ComputerReservations.FindAsync(id);

        return reservation == null ? NotFound() : reservation;
    }

    [HttpPost]
    public async Task<ActionResult<ComputerReservation>> CreateReservation(ComputerReservation reservation)
    {
        reservation.ReservationId = Guid.NewGuid().ToString();
        reservation.CreatedDate = DateTime.UtcNow;
        reservation.MemberId = _credential.getUserId();

        _context.ComputerReservations.Add(reservation);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetReservationById), new { id = reservation.ReservationId }, reservation);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateReservation(string id, ComputerReservation updated)
    {
        if (id != updated.ReservationId)
            return BadRequest("ID mismatch");

        var existing = await _context.ComputerReservations.FindAsync(id);
        if (existing == null)
            return NotFound();

        if (existing.MemberId != _credential.getUserId())
            return Forbid();

        existing.ComputerId = updated.ComputerId;
        existing.ReservationDate = updated.ReservationDate;
        existing.StartTime = updated.StartTime;
        existing.EndTime = updated.EndTime;
        existing.Status = updated.Status;

        _context.Entry(existing).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReservation(string id)
    {
        var reservation = await _context.ComputerReservations.FindAsync(id);
        if (reservation == null)
            return NotFound();

        if (reservation.MemberId != _credential.getUserId())
            return Forbid();

        _context.ComputerReservations.Remove(reservation);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] StatusUpdateDto dto)
    {
        var reservation = await _context.ComputerReservations.FindAsync(id);
        if (reservation == null)
            return NotFound();

        reservation.Status = dto.Status;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("available-timeslots")]
    public async Task<ActionResult<IEnumerable<object>>> GetAvailableTimeslots(
        [FromQuery] List<string> computer_id,
        [FromQuery] DateTime date)
    {
        var reservations = await _context.ComputerReservations
            .Where(r => computer_id.Contains(r.ComputerId) && r.ReservationDate == DateOnly.FromDateTime(date))
            .ToListAsync();

        // Example timeslot format (customize as needed)
        var grouped = reservations
            .GroupBy(r => r.ComputerId)
            .Select(g => new
            {
                ComputerId = g.Key,
                Timeslots = g.Select(r => new { r.StartTime, r.EndTime }).ToList()
            });

        return Ok(grouped);
    }

    [HttpGet("check-overlap")]
    public async Task<ActionResult<object>> CheckOverlap(
        [FromQuery] string computer_id,
        [FromQuery] DateTime date,
        [FromQuery] TimeSpan start_time,
        [FromQuery] TimeSpan end_time,
        [FromQuery] string? reservation_id = null)
    {
        var overlaps = await _context.ComputerReservations
            .Where(r => r.ComputerId == computer_id && r.ReservationDate == DateOnly.FromDateTime(date))
            .Where(r => r.ReservationId != reservation_id)
            .Where(r => start_time < r.EndTime.ToTimeSpan() && end_time > r.StartTime.ToTimeSpan())
            .AnyAsync();

        return Ok(new { overlap = overlaps });
    }

    public class StatusUpdateDto
    {
        public string Status { get; set; } = string.Empty;
    }
}
