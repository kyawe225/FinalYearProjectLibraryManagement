using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure;
using LibraryManagement.Infrastructure.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EventsController : ControllerBase
{
    private readonly LibraryManagementContext _context;
    private readonly ICredentialContext _credential;

    public EventsController(LibraryManagementContext context, ICredentialContext credentialContext)
    {
        _context = context;
        _credential = credentialContext;
    }

    [HttpGet]
    public async Task<ActionResult<ResponseModel<IEnumerable<Event>>>> GetAll()
    {
        var events = await _context.Events.ToListAsync();
        return Ok(new ResponseModel<IEnumerable<Event>>(events, "Event list fetched successfully"));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ResponseModel<Event>>> GetDetail(string id)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null)
            return NotFound(new ResponseModel<Event>(null!, "Event not found"));

        return Ok(new ResponseModel<Event>(ev, "Event found"));
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ResponseModel<Event>>> Create(Event ev)
    {
        ev.EventId = Guid.NewGuid().ToString();
        _context.Events.Add(ev);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDetail), new { id = ev.EventId },
            new ResponseModel<Event>(ev, "Event created successfully"));
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<ResponseModel<Event>>> Update(string id, Event updated)
    {
        if (id != updated.EventId)
            return BadRequest(new ResponseModel<Event>(null!, "Event ID mismatch"));

        var ev = await _context.Events.FindAsync(id);
        if (ev == null)
            return NotFound(new ResponseModel<Event>(null!, "Event not found"));

        ev.EventName = updated.EventName;
        ev.Description = updated.Description;
        ev.EventDate = updated.EventDate;
        ev.StartTime = updated.StartTime;
        ev.EndTime = updated.EndTime;
        ev.EventStatus = updated.EventStatus;
        ev.EventType = updated.EventType;
        ev.MaxAttendees = updated.MaxAttendees;
        ev.BranchId = updated.BranchId;
        ev.OrganizerId = updated.OrganizerId;
        ev.CurrentAttendees = updated.CurrentAttendees;
        ev.RegistrationRequired = updated.RegistrationRequired;

        await _context.SaveChangesAsync();

        return Ok(new ResponseModel<Event>(ev, "Event updated successfully"));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult<ResponseModel<bool>>> Delete(string id)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null)
            return NotFound(new ResponseModel<bool>(false, "Event not found"));

        _context.Events.Remove(ev);
        await _context.SaveChangesAsync();

        return Ok(new ResponseModel<bool>(true, "Event deleted successfully"));
    }

    public class ResponseModel<T>
    {
        public T Data { get; set; }
        public string Message { get; set; }
        public string Status => "ok";

        public ResponseModel(T data, string message)
        {
            Data = data;
            Message = message;
        }
    }
}
