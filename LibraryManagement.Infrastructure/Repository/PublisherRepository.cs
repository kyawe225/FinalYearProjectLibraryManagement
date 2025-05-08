using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel.Publisher;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;

public interface IPublisherRepository : BaseRepository<Publishers, PublisherCreateViewModel, PublisherViewModel>
{
    
}

public class PublisherRepository : IPublisherRepository
{
    private readonly LibraryManagementContext _context;
    private readonly ILogger<IPublisherRepository> _logger;
    public PublisherRepository(LibraryManagementContext context, ILogger<IPublisherRepository> logger)
    {
        _context = context;
        _logger = logger;
    }
    public async Task<IEnumerable<PublisherViewModel>> GetAll()
    {
        try
        {
            IEnumerable<PublisherViewModel> item = await _context.Publishers.AsNoTracking().Select(p=> new PublisherViewModel(p)).ToListAsync();
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
            PublisherViewModel? item = await _context.Publishers.AsNoTracking().Where(p=> p.PublisherId == id).Select(p=> new PublisherViewModel(p)).FirstOrDefaultAsync();
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
            Publishers item = viewModel.toPublisherTable();
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
            Publishers item = _context.Publishers.Find(Id);
            if (item != null)
            {
                item = viewModel.UpdatePublishers(item);
                _context.Publishers.Update(item);
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
            Publishers item = _context.Publishers.Find(Id);
            if (item != null)
            {
                _context.Publishers.Remove(item);
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