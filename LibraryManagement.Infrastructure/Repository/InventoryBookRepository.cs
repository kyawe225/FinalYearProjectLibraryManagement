using LibraryManagement.Core.Entity;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel.Inventory;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;

public interface
    IInventoryBookRepository : BaseRepository<InventoryBooks, InventoryBookCreateViewModel, InventoryViewModel>
{
    
}

public class InventoryBookRepository : IInventoryBookRepository
{
    private readonly LibraryManagementDbContext _context;
    private readonly ILogger _logger;
    public InventoryBookRepository(LibraryManagementDbContext context, ILogger<ILateFeeRepository> logger)
    {
        _context = context;
        _logger = logger;
    }
    public async Task<IEnumerable<InventoryViewModel>> GetAll()
    {
        try
        {
            IEnumerable<InventoryViewModel> item = await _context.inventoryBooks.AsNoTracking().Select(p=> new InventoryViewModel(p)).ToListAsync();
            if (item != null)
            {
                return item;
            }
            return Enumerable.Empty<InventoryViewModel>();
        }catch(Exception ex){
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return Enumerable.Empty<InventoryViewModel>();;
        }
    }

    public async Task<InventoryViewModel> FindById(string id)
    {
        try
        {
            InventoryViewModel? item = await _context.inventoryBooks.AsNoTracking().Where(p=> p.Id == id).Select(p=> new InventoryViewModel(p)).FirstOrDefaultAsync();
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

    public bool Create(InventoryBookCreateViewModel viewModel)
    {
        try
        {
            InventoryBooks item = viewModel.toInventoryBook();
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

    public bool Update(string Id, InventoryBookCreateViewModel viewModel)
    {
        try
        {
            InventoryBooks item = _context.inventoryBooks.Find(Id);
            if (item != null)
            {
                

                _context.inventoryBooks.Update(item);
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
            InventoryBooks item = _context.inventoryBooks.Find(Id);
            if (item != null)
            {
                _context.inventoryBooks.Remove(item);
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