using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ComputersController : ControllerBase
{
    private readonly LibraryManagementContext _context;

    public ComputersController(LibraryManagementContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ResponseModel<IEnumerable<Computer>>>> GetComputers(
        [FromQuery] string? branch_id,
        [FromQuery] string? computer_type,
        [FromQuery] string? status,
        [FromQuery] string? search)
    {
        var query = _context.Computers.AsQueryable();

        if (!string.IsNullOrWhiteSpace(branch_id))
            query = query.Where(c => c.BranchId == branch_id);

        if (!string.IsNullOrWhiteSpace(computer_type))
            query = query.Where(c => c.ComputerType == computer_type);

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(c => c.Status == status);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(c =>
                c.ComputerName.Contains(search) ||
                c.LocationInLibrary.Contains(search) ||
                c.Specifications.Contains(search));

        var result = await query.ToListAsync();
        return Ok(new ResponseModel<IEnumerable<Computer>>(result, "Computer list fetched successfully"));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Computer>> GetComputerById(string id)
    {
        var computer = await _context.Computers.FindAsync(id);
        if (computer == null)
            return NotFound();

        return computer;
    }

    [HttpPost]
    public async Task<ActionResult<ResponseModel<Computer>>> CreateComputer(Computer computer)
    {
        computer.ComputerId = Guid.NewGuid().ToString();
        computer.AcquisitionDate = DateOnly.FromDateTime(DateTime.UtcNow);

        _context.Computers.Add(computer);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetComputerById), new { id = computer.ComputerId },
            new ResponseModel<Computer>(computer, "Computer created successfully"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ResponseModel<Computer>>> UpdateComputer(string id, Computer updated)
    {
        if (id != updated.ComputerId)
            return BadRequest("Computer ID mismatch");

        var existing = await _context.Computers.FindAsync(id);
        if (existing == null)
            return NotFound();

        existing.ComputerName = updated.ComputerName;
        existing.ComputerType = updated.ComputerType;
        existing.Specifications = updated.Specifications;
        existing.OperatingSystem = updated.OperatingSystem;
        existing.LocationInLibrary = updated.LocationInLibrary;
        existing.Status = updated.Status;
        existing.TimeLimitMinutes = updated.TimeLimitMinutes;
        existing.LastMaintenanceDate = updated.LastMaintenanceDate;

        await _context.SaveChangesAsync();

        return Ok(new ResponseModel<Computer>(existing, "Computer updated successfully"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ResponseModel<bool>>> DeleteComputer(string id)
    {
        var computer = await _context.Computers.FindAsync(id);
        if (computer == null)
            return NotFound(new ResponseModel<bool>(false, "Computer not found"));

        _context.Computers.Remove(computer);
        await _context.SaveChangesAsync();

        return Ok(new ResponseModel<bool>(true, "Computer deleted successfully"));
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<ResponseModel<Computer>>> UpdateComputerStatus(string id, [FromBody] StatusUpdateDto dto)
    {
        var computer = await _context.Computers.FindAsync(id);
        if (computer == null)
            return NotFound(new ResponseModel<Computer>(null!, "Computer not found"));

        computer.Status = dto.Status;
        await _context.SaveChangesAsync();

        return Ok(new ResponseModel<Computer>(computer, "Status updated successfully"));
    }

    [HttpPatch("{id}/maintenance")]
    public async Task<ActionResult<ResponseModel<Computer>>> ScheduleMaintenance(string id, [FromBody] MaintenanceDto dto)
    {
        var computer = await _context.Computers.FindAsync(id);
        if (computer == null)
            return NotFound(new ResponseModel<Computer>(null!, "Computer not found"));

        if (DateTime.TryParse(dto.MaintenanceDate, out var maintenanceDate))
        {
            computer.LastMaintenanceDate = DateOnly.FromDateTime(maintenanceDate.Date.ToUniversalTime());
            await _context.SaveChangesAsync();
            return Ok(new ResponseModel<Computer>(computer, "Maintenance date scheduled"));
        }

        return BadRequest(new ResponseModel<Computer>(null!, "Invalid maintenance date format"));
    }

    public class StatusUpdateDto
    {
        public string Status { get; set; } = string.Empty;
    }

    public class MaintenanceDto
    {
        public string MaintenanceDate { get; set; } = string.Empty;
    }
}
