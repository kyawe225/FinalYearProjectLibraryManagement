// using LibraryManagement.Core.Entity;
// using LibraryManagement.Infrastructure.Context;
// using LibraryManagement.Infrastructure.ViewModel.LateFee;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.Extensions.Logging;

// namespace LibraryManagement.Infrastructure.Repository;

// public interface ILateFeeRepository : BaseRepository<LateFeeTable, LateFeeCreateViewModel, LateFeeViewModel>
// {
    
// }

// public class LateFeeRepository : ILateFeeRepository
// {
//     private readonly MyLibraryManagementContext _context;
//     private readonly ILogger<ILateFeeRepository> _logger;
//     public LateFeeRepository(MyLibraryManagementContext context, ILogger<ILateFeeRepository> logger)
//     {
//         _context = context;
//         _logger = logger;
//     }
//     public async Task<IEnumerable<LateFeeViewModel>> GetAll()
//     {
//         try
//         {
//             IEnumerable<LateFeeViewModel> item = await _context.lateFees.AsNoTracking().Select(p=> new LateFeeViewModel(p)).ToListAsync();
//             if (item != null)
//             {
//                 return item;
//             }
//             return Enumerable.Empty<LateFeeViewModel>();
//         }catch(Exception ex){
//             _logger.LogError(ex.Message);
//             _logger.LogError(ex.InnerException?.Message);
//             _logger.LogError(ex.StackTrace);

//             return Enumerable.Empty<LateFeeViewModel>();;
//         }
//     }

//     public async Task<LateFeeViewModel> FindById(string id)
//     {
//         try
//         {
//             LateFeeViewModel? item = await _context.lateFees.AsNoTracking().Where(p=> p.Id == id).Select(p=> new LateFeeViewModel(p)).FirstOrDefaultAsync();
//             if (item != null)
//             {
//                 return item;
//             }
//             return null;
//         }catch(Exception ex){
//             _logger.LogError(ex.Message);
//             _logger.LogError(ex.InnerException?.Message);
//             _logger.LogError(ex.StackTrace);

//             return null;
//         }
//     }

//     public bool Create(LateFeeCreateViewModel viewModel)
//     {
//         try
//         {
//             LateFeeTable item = viewModel.toLateFeeTable();
//             if (item != null)
//             {
//                 _context.Add(item);
//                 _context.SaveChanges();
//                 return true;
//             }
//             return false;
//         }catch(Exception ex){
//             _logger.LogError(ex.Message);
//             _logger.LogError(ex.InnerException?.Message);
//             _logger.LogError(ex.StackTrace);

//             return false;
//         }
//     }

//     public bool Update(string Id, LateFeeCreateViewModel viewModel)
//     {
//         try
//         {
//             LateFeeTable item = _context.lateFees.Find(Id);
//             if (item != null)
//             {
//                 item.LoanTableId = viewModel.LoanTableId;
//                 item.Amount = viewModel.Amount;
//                 item.LateDays = viewModel.LateDays;

//                 _context.lateFees.Update(item);
//                 _context.SaveChanges();
//                 return true;
//             }
//             return false;
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(ex.Message);
//             _logger.LogError(ex.InnerException?.Message);
//             _logger.LogError(ex.StackTrace);

//             return false;
//         }
//     }

//     public bool Delete(string Id)
//     {
//         try
//         {
//             LateFeeTable item = _context.lateFees.Find(Id);
//             if (item != null)
//             {
//                 _context.lateFees.Remove(item);
//                 _context.SaveChanges();
//                 return true;
//             }
//             return false;
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(ex.Message);
//             _logger.LogError(ex.InnerException?.Message);
//             _logger.LogError(ex.StackTrace);

//             return false;
//         }
//     }
// }