using LibraryManagement.Core.Entity;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel.WishBook;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;

public interface IWishBookRepository : BaseRepository<WishBookTable, WishBookCreateViewModel, WishBookViewModel>
{
    
}

public class WishBookRepository : IWishBookRepository
{
    private readonly LibraryManagementDbContext _context;
    private readonly ILogger<IWishBookRepository> _logger;
    public WishBookRepository(LibraryManagementDbContext context, ILogger<IWishBookRepository> logger)
    {
        _context = context;
        _logger = logger;
    }
    public async Task<IEnumerable<WishBookViewModel>> GetAll()
    {
        try
        {
            IEnumerable<WishBookViewModel> item = await _context.wishBooks.AsNoTracking().Select(p=> new WishBookViewModel(p)).ToListAsync();
            if (item != null)
            {
                return item;
            }
            return Enumerable.Empty<WishBookViewModel>();
        }catch(Exception ex){
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return Enumerable.Empty<WishBookViewModel>();;
        }
    }

    public async Task<WishBookViewModel> FindById(string id)
    {
        try
        {
            WishBookViewModel? item = await _context.wishBooks.AsNoTracking().Where(p=> p.Id == id).Select(p=> new WishBookViewModel(p)).FirstOrDefaultAsync();
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

    public bool Create(WishBookCreateViewModel viewModel)
    {
        try
        {
            WishBookTable item = viewModel.toWishBookTable();
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

    public bool Update(string Id, WishBookCreateViewModel viewModel)
    {
        try
        {
            WishBookTable item = _context.wishBooks.Find(Id);
            if (item != null)
            {
                item.BookId = viewModel.BookId;
                item.UserId = viewModel.UserId;

                _context.wishBooks.Update(item);
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
            WishBookTable item = _context.wishBooks.Find(Id);
            if (item != null)
            {
                _context.wishBooks.Remove(item);
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
}