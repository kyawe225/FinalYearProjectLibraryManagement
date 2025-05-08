using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel.LoanTable;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;


public interface ILoanRepository : BaseRepository<BookLoan, LoanCreateViewModel, LoanViewModel>
{
    
}


public class LoanRepository : ILoanRepository
{
    private readonly LibraryManagementContext _context;
    private readonly ILogger<IPublisherRepository> _logger;
    public LoanRepository(LibraryManagementContext context, ILogger<IPublisherRepository> logger)
    {
        _context = context;
        _logger = logger;
    }
    public async Task<IEnumerable<LoanViewModel>> GetAll()
    {
        try
        {
            IEnumerable<LoanViewModel> item = await _context.BookLoans.AsNoTracking().Include(p=> p.Book).Include(p=> p.Fines).Include(p=> p.Member).Select(p=> new LoanViewModel(p)).ToListAsync();
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
            LoanViewModel? item = await _context.BookLoans.AsNoTracking().Include(p=> p.Book).Include(p=> p.Fines).Include(p=> p.Member).Where(p=> p.LoanId == id).Select(p=> new LoanViewModel(p)).FirstOrDefaultAsync();
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
            BookLoan item = viewModel.toLoanTable();
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
            BookLoan item = _context.BookLoans.Find(Id);
            if (item != null)
            {
                item = viewModel.Update(item);

                _context.BookLoans.Update(item);
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
            BookLoan item = _context.BookLoans.Find(Id);
            if (item != null)
            {
                _context.BookLoans.Remove(item);
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