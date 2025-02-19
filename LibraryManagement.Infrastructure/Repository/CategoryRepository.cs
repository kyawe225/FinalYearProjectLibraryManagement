using LibraryManagement.Core.Entity;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.ViewModel.Category;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;

public interface ICategoryRepository : BaseRepository<Category, CategoryCreateViewModel, CategoryViewModel>
{
    
}

public class CategoryRepository : ICategoryRepository
{
    private readonly LibraryManagementDbContext _context;
    private readonly ILogger<IBookRepository> _logger;

    public CategoryRepository(LibraryManagementDbContext context, ILogger<IBookRepository> logger)
    {
        _context = context;
        _logger = logger;
    }
    
    public async Task<IEnumerable<CategoryViewModel>> GetAll()
    {
        try
        {
            IEnumerable<CategoryViewModel> item = await _context.categories.AsNoTracking().Select(p=> new CategoryViewModel(p)).ToListAsync();
            if (item != null)
            {
                return item;
            }
            return Enumerable.Empty<CategoryViewModel>();
        }catch(Exception ex){
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return Enumerable.Empty<CategoryViewModel>();;
        }
    }

    public async Task<CategoryViewModel> FindById(string id)
    {
        try
        {
            CategoryViewModel? item = await _context.categories.AsNoTracking().Where(p=> p.Id == id).Select(p=> new CategoryViewModel(p)).FirstOrDefaultAsync();
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

    public bool Create(CategoryCreateViewModel viewModel)
    {
        try
        {
            Category item = viewModel.toCategoryTable();
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

    public bool Update(string Id, CategoryCreateViewModel viewModel)
    {
        try
        {
            Category item = _context.categories.Find(Id);
            if (item != null)
            {
                item.Name = viewModel.Name;
                item.Description = viewModel.Description;

                _context.categories.Update(item);
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
            Category item = _context.categories.Find(Id);
            if (item != null)
            {
                _context.categories.Remove(item);
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