using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagement.Core.Entity;

public class ShelfSection : BaseTable
{
    public string SectionId { set; get; }
    public string Name { set; get; }
    public string Barcode { set; get; }
    [ForeignKey("SectionId")]
    public Section Section { set; get; }
}