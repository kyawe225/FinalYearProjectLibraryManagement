using LibraryManagement.Core.Entities;
using LibraryManagement.Core.ViewModel.Appointment;
using LibraryManagement.Infrastructure;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Api.Controllers;

[ApiController]
[Route("api/appointments")]
[Authorize]
public class AppointmentController : ControllerBase
{
    private readonly LibraryManagementContext _context;
    private readonly ICredentialContext _credentialContext;

    public AppointmentController(LibraryManagementContext context, ICredentialContext credentialContext)
    {
        _context = context;
        _credentialContext = credentialContext;
    }
    [HttpGet("today")]
    public async Task<IActionResult> GetTodayAppointments([FromQuery] DateTime date)
    {
        var todayAppointments = await _context.Appointments
            .Where(a => a.AppointmentDate == DateOnly.FromDateTime(date.Date))
            .ToListAsync();

        return Ok( todayAppointments.Count);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var appointments = await _context.Appointments.ToListAsync();
        return Ok(appointments);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null)
            return NotFound();
        return Ok(new ResponseModel<AppointmentViewModel> { data = new AppointmentViewModel(appointment) });
    }

    [HttpGet("member/{memberId}")]
    public async Task<IActionResult> GetByMemberId(string memberId)
    {
        var appointments = await _context.Appointments
            .Where(a => a.MemberId == memberId)
            .ToListAsync();
        return Ok(appointments);
    }

    [HttpGet("member/{memberId}/counts")]
    public async Task<IActionResult> GetCountsByStatus(string memberId)
    {
        var counts = await _context.Appointments
            .Where(a => a.MemberId == memberId)
            .GroupBy(a => a.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Status, x => x.Count);
        return Ok(counts);
    }

    [HttpGet("check-availability")]
    public async Task<IActionResult> CheckAvailability([FromQuery] string staffId, [FromQuery] DateTime date, [FromQuery] string startTime, [FromQuery] string endTime)
    {
        TimeSpan start = TimeSpan.Parse(startTime);
        TimeSpan end = TimeSpan.Parse(endTime);

        bool isAvailable = !await _context.Appointments.AnyAsync(a =>
            a.StaffId == staffId &&
            a.AppointmentDate == DateOnly.FromDateTime(date) &&
            a.StartTime < TimeOnly.FromTimeSpan(end) &&
            a.EndTime > TimeOnly.FromTimeSpan(start) &&
            a.Status != "Cancelled");

        return Ok(isAvailable);
    }

    [HttpGet("filter")]
    public async Task<IActionResult> GetFiltered([FromQuery] string? memberId, [FromQuery] string? staffId, [FromQuery] string? branchId, [FromQuery] string? status, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var query = _context.Appointments.AsQueryable();

        if (!string.IsNullOrEmpty(memberId))
            query = query.Where(a => a.MemberId == memberId);
        if (!string.IsNullOrEmpty(staffId))
            query = query.Where(a => a.StaffId == staffId);
        if (!string.IsNullOrEmpty(branchId))
            query = query.Where(a => a.BranchId == branchId);
        if (!string.IsNullOrEmpty(status))
            query = query.Where(a => a.Status == status);
        if (startDate.HasValue)
            query = query.Where(a => a.AppointmentDate >= DateOnly.FromDateTime(startDate.Value));
        if (endDate.HasValue)
            query = query.Where(a => a.AppointmentDate <= DateOnly.FromDateTime(endDate.Value));

        var filteredAppointments = await query.ToListAsync();
        return Ok(filteredAppointments);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Appointment model)
    {
        model.AppointmentId = Guid.NewGuid().ToString();
        model.CreatedDate = DateTime.UtcNow;
        _context.Appointments.Add(model);
        await _context.SaveChangesAsync();
        return Ok(model);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Appointment updated)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null)
            return NotFound();

        appointment.AppointmentDate = updated.AppointmentDate;
        appointment.StartTime = updated.StartTime;
        appointment.EndTime = updated.EndTime;
        appointment.Purpose = updated.Purpose;
        appointment.Notes = updated.Notes;
        appointment.Status = updated.Status;
        appointment.StaffId = updated.StaffId;
        appointment.BranchId = updated.BranchId;
        appointment.ModifiedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(appointment);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] string status)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null)
            return NotFound();

        appointment.Status = status;
        appointment.ModifiedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return Ok(appointment);
    }

    [HttpPatch("{id}/cancel")]
    public async Task<IActionResult> Cancel(string id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null)
            return NotFound();

        appointment.Status = "Cancelled";
        appointment.ModifiedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return Ok(appointment);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null)
            return NotFound();

        _context.Appointments.Remove(appointment);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("member")]
    [Authorize]
    public async Task<IActionResult> GetAppointmentsForLoggedInMember()
    {
        var userId = _credentialContext.getUserId();
        var appointments = await _context.Appointments
            .Where(a => a.MemberId == userId)
            .ToListAsync();
        return Ok(appointments);
    }
}
