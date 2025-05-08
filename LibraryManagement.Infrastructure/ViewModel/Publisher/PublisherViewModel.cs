using LibraryManagement.Core.Entities;

namespace LibraryManagement.Infrastructure.ViewModel.Publisher;

public class PublisherViewModel
{
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Address { get; set; }

    public string? ContactPerson { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? Website { get; set; }

    public PublisherViewModel()
    {
        
    }

    public PublisherViewModel(Publishers publisherTable)
    {
        Id = publisherTable.PublisherId;
        Name = publisherTable.Name;
        ContactPerson = publisherTable.ContactPerson;
        Phone = publisherTable.Phone;
        Email = publisherTable.Email;
        Address = publisherTable.Address;
        Website = publisherTable.Website;
    }
}

public class PublisherCreateViewModel
{
    public string Name { get; set; } = null!;

    public string? Address { get; set; }

    public string? ContactPerson { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? Website { get; set; }

    public Publishers toPublisherTable()
    {
        Publishers table = new Publishers();
        table.Name = Name;
        table.ContactPerson = ContactPerson;
        table.Phone = Phone;
        table.Email = Email;
        table.Address = Address;
        table.Website = Website;
        return table;
    }

    public Publishers UpdatePublishers(Publishers table)
    {
        table.Name = Name;
        table.ContactPerson = ContactPerson;
        table.Phone = Phone;
        table.Email = Email;
        table.Address = Address;
        table.Website = Website;
        return table;
    }
}