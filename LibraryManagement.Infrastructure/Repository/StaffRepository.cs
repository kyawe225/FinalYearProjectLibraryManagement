using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;

public interface IStaffRepository : BaseRepository<Staff, StaffCreateViewModel, StaffViewModel>
{

}

public class StaffRepository : IStaffRepository
{
    private readonly LibraryManagementContext _context;
    private readonly ILogger<IUserRepository> _logger;

    public StaffRepository(LibraryManagementContext context, ILogger<IUserRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<StaffViewModel>> GetAll()
    {
        try
        {
            IEnumerable<StaffViewModel> item = await _context.Staff.AsNoTracking().Select(p => new StaffViewModel(p)).ToListAsync();
            if (item != null)
            {
                return item;
            }
            return Enumerable.Empty<StaffViewModel>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return Enumerable.Empty<StaffViewModel>(); ;
        }
    }

    public async Task<StaffViewModel> FindById(string id)
    {
        try
        {
            StaffViewModel? item = await _context.Staff.AsNoTracking().Where(p => p.Id == id).Select(p => new StaffViewModel(p)).FirstOrDefaultAsync();
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

    public bool Create(StaffCreateViewModel viewModel)
    {
        try
        {
            Staff item = viewModel.toUserTable();
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

    public bool Update(string Id, StaffCreateViewModel viewModel)
    {
        try
        {
            Staff item = _context.Staff.Find(Id);
            if (item != null)
            {
                item = viewModel.UpdateMember(item);
                _context.Staff.Update(item);
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
            Staff item = _context.Staff.Find(Id);
            if (item != null)
            {
                _context.Staff.Remove(item);
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