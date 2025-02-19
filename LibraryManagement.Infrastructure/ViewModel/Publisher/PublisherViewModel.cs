using LibraryManagement.Core.Entity;

namespace LibraryManagement.Infrastructure.ViewModel.Publisher;

public class PublisherViewModel
{
    public string Id { set; get; }
    public string Name { set; get; }
    public string Descritpion { set; get; }
    public string PhoneNumber { set; get; }
    public string Email { set; get; }
    public string Address { set; get; }
    public DateTime CreatedDate { set; get; }
    public DateTime UpdatedDate { set; get; }

    public PublisherViewModel()
    {
        
    }

    public PublisherViewModel(PublisherTable publisherTable)
    {
        Id = publisherTable.Id;
        Name = publisherTable.Name;
        Descritpion = publisherTable.Descritpion;
        PhoneNumber = publisherTable.PhoneNumber;
        Email = publisherTable.Email;
        Address = publisherTable.Address;
        CreatedDate = publisherTable.CreatedAt;
        UpdatedDate = publisherTable.UpdatedAt;
    }
}

public class PublisherCreateViewModel
{
    public string Name { set; get; }
    public string Description { set; get; }
    public string PhoneNumber { set; get; }
    public string Email { set; get; }
    public string Address { set; get; }

    public PublisherTable toPublisherTable()
    {
        PublisherTable table = new PublisherTable();
        table.Name = Name;
        table.Descritpion = Description;
        table.PhoneNumber = PhoneNumber;
        table.Email = Email;
        table.Address = Address;
        return table;
    }
}