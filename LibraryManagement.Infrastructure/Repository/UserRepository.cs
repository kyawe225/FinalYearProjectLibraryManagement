using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel;
using LibraryManagement.Infrastructure.ViewModel.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;

public interface IUserRepository : BaseRepository<Member, UserCreateViewModel, UserViewModel>
{
    public ResponseModel<ProfileResponse> Profile();
}

public class UserRepository : IUserRepository
{
    private readonly LibraryManagementContext _context;
    private readonly ILogger<IUserRepository> _logger;
    private readonly ICredentialContext credentialContext;

    public UserRepository(LibraryManagementContext context, ILogger<IUserRepository> logger, ICredentialContext credentialContext)
    {
        _context = context;
        _logger = logger;
        this.credentialContext = credentialContext;
    }

    public async Task<IEnumerable<UserViewModel>> GetAll()
    {
        try
        {
            IEnumerable<UserViewModel> item = await _context.Members.AsNoTracking().Select(p => new UserViewModel(p)).ToListAsync();
            if (item != null)
            {
                return item;
            }
            return Enumerable.Empty<UserViewModel>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return Enumerable.Empty<UserViewModel>(); ;
        }
    }

    public async Task<UserViewModel> FindById(string id)
    {
        try
        {
            UserViewModel? item = await _context.Members.AsNoTracking().Where(p => p.Id == id).Select(p => new UserViewModel(p)).FirstOrDefaultAsync();
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

    public bool Create(UserCreateViewModel viewModel)
    {
        try
        {
            Member item = viewModel.toUserTable();
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

    public bool Update(string Id, UserCreateViewModel viewModel)
    {
        try
        {
            Member item = _context.Members.Find(Id);
            if (item != null)
            {
                item = viewModel.UpdateMember(item);
                _context.Members.Update(item);
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
            Member item = _context.Members.Find(Id);
            if (item != null)
            {
                _context.Members.Remove(item);
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

    public ResponseModel<ProfileResponse> Profile()
    {
        string userId = credentialContext.getUserId();
        string role =  credentialContext.getUserRole();
        ResponseModel<ProfileResponse> response = new ResponseModel<ProfileResponse>();
        if (role == "Admin" || role.Equals("Staff", StringComparison.InvariantCultureIgnoreCase))
        {
            Staff? staff= _context.Staff.Where(p => p.Id == userId).FirstOrDefault();
            response = new ResponseModel<ProfileResponse>()
            {
                status = staff!= null ? HttpStatusResponse.OK : HttpStatusResponse.FAILED,
                data = staff != null ? new ProfileResponse(staff) : null,
                message = staff != null ?  "Fetch Successfully" : "User Not Found"
            };
        }
        else if (role == "Member")
        {
            Member? member= _context.Members.Where(p => p.Id == userId).FirstOrDefault();
            response = new ResponseModel<ProfileResponse>()
            {
                status = member!= null ? HttpStatusResponse.OK : HttpStatusResponse.FAILED,
                data = member != null ? new ProfileResponse(member) : null,
                message = member != null ?  "Fetch Successfully" : "User Not Found"
            };
        }
        return response;
    }
}