using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel.Inventory;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;

public interface
    IInventoryBookRepository : BaseRepository<BookCopy, InventoryBookCreateViewModel, InventoryViewModel>
{

}

public class InventoryBookRepository : IInventoryBookRepository
{
    private readonly ICredentialContext credentialContext;
    private readonly LibraryManagementContext _context;
    private readonly ILogger _logger;
    public InventoryBookRepository(LibraryManagementContext context, ILogger<IInventoryBookRepository> logger,ICredentialContext context1)
    {
        _context = context;
        _logger = logger;
        this.credentialContext = context1;
    }
    public async Task<IEnumerable<InventoryViewModel>> GetAll()
    {
        try
        {
            IEnumerable<InventoryViewModel> item = await _context.BookCopies.AsNoTracking().Select(p => new InventoryViewModel(p)).ToListAsync();
            if (item != null)
            {
                return item;
            }
            return Enumerable.Empty<InventoryViewModel>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return Enumerable.Empty<InventoryViewModel>(); ;
        }
    }

    public async Task<InventoryViewModel> FindById(string id)
    {
        try
        {
            InventoryViewModel? item = await _context.BookCopies.AsNoTracking().Where(p => p.CopyId == id).Select(p => new InventoryViewModel(p)).FirstOrDefaultAsync();
            if (item != null)
            {
                return item;
            }
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return null;
        }
    }

    public bool Create(InventoryBookCreateViewModel viewModel)
    {
        try
        {
            BookCopy item = viewModel.toInventoryBook();
            if (item != null)
            {
                _context.Add(item);
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

    public bool Update(string Id, InventoryBookCreateViewModel viewModel)
    {
        try
        {
            BookCopy item = _context.BookCopies.Find(Id);
            if (item != null)
            {
                _context.BookCopies.Update(item);
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
            BookCopy item = _context.BookCopies.Find(Id);
            if (item != null)
            {
                _context.BookCopies.Remove(item);
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