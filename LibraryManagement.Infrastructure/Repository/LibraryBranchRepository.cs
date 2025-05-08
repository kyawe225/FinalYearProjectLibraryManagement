using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel.Inventory;
using LibraryManagement.Infrastructure.ViewModel.LibraryBranch;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;

public interface
    ILibraryBranchRepository : BaseRepository<LibraryBranch, LibraryBranchCreateViewModel, LibraryBranchViewModel>
{
    
}

public class LibraryBranchRepository : ILibraryBranchRepository
{
    private readonly LibraryManagementContext _context;
    private readonly ILogger _logger;
    private readonly ICredentialContext credentialContext;
    public LibraryBranchRepository(LibraryManagementContext context, ILogger<IInventoryBookRepository> logger, ICredentialContext credentialContext)
    {
        _context = context;
        _logger = logger;
        this.credentialContext = credentialContext;
    }
    public async Task<IEnumerable<LibraryBranchViewModel>> GetAll()
    {
        try
        {
            IEnumerable<LibraryBranchViewModel> item = await _context.LibraryBranches.AsNoTracking().Include(p=> p.Manager).Select(p=> new LibraryBranchViewModel(p)).ToListAsync();
            if (item != null)
            {
                return item;
            }
            return Enumerable.Empty<LibraryBranchViewModel>();
        }catch(Exception ex){
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return Enumerable.Empty<LibraryBranchViewModel>();;
        }
    }

    public async Task<LibraryBranchViewModel> FindById(string id)
    {
        try
        {
            LibraryBranchViewModel? item = await _context.LibraryBranches.AsNoTracking().Where(p=> p.Id == id).Select(p=> new LibraryBranchViewModel(p)).FirstOrDefaultAsync();
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

    public bool Create(LibraryBranchCreateViewModel viewModel)
    {
        try
        {
            LibraryBranch item = viewModel.toLibraryBranch();
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

    public bool Update(string Id, LibraryBranchCreateViewModel viewModel)
    {
        try
        {
            LibraryBranch item = _context.LibraryBranches.Find(Id);
            if (item != null)
            {
                _context.LibraryBranches.Update(item);
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
            LibraryBranch item = _context.LibraryBranches.Find(Id);
            if (item != null)
            {
                _context.LibraryBranches.Remove(item);
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