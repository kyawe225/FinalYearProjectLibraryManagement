using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel;
using LibraryManagement.Infrastructure.ViewModel.LoanTable;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookLoansController : ControllerBase
{
    private readonly LibraryManagementContext _context;

    public BookLoansController(LibraryManagementContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var loans = await _context.BookLoans
            .Include(b => b.Book)
            .Include(b => b.Fines)
            .Include(b => b.Member)
            .ToListAsync();

        var viewModels = loans.Select(l => new LoanViewModel(l)).ToList();
        return Ok(new ResponseModel<List<LoanViewModel>> { status = HttpStatusResponse.OK, data = viewModels });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var loan = await _context.BookLoans
            .Include(b => b.Book)
            .Include(b => b.Fines)
            .Include(b => b.Member)
            .FirstOrDefaultAsync(l => l.LoanId == id);

        if (loan == null)
            return NotFound();

        return Ok(new ResponseModel<LoanViewModel> { status = HttpStatusResponse.OK, data = new LoanViewModel(loan) });
    }

    [HttpGet("member/{memberId}")]
    [Authorize]
    public async Task<IActionResult> GetByMemberId(string memberId)
    {
        var loans = await _context.BookLoans
            .Where(b => b.MemberId == memberId)
            .Include(b => b.Book)
            .Include(b => b.Fines)
            .Include(b => b.Member)
            .ToListAsync();

        var viewModels = loans.Select(l => new LoanViewModel(l)).ToList();
        return Ok(viewModels);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] LoanCreateViewModel model)
    {
        var loan = model.toLoanTable();
        _context.BookLoans.Add(loan);
        await _context.SaveChangesAsync();

        var loaded = await _context.BookLoans
            .Include(b => b.Book)
            .Include(b => b.Fines)
            .Include(b => b.Member)
            .FirstOrDefaultAsync(x => x.LoanId == loan.LoanId);

        return Ok(new LoanViewModel(loaded!));
    }

    [HttpPost("batch")]
    [Authorize]
    public async Task<IActionResult> CreateBatch([FromBody] BatchLoanRequest request)
    {
        var loans = new List<BookLoan>();

        foreach (var bookId in request.BookCopyIds)
        {
            var model = new LoanCreateViewModel
            {
                BookId = bookId,
                MemberId = request.MemberId,
                DateBorrowed = DateOnly.FromDateTime(DateTime.UtcNow),
                DueDate = DateOnly.FromDateTime(request.DueDate),
                Status = "Active"
            };

            loans.Add(model.toLoanTable());
        }

        _context.BookLoans.AddRange(loans);
        await _context.SaveChangesAsync();

        var loanIds = loans.Select(l => l.LoanId).ToList();
        var result = await _context.BookLoans
            .Where(l => loanIds.Contains(l.LoanId))
            .Include(b => b.Book)
            .Include(b => b.Fines)
            .Include(b => b.Member)
            .ToListAsync();

        return Ok(result.Select(l => new LoanViewModel(l)));
    }

    [HttpPatch("{id}/return")]
    [Authorize]
    public async Task<IActionResult> ReturnBook(string id)
    {
        var loan = await _context.BookLoans.FindAsync(id);
        if (loan == null)
            return NotFound();

        loan.DateReturned = DateOnly.FromDateTime(DateTime.UtcNow);
        loan.Status = "Returned";

        await _context.SaveChangesAsync();
        return Ok(new LoanViewModel(await LoadLoan(loan.LoanId)));
    }

    [HttpPatch("{id}/renew")]
    [Authorize]
    public async Task<IActionResult> RenewLoan(string id, [FromBody] RenewLoanRequest request)
    {
        var loan = await _context.BookLoans.FindAsync(id);
        if (loan == null)
            return NotFound();

        loan.DueDate = DateOnly.FromDateTime(request.DueDate);
        await _context.SaveChangesAsync();

        return Ok(new LoanViewModel(await LoadLoan(loan.LoanId)));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(string id)
    {
        var loan = await _context.BookLoans.FindAsync(id);
        if (loan == null)
            return NotFound();

        _context.BookLoans.Remove(loan);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    
    private async Task<BookLoan> LoadLoan(string id)
    {
        return await _context.BookLoans
            .Include(b => b.Book)
            .Include(b => b.Fines)
            .Include(b => b.Member)
            .FirstAsync(l => l.LoanId == id);
    }
}
