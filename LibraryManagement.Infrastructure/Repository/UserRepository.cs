using LibraryManagement.Core.Entity;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;

public interface IUserRepository : BaseRepository<UserTable , UserCreateViewModel , UserViewModel>
{
    
}

public class UserRepository : IUserRepository
{
     private readonly LibraryManagementDbContext _context;
    private readonly ILogger<IUserRepository> _logger;

    public UserRepository(LibraryManagementDbContext context, ILogger<IUserRepository> logger)
    {
        _context = context;
        _logger = logger;
    }
    
    public async Task<IEnumerable<UserViewModel>> GetAll()
    {
        try
        {
            IEnumerable<UserViewModel> item = await _context.users.AsNoTracking().Select(p=> new UserViewModel(p)).ToListAsync();
            if (item != null)
            {
                return item;
            }
            return Enumerable.Empty<UserViewModel>();
        }catch(Exception ex){
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return Enumerable.Empty<UserViewModel>();;
        }
    }

    public async Task<UserViewModel> FindById(string id)
    {
        try
        {
            UserViewModel? item = await _context.users.AsNoTracking().Where(p=> p.Id == id).Select(p=> new UserViewModel(p)).FirstOrDefaultAsync();
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

    public bool Create(UserCreateViewModel viewModel)
    {
        try
        {
            UserTable item = viewModel.toUserTable();
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

    public bool Update(string Id, UserCreateViewModel viewModel)
    {
        try
        {
            UserTable item = _context.users.Find(Id);
            if (item != null)
            {
                item.Name = viewModel.Name;
                item.Email = viewModel.Email;
                item.Phone = viewModel.Phone;
                item.RoleId = viewModel.RoleId;
                
                _context.users.Update(item);
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
            UserTable item = _context.users.Find(Id);
            if (item != null)
            {
                _context.users.Remove(item);
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