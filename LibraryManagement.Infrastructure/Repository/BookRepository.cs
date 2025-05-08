using LibraryManagement.Core;
using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel.Book;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;

public interface IBookRepository : BaseRepository<Book, BookCreateViewModel, BookViewModel>
{
    public List<BookViewModel> Search(BookFilter request);
}


public class BookRepository : IBookRepository
{
    private readonly LibraryManagementContext _context;
    private readonly ILogger<IBookRepository> _logger;
    private readonly ICredentialContext _credentialContext;

    public BookRepository(LibraryManagementContext context, ILogger<IBookRepository> logger, ICredentialContext context1)
    {
        _context = context;
        _logger = logger;
        _credentialContext = context1;
    }
    
    public async Task<IEnumerable<BookViewModel>> GetAll()
    {
        try
        {
            IEnumerable<BookViewModel> item = await _context.Books.AsNoTracking().Include(p=> p.Publisher).Include(p=> p.Category).Include(p=> p.Authors).Select(p=> new BookViewModel(p)).ToListAsync();
            if (item != null)
            {
                return item;
            }
            return Enumerable.Empty<BookViewModel>();
        }catch(Exception ex){
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return Enumerable.Empty<BookViewModel>();;
        }
    }

    public async Task<BookViewModel> FindById(string id)
    {
        try
        {
            BookViewModel? item = await _context.Books.AsNoTracking().Include(p=> p.Category).Include(p=> p.Publisher).Include(p=> p.Authors).Where(p=> p.BookId == id).Select(p=> new BookViewModel(p)).FirstOrDefaultAsync();
            if (item != null)
            {
                return item;
            }
            return null;
        }catch(Exception ex){
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return null;
        }
    }

    public bool Create(BookCreateViewModel viewModel)
    {
        try
        {
            Book item = viewModel.toBookTable();
            if (item != null)
            {
                _context.Add(item);
                _context.SaveChanges();
                return true;
            }
            return false;
        }catch(Exception ex){
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return false;
        }
    }

    public bool Update(string Id, BookCreateViewModel viewModel)
    {
        try
        {
            Book item = _context.Books.Find(Id);
            if (item != null)
            {
                item = viewModel.UpdateBookTable(item);

                _context.Books.Update(item);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return false;
        }
    }

    public bool Delete(string Id)
    {
        try
        {
            Book item = _context.Books.Find(Id);
            if (item != null)
            {
                _context.Books.Remove(item);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return false;
        }
    }

    public List<BookViewModel> Search(BookFilter request){
        try{
            var Books = _context.Books.AsQueryable();
            if(!string.IsNullOrEmpty(request.SearchTerm.Trim())){
                Books = Books.Where(p=> p.Title.StartsWith(request.SearchTerm) || p.Authors.Any(p=> p.FirstName.StartsWith(request.SearchTerm) && p.LastName.StartsWith(request.SearchTerm)) || p.Isbn.StartsWith(request.SearchTerm));
            }
            if(!string.IsNullOrEmpty(request.CategoryId.Trim())){
                Books = Books.Where(p=> p.Category.CategoryId.StartsWith(request.CategoryId));
            }
            if(!string.IsNullOrEmpty(request.AuthorId.Trim())){
                Books = Books.Where(p=> p.Authors.Any(p=> p.AuthorId==request.AuthorId));
            }
            if(!string.IsNullOrEmpty(request.PublisherId.Trim())){
                Books = Books.Where(p=> p.PublisherId ==request.PublisherId);
            }
            if(!string.IsNullOrEmpty(request.Status.Trim())){
                Books = Books.Where(p=> p.Status == request.Status);
            }
            if(!string.IsNullOrEmpty(request.BranchId.Trim())){
                Books = Books.Where(p=> p.BookCopies.Any(p=> p.BranchId == request.BranchId));
            }
            if(request.PublicationYear.HasValue){
                Books = Books.Where(p=> (p.PublicationDate.Value.Year) == request.PublicationYear);
            }
            var bookList = Books.Include(p=> p.Category).Include(p=> p.Publisher).Include(p=> p.Authors).AsNoTracking().Select(p=> new BookViewModel(p)).ToList();

            return bookList;
            
        }catch(Exception e){
            _logger.LogError(e.Message);
            return Enumerable.Empty<BookViewModel>().ToList();
        }
    }
}