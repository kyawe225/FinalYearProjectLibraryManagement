namespace LibraryManagement.Infrastructure.Repository;

public interface BaseRepository<T , CT , VT> where T : class where VT:class where CT : class
{
    Task<IEnumerable<VT>> GetAll();
    Task<VT> FindById(string id);
    bool Create(CT viewModel);
    bool Update(string Id, CT viewModel);
    bool Delete(string Id);
}
