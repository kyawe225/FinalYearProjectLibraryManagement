using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel;
using LibraryManagement.Infrastructure.ViewModel.WishBook;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;

public interface IWishBookRepository : BaseRepository<Wish, WishBookCreateViewModel, WishBookViewModel>
{
    bool WishByCustomer(WishBookCustomerCreateViewModel model);
}

public class WishBookRepository : IWishBookRepository
{
    private readonly LibraryManagementContext _context;
    private readonly ILogger<IWishBookRepository> _logger;
    private readonly ICredentialContext credentialContext;
    public WishBookRepository(LibraryManagementContext context, ILogger<IWishBookRepository> logger, ICredentialContext credentialContext)
    {
        _context = context;
        _logger = logger;
        this.credentialContext = credentialContext;
    }
    public async Task<IEnumerable<WishBookViewModel>> GetAll()
    {
        try
        {
            IEnumerable<WishBookViewModel> item = await _context.Wishes.AsNoTracking().Select(p => new WishBookViewModel(p)).ToListAsync();
            if (item != null)
            {
                return item;
            }
            return Enumerable.Empty<WishBookViewModel>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return Enumerable.Empty<WishBookViewModel>(); ;
        }
    }

    public async Task<WishBookViewModel> FindById(string id)
    {
        try
        {
            WishBookViewModel? item = await _context.Wishes.AsNoTracking().Where(p => p.WishId == id).Select(p => new WishBookViewModel(p)).FirstOrDefaultAsync();
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

    public bool Create(WishBookCreateViewModel viewModel)
    {
        try
        {
            Wish item = viewModel.toWishBookTable("");
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

    public bool WishByCustomer(WishBookCustomerCreateViewModel model)
    {
        try
        {
            string memberId = credentialContext.getUserId();
            if (!string.IsNullOrEmpty(memberId))
            {
                var wish = _context.Wishes.Any(p => p.MemberId == memberId && p.BookId == model.BookId);
                if (wish == true)
                {
                    _logger.LogError("WishRepository.WishByCustomer => Duplicate error found");
                    return false;
                }
            }
            Wish item = model.toWishBookTable();
            if (item != null)
            {
                item.MemberId = credentialContext.getUserId();
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

    public bool Update(string Id, WishBookCreateViewModel model)
    {
        return false;
    }

    public bool Delete(string Id)
    {
        try
        {
            Wish item = _context.Wishes.Find(Id);
            if (item != null)
            {
                _context.Wishes.Remove(item);
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