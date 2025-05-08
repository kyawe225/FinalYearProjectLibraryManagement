namespace LibraryManagement.Infrastructure.ViewModel.ELibraryAccess;

public class ELibraryAccessViewModel
{
    public string UserId { set; get; }
    public DateTime ExpireTime { set; get; }
    public string Id { set; get; }
    public DateTime CreatedAt { set; get; }
    public DateTime UpdatedAt { set; get; }
}

public class ELibraryAccessCreateViewModel
{
    public string UserId { set; get; }
    public DateTime ExpireTime { set; get; }
}