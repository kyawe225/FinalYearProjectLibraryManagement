using System;
using LibraryManagement.Core.Entities;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.Request;
using LibraryManagement.Infrastructure.ViewModel.News;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LibraryManagement.Infrastructure.Repository;

public interface INewsRepository : BaseRepository<NewsTable, NewsCreateViewModel, NewsViewModel>
{
    public Task<IEnumerable<NewsViewModel>> getLatestNews(PaginationRequest latest);
}


public class NewsRepository : INewsRepository
{
    private readonly LibraryManagementContext _context;
    private readonly ILogger<INewsRepository> _logger;
    public NewsRepository(LibraryManagementContext context, ILogger<INewsRepository> logger)
    {
        _context = context;
        _logger = logger;
    }
    [HttpGet]
    public async Task<IEnumerable<NewsViewModel>> GetAll()
    {
        try
        {
            IEnumerable<NewsViewModel> item = await _context.News.AsNoTracking().Include(p=> p.PublishedBy).Include(p=> p.Branch).Select(p=> new NewsViewModel(p)).ToListAsync();
            if (item != null)
            {
                return item;
            }
            return Enumerable.Empty<NewsViewModel>();
        }catch(Exception ex){
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return Enumerable.Empty<NewsViewModel>();
        }
    }
    [HttpGet]
    public async Task<NewsViewModel> FindById(string id)
    {
        try
        {
            NewsViewModel? item = await _context.News.AsNoTracking().Include(p=> p.PublishedBy).Include(p=> p.Branch).Where(p=> p.NewsId == id).Select(p=> new NewsViewModel(p)).FirstOrDefaultAsync();
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
    [HttpPost]
    public bool Create(NewsCreateViewModel viewModel)
    {
        try
        {
            NewsTable item = viewModel.toNewsTable();
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
    [HttpPut]
    public bool Update(string Id, NewsCreateViewModel viewModel)
    {
        try
        {
            NewsTable item = _context.News.Find(Id);
            if (item != null)
            {
                item = viewModel.UpdateTable(item);
                _context.News.Update(item);
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
    [HttpDelete]
    public bool Delete(string Id)
    {
        try
        {
            NewsTable item = _context.News.Find(Id);
            if (item != null)
            {
                _context.News.Remove(item);
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

    public async Task<IEnumerable<NewsViewModel>> getLatestNews(PaginationRequest request)
    {
        try
        {
            var actualPage = request.Page - 1;
            var skip = actualPage * actualPage;
            IEnumerable<NewsViewModel> item = await _context.News.AsNoTracking().Include(p=> p.Branch).Include(p=> p.Branch.Manager).Include(p=> p.PublishedBy).Where(p=> p.PublicationDate >= DateTime.UtcNow).OrderByDescending(p=> p.PublicationDate).Skip(skip).Take(request.PageSize).Select(p=> new NewsViewModel(p)).ToListAsync();
            if (item != null)
            {
                return item;
            }
            return Enumerable.Empty<NewsViewModel>();
        }catch(Exception ex){
            _logger.LogError(ex.Message);
            _logger.LogError(ex.InnerException?.Message);
            _logger.LogError(ex.StackTrace);

            return Enumerable.Empty<NewsViewModel>();
        }
    }
}
