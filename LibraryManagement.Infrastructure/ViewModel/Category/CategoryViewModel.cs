namespace LibraryManagement.Infrastructure.ViewModel.Category;

public class CategoryViewModel
{
    public string Name { set; get; }
    public string Description { set; get; }
    public string Id { set; get; }
    public DateTime UpdatedAt { set; get; }
    public DateTime CreatedAt { set; get; }

    public CategoryViewModel(Core.Entity.Category model)
    {
        Name = model.Name;
        Description = model.Description;
        Id = model.Id;
        UpdatedAt = model.UpdatedAt;
        CreatedAt = model.CreatedAt;
    }
}

public class CategoryCreateViewModel
{
    public string Name { set; get; }
    public string Description { set; get; }

    public Core.Entity.Category toCategoryTable()
    {
        Core.Entity.Category category = new Core.Entity.Category();
        category.Name = Name;
        category.Description = Description;
        return category;
    }
}