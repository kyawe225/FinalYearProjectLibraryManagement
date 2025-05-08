using System.ComponentModel.DataAnnotations;
using LibraryManagement.Infrastructure.ViewModel.Book;

namespace LibraryManagement.Infrastructure.ViewModel.Category;

public class CategoryViewModel
{
    /// <summary>
        /// Unique identifier for the category
        /// </summary>
        public string Id { get; set; }
        
        /// <summary>
        /// Name of the category
        /// </summary>
        public string Name { get; set; }
        
        /// <summary>
        /// ID of the parent category (if this is a subcategory)
        /// </summary>
        public string ParentCategoryId { get; set; }
        
        /// <summary>
        /// Description of the category
        /// </summary>
        public string Description { get; set; }
        
        /// <summary>
        /// Navigation property for the parent category
        /// </summary>
        public virtual CategoryViewModel? ParentCategory { get; set; }
        
        /// <summary>
        /// Collection of subcategories under this category
        /// </summary>
        public virtual ICollection<CategoryViewModel> SubCategories { get; set; }
        
        /// <summary>
        /// Collection of books in this category
        /// </summary>
        public virtual ICollection<BookViewModel> Books { get; set; }
    public CategoryViewModel(Core.Entities.Category model)
    {
        Name = model.CategoryName;
        Description = model.Description;
        Id = model.CategoryId;
        ParentCategoryId= "";
    }
}

public class CategoryCreateViewModel
{
    [Required]
    public string Name { set; get; }
    [Required]
    public string Description { set; get; }
    public string? ParentCategoryId {set;get;}
    public Core.Entities.Category toCategoryTable()
    {
        Core.Entities.Category category = new Core.Entities.Category();
        category.CategoryName = Name;
        category.Description = Description;
        category.ParentCategoryId = ParentCategoryId;
        return category;
    }
}