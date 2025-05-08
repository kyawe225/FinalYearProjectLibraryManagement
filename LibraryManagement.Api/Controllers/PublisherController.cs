using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PublishersController : ControllerBase
{
    private readonly LibraryManagementContext _context;

    public PublishersController(LibraryManagementContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 0,
        [FromQuery] int pageSize = 10,
        [FromQuery] string sortField = "Name",
        [FromQuery] string sortDirection = "asc",
        [FromQuery] string? filter = "")
    {
        var query = _context.Publishers.AsQueryable();

        if (!string.IsNullOrEmpty(filter))
        {
            query = query.Where(p => p.Name.ToLower().Contains(filter.ToLower()));
        }

        // Sorting
        query = sortField.ToLower() switch
        {
            "name" when sortDirection == "desc" => query.OrderByDescending(p => p.Name),
            "name" => query.OrderBy(p => p.Name),
            _ => query.OrderBy(p => p.Name)
        };

        // Pagination
        var totalItems = await query.CountAsync();
        var items = await query
            .Skip(page * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var response = new PaginatedResponseModel<List<Publishers>>
        {
            status = HttpStatusResponse.OK,
            data = items,
            total = totalItems
        };

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var publisher = await _context.Publishers.FindAsync(id);
        if (publisher == null)
            return NotFound();

        return Ok(new ResponseModel<Publishers>
        {
            status = HttpStatusResponse.OK,
            data = publisher
        });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] Publishers publisher)
    {
        publisher.PublisherId = Guid.NewGuid().ToString();
        _context.Publishers.Add(publisher);
        await _context.SaveChangesAsync();

        return Ok(new ResponseModel<Publishers>
        {
            status = HttpStatusResponse.OK,
            data = publisher
        });
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(string id, [FromBody] Publishers updated)
    {
        var publisher = await _context.Publishers.FindAsync(id);
        if (publisher == null)
            return NotFound();

        publisher.Name = updated.Name;
        publisher.Address = updated.Address;
        publisher.ContactPerson = updated.ContactPerson;
        publisher.Email = updated.Email;
        publisher.Phone = updated.Phone;
        publisher.Website = updated.Website;

        await _context.SaveChangesAsync();

        return Ok(new ResponseModel<Publishers>
        {
            status = HttpStatusResponse.OK,
            data = publisher
        });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(string id)
    {
        var publisher = await _context.Publishers.FindAsync(id);
        if (publisher == null)
            return NotFound();

        _context.Publishers.Remove(publisher);
        await _context.SaveChangesAsync();

        return Ok(new ResponseModel<Publishers>
        {
            status = HttpStatusResponse.OK,
            data = publisher
        });
    }
}
