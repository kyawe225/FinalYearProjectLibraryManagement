using LibraryManagement.Core.Entity;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel.LoanTable;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;


public interface ILoanRepository : BaseRepository<LoanTable, LoanCreateViewModel, LoanViewModel>
{
    
}


public class LoanRepository : ILoanRepository
{
    private readonly LibraryManagementDbContext _context;
    private readonly ILogger<IPublisherRepository> _logger;
    public LoanRepository(LibraryManagementDbContext context, ILogger<IPublisherRepository> logger)
    {
        _context = context;
        _logger = logger;
    }
    public async Task<IEnumerable<LoanViewModel>> GetAll()
    {
        try
        {
            IEnumerable<LoanViewModel> item = await _context.loans.AsNoTracking().Select(p=> new LoanViewModel(p)).ToListAsync();
            if (item != null)
            {
                return item;
            }
            return Enumerable.Empty<LoanViewModel>();
        }catch(Exception ex){
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return Enumerable.Empty<LoanViewModel>();
        }
    }

    public async Task<LoanViewModel> FindById(string id)
    {
        try
        {
            LoanViewModel? item = await _context.loans.AsNoTracking().Where(p=> p.Id == id).Select(p=> new LoanViewModel(p)).FirstOrDefaultAsync();
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

    public bool Create(LoanCreateViewModel viewModel)
    {
        try
        {
            LoanTable item = viewModel.toLoanTable();
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

    public bool Update(string Id, LoanCreateViewModel viewModel)
    {
        try
        {
            LoanTable item = _context.loans.Find(Id);
            if (item != null)
            {
                item.BookId = viewModel.BookId;
                item.UserId = viewModel.UserId;
                item.LoanDate = viewModel.LoanDate;
                item.LastReturnDate = viewModel.LastReturnDate;
                item.ReturnDate = viewModel.ReturnDate;

                _context.loans.Update(item);
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
            LoanTable item = _context.loans.Find(Id);
            if (item != null)
            {
                _context.loans.Remove(item);
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