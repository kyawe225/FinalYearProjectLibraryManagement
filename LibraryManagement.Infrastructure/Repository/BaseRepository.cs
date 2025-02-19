using LibraryManagement.Core.Entity;

namespace LibraryManagement.Infrastructure.Repository;

public interface BaseRepository<T,VM,LVM> where T : BaseTable where VM : class where LVM : class
{
    public Task<IEnumerable<LVM>> GetAll();
    public Task<LVM> FindById(string id);
    public bool Create(VM viewModel);
    public bool Update(string Id,VM viewModel);
    public bool Delete(string Id);
}