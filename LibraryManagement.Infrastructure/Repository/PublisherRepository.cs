using LibraryManagement.Core.Entity;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel.Publisher;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;

public interface IPublisherRepository : BaseRepository<PublisherTable, PublisherCreateViewModel, PublisherViewModel>
{
    
}

public class PublisherRepository : IPublisherRepository
{
    private readonly LibraryManagementDbContext _context;
    private readonly ILogger<IPublisherRepository> _logger;
    public PublisherRepository(LibraryManagementDbContext context, ILogger<IPublisherRepository> logger)
    {
        _context = context;
        _logger = logger;
    }
    public async Task<IEnumerable<PublisherViewModel>> GetAll()
    {
        try
        {
            IEnumerable<PublisherViewModel> item = await _context.publishers.AsNoTracking().Select(p=> new PublisherViewModel(p)).ToListAsync();
            if (item != null)
            {
                return item;
            }
            return Enumerable.Empty<PublisherViewModel>();
        }catch(Exception ex){
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return Enumerable.Empty<PublisherViewModel>();;
        }
    }

    public async Task<PublisherViewModel> FindById(string id)
    {
        try
        {
            PublisherViewModel? item = await _context.publishers.AsNoTracking().Where(p=> p.Id == id).Select(p=> new PublisherViewModel(p)).FirstOrDefaultAsync();
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

    public bool Create(PublisherCreateViewModel viewModel)
    {
        try
        {
            PublisherTable item = viewModel.toPublisherTable();
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

    public bool Update(string Id, PublisherCreateViewModel viewModel)
    {
        try
        {
            PublisherTable item = _context.publishers.Find(Id);
            if (item != null)
            {
                item.Name = viewModel.Name;
                item.Address = viewModel.Address;
                item.Descritpion = viewModel.Description;
                item.Email = viewModel.Email;
                item.PhoneNumber = viewModel.PhoneNumber;

                _context.publishers.Update(item);
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
            PublisherTable item = _context.publishers.Find(Id);
            if (item != null)
            {
                _context.publishers.Remove(item);
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