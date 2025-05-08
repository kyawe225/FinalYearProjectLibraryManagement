using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffsController : ControllerBase
    {
        private readonly LibraryManagementContext _context;
        private readonly ICredentialContext _credential;

        public StaffsController(LibraryManagementContext context, ICredentialContext credential)
        {
            _context = context;
            _credential = credential;
        }

        [HttpGet]
        public async Task<ActionResult<ResponseModel<List<Staff>>>> GetAll()
        {
            var staffList = await _context.Staff.ToListAsync();
            return Ok(new ResponseModel<List<Staff>> { status = HttpStatusResponse.OK, data = staffList });
        }

        [HttpPost]
        public async Task<ActionResult<ResponseModel<bool>>> Create([FromBody] Staff model)
        {
            model.Id = Guid.NewGuid().ToString();
            _context.Staff.Add(model);
            await _context.SaveChangesAsync();
            return Ok(new ResponseModel<bool> { status = HttpStatusResponse.OK, data = true });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResponseModel<bool>>> Update(string id, [FromBody] Staff model)
        {
            var existing = await _context.Staff.FindAsync(id);
            if (existing == null)
                return NotFound(new ResponseModel<bool> { status = HttpStatusResponse.FAILED, data = false });

            existing.FirstName = model.FirstName;
            existing.LastName = model.LastName;
            existing.Email = model.Email;
            existing.Phone = model.Phone;
            existing.Department = model.Department;
            existing.Position = model.Position;
            existing.Status = model.Status;

            _context.Staff.Update(existing);
            await _context.SaveChangesAsync();

            return Ok(new ResponseModel<bool> { status = HttpStatusResponse.OK, data = true });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseModel<bool>>> Delete(string id)
        {
            var staff = await _context.Staff.FindAsync(id);
            if (staff == null)
                return NotFound(new ResponseModel<bool> { status = HttpStatusResponse.FAILED, data = false });

            _context.Staff.Remove(staff);
            await _context.SaveChangesAsync();

            return Ok(new ResponseModel<bool> { status = HttpStatusResponse.OK, data = true });
        }
    }
}
