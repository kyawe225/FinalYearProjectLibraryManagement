using LibraryManagement.Core.Entities;
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
    private readonly LibraryManagementContext _context;
    private readonly ILogger<ICategoryRepository> _logger;
    private readonly ICredentialContext _credentialContext;

    public CategoryRepository(LibraryManagementContext context, ILogger<ICategoryRepository> logger, ICredentialContext context1)
    {
        _context = context;
        _logger = logger;
        _credentialContext = context1;
    }

    public async Task<IEnumerable<CategoryViewModel>> GetAll()
    {
        try
        {
            IEnumerable<CategoryViewModel> item = await _context.Categories.AsNoTracking().Select(p => new CategoryViewModel(p)).ToListAsync();
            if (item != null)
            {
                return item;
            }
            return Enumerable.Empty<CategoryViewModel>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return Enumerable.Empty<CategoryViewModel>(); ;
        }
    }

    public async Task<CategoryViewModel> FindById(string id)
    {
        try
        {
            CategoryViewModel? item = await _context.Categories.AsNoTracking().Where(p => p.CategoryId == id).Select(p => new CategoryViewModel(p)).FirstOrDefaultAsync();
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
        }
        catch (Exception ex)
        {
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
            Category item = _context.Categories.Find(Id);
            if (item != null)
            {
                item.CategoryName = viewModel.Name;
                item.Description = viewModel.Description;
                item.ParentCategoryId = viewModel.ParentCategoryId;

                _context.Categories.Update(item);
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
            Category item = _context.Categories.Find(Id);
            if (item != null)
            {
                _context.Categories.Remove(item);
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