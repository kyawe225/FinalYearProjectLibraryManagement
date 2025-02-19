using LibraryManagement.Core;
using LibraryManagement.Core.Entity;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel.Role;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;

public interface IRoleRepository : BaseRepository<RoleTable , RoleCreateViewModel , RoleViewModel>{}

public class RoleRepository : IRoleRepository
{
     private readonly LibraryManagementDbContext _context;
    private readonly ILogger _logger;

    public RoleRepository(LibraryManagementDbContext context, ILogger<IRoleRepository> logger)
    {
        _context = context;
        _logger = logger;
    }
    
    public async Task<IEnumerable<RoleViewModel>> GetAll()
    {
        try
        {
            IEnumerable<RoleViewModel> item = await _context.roles.AsNoTracking().Select(p=> new RoleViewModel(p)).ToListAsync();
            if (item != null)
            {
                return item;
            }
            return Enumerable.Empty<RoleViewModel>();
        }catch(Exception ex){
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return Enumerable.Empty<RoleViewModel>();;
        }
    }

    public async Task<RoleViewModel> FindById(string id)
    {
        try
        {
            RoleViewModel? item = await _context.roles.AsNoTracking().Where(p=> p.Id == id).Select(p=> new RoleViewModel(p)).FirstOrDefaultAsync();
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

    public bool Create(RoleCreateViewModel viewModel)
    {
        try
        {
            RoleTable item = viewModel.toRoleTable();
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

    public bool Update(string Id, RoleCreateViewModel viewModel)
    {
        try
        {
            RoleTable item = _context.roles.Find(Id);
            if (item != null)
            {
                item.Name = viewModel.Name;
                item.Description = viewModel.Description;
                item.Status = Utils.ParseEnum<RoleStatus>(viewModel.Status);
                
                _context.roles.Update(item);
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
            RoleTable item = _context.roles.Find(Id);
            if (item != null)
            {
                _context.roles.Remove(item);
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