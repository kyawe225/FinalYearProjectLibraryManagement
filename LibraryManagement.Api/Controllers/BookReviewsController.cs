using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure;
using LibraryManagement.Infrastructure.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class BookReviewsController : ControllerBase
{
    private readonly LibraryManagementContext _context;
    private readonly ICredentialContext _credential;

    public BookReviewsController(LibraryManagementContext context, ICredentialContext credential)
    {
        _context = context;
        _credential = credential;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<BookReview>>> GetBookReviews(
        [FromQuery] string? book_id,
        [FromQuery] string? member_id,
        [FromQuery] int? rating,
        [FromQuery] DateTime? date_from,
        [FromQuery] DateTime? date_to)
    {
        var query = _context.BookReviews.AsQueryable();

        if (!string.IsNullOrWhiteSpace(book_id))
            query = query.Where(r => r.BookId == book_id);

        if (!string.IsNullOrWhiteSpace(member_id))
            query = query.Where(r => r.MemberId == member_id);

        if (rating.HasValue)
            query = query.Where(r => r.Rating == rating);

        if (date_from.HasValue)
            query = query.Where(r => r.ReviewDate >= DateOnly.FromDateTime(date_from ?? DateTime.UtcNow));

        if (date_to.HasValue)
            query = query.Where(r => r.ReviewDate <= DateOnly.FromDateTime(date_to ?? DateTime.UtcNow));

        return await query.ToListAsync();
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<BookReview>> GetBookReview(string id)
    {
        var review = await _context.BookReviews.FindAsync(id);

        if (review == null)
            return NotFound();

        return review;
    }

    [HttpPost]
    public async Task<ActionResult<BookReview>> CreateBookReview(BookReview review)
    {
        review.ReviewId = Guid.NewGuid().ToString();
        review.ReviewDate = DateOnly.FromDateTime(DateTime.UtcNow);
        review.MemberId = _credential.getUserId();

        _context.BookReviews.Add(review);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            return Conflict($"Unable to create review: {ex.InnerException?.Message}");
        }

        return CreatedAtAction(nameof(GetBookReview), new { id = review.ReviewId }, review);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBookReview(string id, BookReview updatedReview)
    {
        if (id != updatedReview.ReviewId)
            return BadRequest("Review ID mismatch");

        var review = await _context.BookReviews.FindAsync(id);
        if (review == null)
            return NotFound();

        // Optionally check ownership
        if (review.MemberId != _credential.getUserId())
            return Forbid();

        review.Rating = updatedReview.Rating;
        review.ReviewText = updatedReview.ReviewText;
        review.ReviewDate = DateOnly.FromDateTime(DateTime.UtcNow);

        _context.Entry(review).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(500, "Could not update the review");
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBookReview(string id)
    {
        var review = await _context.BookReviews.FindAsync(id);
        if (review == null)
            return NotFound();

        // Optionally check ownership
        if (review.MemberId != _credential.getUserId())
            return Forbid();

        _context.BookReviews.Remove(review);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
