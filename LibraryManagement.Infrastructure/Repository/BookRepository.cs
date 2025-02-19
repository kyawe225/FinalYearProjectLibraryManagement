using LibraryManagement.Core;
using LibraryManagement.Core.Entity;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel.Book;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;

public interface IBookRepository : BaseRepository<BookTable, BookCreateViewModel, BookViewModel>
{
    public List<BookViewModel> Search(BookSearchRequest request);
}


public class BookRepository : IBookRepository
{
    private readonly LibraryManagementDbContext _context;
    private readonly ILogger<IBookRepository> _logger;

    public BookRepository(LibraryManagementDbContext context, ILogger<IBookRepository> logger)
    {
        _context = context;
        _logger = logger;
    }
    
    public async Task<IEnumerable<BookViewModel>> GetAll()
    {
        try
        {
            IEnumerable<BookViewModel> item = await _context.books.AsNoTracking().Select(p=> new BookViewModel(p)).ToListAsync();
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
            BookViewModel? item = await _context.books.AsNoTracking().Where(p=> p.Id == id).Select(p=> new BookViewModel(p)).FirstOrDefaultAsync();
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
            BookTable item = viewModel.toBookTable();
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
            BookTable item = _context.books.Find(Id);
            if (item != null)
            {
                item.Title = viewModel.Title;
                item.Authors = viewModel.Authors;
                item.ISBN = viewModel.ISBN;
                item.Publisher = viewModel.Publisher;
                item.PublicationYear = viewModel.PublicationYear;
                item.Genre = viewModel.Genre;
                item.Language = viewModel.Language;
                item.PageCount = viewModel.PageCount;
                item.CoverImage = viewModel.CoverImage;
                item.Description = viewModel.Description;
                item.Status = Utils.ParseEnum<BookStatus>(viewModel.Status);
                item.Category = viewModel.Category;
                item.Edition = viewModel.Edition;
                item.Format = viewModel.Format;
                item.DateAdded = viewModel.DateAdded;

                _context.books.Update(item);
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
            BookTable item = _context.books.Find(Id);
            if (item != null)
            {
                _context.books.Remove(item);
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

    public List<BookViewModel> Search(BookSearchRequest request){
        try{
            var books = _context.books.AsQueryable();
            if(!string.IsNullOrEmpty(request.Title.Trim())){
                _context.books.Where(p=> p.Title == request.Title);
            }
            if(!string.IsNullOrEmpty(request.Publisher.Trim())){
                _context.books.Where(p=> p.Publisher == request.Publisher);
            }
            if(!string.IsNullOrEmpty(request.Author.Trim())){
                _context.books.Where(p=> p.Authors.Equals(request.Author));
            }
            var bookList = books.AsNoTracking().Select(p=> new BookViewModel(p)).ToList();

            return bookList;
            
        }catch(Exception e){
            _logger.LogError(e.Message );
            return Enumerable.Empty<BookViewModel>().ToList();
        }
    } 
}