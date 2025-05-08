using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
// completed
public class FinesController : ControllerBase
{
    private readonly LibraryManagementContext _context;

    public FinesController(LibraryManagementContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Fine>>> GetFines(
        [FromQuery] string? member_id,
        [FromQuery] string? loan_id,
        [FromQuery] string? payment_status,
        [FromQuery] DateTime? date_from,
        [FromQuery] DateTime? date_to,
        [FromQuery] decimal? min_amount,
        [FromQuery] decimal? max_amount)
    {
        var query = _context.Fines.AsQueryable();

        if (!string.IsNullOrWhiteSpace(member_id))
            query = query.Where(f => f.MemberId == member_id);
        if (!string.IsNullOrWhiteSpace(loan_id))
            query = query.Where(f => f.LoanId == loan_id);
        if (!string.IsNullOrWhiteSpace(payment_status))
            query = query.Where(f => f.PaymentStatus == payment_status);
        if (date_from.HasValue)
            query = query.Where(f => f.FineDate >= DateOnly.FromDateTime(date_from ?? DateTime.UtcNow));
        if (date_to.HasValue)
            query = query.Where(f => f.FineDate <= DateOnly.FromDateTime(date_to ?? DateTime.UtcNow));
        if (min_amount.HasValue)
            query = query.Where(f => f.FineAmount >= min_amount);
        if (max_amount.HasValue)
            query = query.Where(f => f.FineAmount <= max_amount);

        return await query.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Fine>> GetFineById(string id)
    {
        var fine = await _context.Fines.FindAsync(id);
        return fine == null ? NotFound() : fine;
    }

    [HttpPost]
    public async Task<ActionResult<Fine>> CreateFine(Fine fine)
    {
        fine.FineId = Guid.NewGuid().ToString();
        fine.FineDate = DateOnly.FromDateTime(DateTime.UtcNow);

        _context.Fines.Add(fine);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFineById), new { id = fine.FineId }, fine);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFine(string id, Fine updated)
    {
        if (id != updated.FineId)
            return BadRequest("ID mismatch");

        var existing = await _context.Fines.FindAsync(id);
        if (existing == null)
            return NotFound();

        existing.FineAmount = updated.FineAmount;
        existing.PaymentStatus = updated.PaymentStatus;
        existing.PaymentDate = updated.PaymentDate;
        existing.MemberId = updated.MemberId;
        existing.LoanId = updated.LoanId;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFine(string id)
    {
        var fine = await _context.Fines.FindAsync(id);
        if (fine == null)
            return NotFound();

        _context.Fines.Remove(fine);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPatch("{id}/payment")]
    public async Task<ActionResult<Fine>> RecordPayment(string id, [FromBody] PaymentDto dto)
    {
        var fine = await _context.Fines.FindAsync(id);
        if (fine == null)
            return NotFound();

        fine.PaymentStatus = "Paid";
        fine.PaymentDate = DateOnly.FromDateTime(DateTime.Parse(dto.PaymentDate));

        if (dto.FineAmount.HasValue)
            fine.FineAmount = dto.FineAmount.Value;

        await _context.SaveChangesAsync();
        return Ok(fine);
    }

    [HttpPatch("{id}/waive")]
    public async Task<ActionResult<Fine>> WaiveFine(string id, [FromBody] WaiveDto dto)
    {
        var fine = await _context.Fines.FindAsync(id);
        if (fine == null)
            return NotFound();

        fine.FineAmount = 0;
        fine.PaymentStatus = "Waived";
        fine.PaymentDate = DateOnly.FromDateTime(DateTime.UtcNow);
        // You could store `dto.Reason` in a new column if available

        await _context.SaveChangesAsync();
        return Ok(fine);
    }

    [HttpGet("calculate/{loanId}")]
    public async Task<ActionResult<object>> CalculateFine(string loanId)
    {
        var loan = await _context.BookLoans.FindAsync(loanId);
        if (loan == null || loan.DueDate == null || loan.DateReturned == null)
            return BadRequest("Invalid loan data");

        var daysOverdue = (loan.DateReturned?.DayNumber ?? DateOnly.MinValue.DayNumber)- loan.DueDate.DayNumber;
        var amount = daysOverdue > 0 ? daysOverdue * 1.00m : 0;

        return Ok(new { amount, days_overdue = Math.Max(0, daysOverdue) });
    }

    [HttpGet("statistics")]
    public async Task<ActionResult<object>> GetStatistics()
    {
        var totalFines = await _context.Fines.CountAsync();
        var totalAmount = await _context.Fines.SumAsync(f => f.FineAmount);
        var paidCount = await _context.Fines.CountAsync(f => f.PaymentStatus == "Paid");
        var unpaidCount = totalFines - paidCount;

        return Ok(new
        {
            total_fines = totalFines,
            total_amount = totalAmount,
            paid_count = paidCount,
            unpaid_count = unpaidCount
        });
    }

    public class PaymentDto
    {
        public string PaymentDate { get; set; } = string.Empty;
        public decimal? FineAmount { get; set; }
    }

    public class WaiveDto
    {
        public string Reason { get; set; } = string.Empty;
    }
}
