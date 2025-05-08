using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel;
using LibraryManagement.Infrastructure.ViewModel.Author;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthorsController : ControllerBase
{
    private readonly LibraryManagementContext _context;
    private readonly ICredentialContext _credentialContext;

    public AuthorsController(LibraryManagementContext context, ICredentialContext credentialContext)
    {
        _context = context;
        _credentialContext = credentialContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var authors = await _context.Authors.ToListAsync();
        return Ok(new ResponseModel<List<Author>> { status = HttpStatusResponse.OK, data = authors , message = "fetch successfully" });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var author = await _context.Authors.FindAsync(id);
        if (author == null)
            return NotFound();
        return Ok(new ResponseModel<Author> { status = HttpStatusResponse.OK, data = author , message = "get successfully" });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] AuthorViewModel model)
    {
        model.AuthorId = Guid.NewGuid().ToString();
        _context.Authors.Add(model.toAuthor());
        await _context.SaveChangesAsync();
        return Ok(new ResponseModel<AuthorViewModel> () { status = HttpStatusResponse.OK, data = model , message = "created successfully" });
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(string id, [FromBody] AuthorViewModel updated)
    {
        var author = await _context.Authors.FindAsync(id);
        if (author == null)
            return NotFound();

        updated.updateAuthor(author);

        await _context.SaveChangesAsync();
        return Ok(new ResponseModel<Author> { status = HttpStatusResponse.OK, data = author });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(string id)
    {
        var author = await _context.Authors.FindAsync(id);
        if (author == null)
            return NotFound();

        _context.Authors.Remove(author);
        await _context.SaveChangesAsync();
        return Ok(new ResponseModel<string> { status = HttpStatusResponse.OK, data = id });
    }
}
