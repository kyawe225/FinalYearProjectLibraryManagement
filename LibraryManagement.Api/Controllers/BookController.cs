using System.Diagnostics.CodeAnalysis;
using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.Repository;
using LibraryManagement.Infrastructure.ViewModel;
using LibraryManagement.Infrastructure.ViewModel.Book;
using LibraryManagement.Infrastructure.ViewModel.Category;
using LibraryManagement.Infrastructure.ViewModel.WishBook;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
[Authorize]
public class BookController : ControllerBase
{
    private readonly IBookRepository _repository;
    private readonly ILogger<BookController> _logger;
    private readonly LibraryManagementContext _context;
    private readonly ICredentialContext _credentialContext;

    public BookController(IBookRepository repository, ILogger<BookController> logger, LibraryManagementContext context, ICredentialContext credentialContext)
    {
        _repository = repository;
        _logger = logger;
        _context = context;
        _credentialContext = credentialContext;
    }

    [HttpGet("{Id}")]
    [AllowAnonymous]
    public async Task<IActionResult> Index(string Id)
    {
        return Ok(new ResponseModel<BookViewModel>()
        { status = HttpStatusResponse.OK, data = await _repository.FindById(Id), message = "fetch Successfully" });
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Index()
    {
        return Ok(new ResponseModel<IEnumerable<BookViewModel>>()
        { status = HttpStatusResponse.OK, data = await _repository.GetAll(), message = "fetch Successfully" });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BookCreateViewModel model)
    {
        bool result = _repository.Create(model);
        if (result == true)
        {
            return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.OK, message = "Created Successfully", data = true });
        }
        return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.FAILED, message = "Failed to create Category" });
    }

    [HttpPut("{Id}")]
    public async Task<IActionResult> Update(string Id, [FromBody] BookCreateViewModel model)
    {
        bool result = _repository.Update(Id, model);
        if (result == true)
        {
            return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.OK, message = "Updated Successfully", data = true });
        }
        return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.FAILED, message = "Failed to update Category" });
    }

    [HttpDelete("{Id}")]
    public async Task<IActionResult> Delete(string Id)
    {
        bool result = _repository.Delete(Id);
        if (result == true)
        {
            return Ok(new ResponseModel<bool>() { status = HttpStatusResponse.OK, data = true, message = "Deleted Successfully" });
        }
        return Ok(new ResponseModel<bool>()
        { status = HttpStatusResponse.FAILED, data = false, message = "Failed to Delete Category" });
    }

    [HttpPost("search")]
    [AllowAnonymous]
    public async Task<IActionResult> Search([FromBody] BookFilter request)
    {
        return Ok(this._repository.Search(request));
    }
    [HttpGet]
    [Route("categories")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBookCategories([AllowNull] string? bookId)
    {
        Book books = new();
        if (!string.IsNullOrEmpty(bookId))
        {
            books = await _context.Set<Book>().Where(x => x.BookId == bookId).Include(p => p.Category).AsNoTracking().FirstOrDefaultAsync();
        }
        else
        {
            books = await _context.Set<Book>().Include(p => p.Category).AsNoTracking().FirstOrDefaultAsync();
        }
        return Ok(new ResponseModel<CategoryViewModel>() { data = new CategoryViewModel(books.Category), message = "fetch category successfully", status = "OK" });
    }

    [HttpGet("wishlist")]
    [Authorize]
    public async Task<IActionResult> GetWishList()
    {
        var user_id = _credentialContext.getUserId();
        var books = await _context.Set<Wish>().Where(p => p.MemberId == user_id).Include(p => p.Book).AsNoTracking().ToListAsync();
        return Ok(books);
    }

    [HttpGet("barcode/{barcode}")]
    public async Task<IActionResult> GetBookByBarcode(string barcode)
    {
        var book = await _context.Books
            .Include(b => b.Category)
            .Include(b => b.Publisher)
            .FirstOrDefaultAsync(b => b.Isbn == barcode);

        if (book == null)
            return NotFound(new ResponseModel<string> { status = HttpStatusResponse.FAILED, message = "Book not found", data = null });

        return Ok(new ResponseModel<BookViewModel>
        {
            status = HttpStatusResponse.OK,
            message = "Fetched book by barcode successfully",
            data = new BookViewModel(book)
        });
    }

    [HttpGet("isbn/{isbn}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBookByIsbn(string isbn)
    {
        var book = await _context.Books
            .Include(b => b.Category)
            .Include(b => b.Publisher)
            .FirstOrDefaultAsync(b => b.Isbn == isbn);

        if (book == null)
            return NotFound(new ResponseModel<string> { status = HttpStatusResponse.FAILED, message = "Book not found", data = null });

        return Ok(new ResponseModel<BookViewModel>
        {
            status = HttpStatusResponse.OK,
            message = "Fetched book by ISBN successfully",
            data = new BookViewModel(book)
        });
    }

    [HttpGet("category/{categoryId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBooksByCategory(string categoryId, [FromQuery] int limit = 10)
    {
        var books = await _context.Books
            .Where(b => b.CategoryId == categoryId)
            .Take(limit)
            .Include(b => b.Category)
            .Include(b => b.Publisher)
            .ToListAsync();

        return Ok(new ResponseModel<IEnumerable<BookViewModel>>
        {
            status = HttpStatusResponse.OK,
            message = "Fetched books by category successfully",
            data = books.Select(b => new BookViewModel(b))
        });
    }

    [HttpGet("popular")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPopularBooks([FromQuery] int limit = 10)
    {
        var books = await _context.Books
            .OrderByDescending(b => b.BookLoans.Count)
            .Take(limit)
            .Include(b => b.Category)
            .Include(b => b.Publisher)
            .ToListAsync();

        return Ok(new ResponseModel<IEnumerable<BookViewModel>>
        {
            status = HttpStatusResponse.OK,
            message = "Fetched popular books successfully",
            data = books.Select(b => new BookViewModel(b))
        });
    }

    [HttpGet("recent")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRecentlyAddedBooks([FromQuery] int limit = 10)
    {
        var books = await _context.Books
            .OrderByDescending(b => b.AddedDate)
            .Take(limit)
            .Include(b => b.Category)
            .Include(b => b.Publisher)
            .ToListAsync();

        return Ok(new ResponseModel<IEnumerable<BookViewModel>>
        {
            status = HttpStatusResponse.OK,
            message = "Fetched recently added books successfully",
            data = books.Select(b => new BookViewModel(b))
        });
    }

    [HttpGet("{bookId}/availability")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBookAvailability(string bookId)
    {
        var book = await _context.Books.FindAsync(bookId);
        if (book == null)
            return NotFound(new ResponseModel<string> { status = HttpStatusResponse.FAILED, message = "Book not found", data = null });

        return Ok(new ResponseModel<object>
        {
            status = HttpStatusResponse.OK,
            message = "Fetched book availability successfully",
            data = new { available = book.AvailableCopies > 0, total_copies = book.TotalCopies, available_copies = book.AvailableCopies }
        });
    }

    [HttpDelete("wishlist/{bookId}")]
    [Authorize]
    public async Task<IActionResult> RemoveFromWishlist(string bookId)
    {
        var userId = _credentialContext.getUserId();
        var wish = await _context.Wishes.FirstOrDefaultAsync(w => w.BookId == bookId && w.MemberId == userId);

        if (wish == null)
            return NotFound(new ResponseModel<string> { status = HttpStatusResponse.FAILED, message = "Wish not found", data = null });

        _context.Wishes.Remove(wish);
        await _context.SaveChangesAsync();

        return Ok(new ResponseModel<bool>
        {
            status = HttpStatusResponse.OK,
            message = "Removed from wishlist successfully",
            data = true
        });
    }

    [HttpPost("wishlist")]
    [Authorize]
    public async Task<IActionResult> AddToWishlist([FromBody] WishBookCreateViewModel wishBook)
    {
        var userId = _credentialContext.getUserId();
        var wish = wishBook.toWishBookTable(userId);
        _context.Wishes.Add(wish);
        await _context.SaveChangesAsync();

        return Ok(new ResponseModel<bool>
        {
            status = HttpStatusResponse.OK,
            message = "Added to wishlist successfully",
            data = true
        });
    }

    [HttpGet("stats/today-checkouts")]
    [Authorize]
    public async Task<IActionResult> TodayCheckouts()
    {
        var count = await _context.BookLoans.CountAsync(bl => bl.DateBorrowed == DateOnly.FromDateTime(DateTime.Now));

        return Ok(new { count });
    }

    [HttpGet("stats/today-returns")]
    [Authorize]
    public async Task<IActionResult> TodayReturns()
    {
        var count = await _context.BookLoans.CountAsync(bl => bl.DateReturned.HasValue && bl.DateReturned == DateOnly.FromDateTime(DateTime.Now));

        return Ok(new { count });
    }

    [HttpGet("stats/active-users-today")]
    [Authorize]
    // need to recheck
    public async Task<IActionResult> ActiveUsersToday()
    {
        var count = await _context.BookLoans.Where(bl => bl.DateBorrowed == DateOnly.FromDateTime(DateTime.Now))
                                            .Select(bl => bl.MemberId).Distinct().CountAsync();

        return Ok(new { count });
    }

}