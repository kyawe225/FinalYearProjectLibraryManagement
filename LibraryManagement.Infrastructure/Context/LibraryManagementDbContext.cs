using LibraryManagement.Core.Entity;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Infrastructure.Context;

public class LibraryManagementDbContext : DbContext
{
    public LibraryManagementDbContext(DbContextOptions<LibraryManagementDbContext> options) : base(options) { }

    public DbSet<RoleTable> roles { set; get; }
    public DbSet<UserTable> users { set; get; }

    public DbSet<ELibraryAccess> eLibraryAccesses { set; get; }


    public DbSet<PublisherTable> publishers { set; get; }
    public DbSet<Category> categories { set; get; }
    public DbSet<BookTable> books { set; get; }


    public DbSet<LoanTable> loans { set; get; }
    public DbSet<InventoryBooks> inventoryBooks { set; get; }
    public DbSet<LateFeeTable> lateFees { set; get; }
    public DbSet<Section> sections { set; get; }
    public DbSet<ShelfSection> shelfSections { set; get; }
    // category still left
    // User Settings still left
    public DbSet<IndividualSettings> individual_settings { set; get; }
    public DbSet<Reservation> reservation { set; get; }
    public DbSet<WishBookTable> wishBooks { set; get; }
    // admin settings still left
    public DbSet<AdminSettings> admin_settings { set; get; }

    public DbSet<AdminMeetingTable> admin_meetings { set; get; }
    public DbSet<InvitedPersonsTable> invited_psersons { set; get; }
    public DbSet<EventTable> events { set; get; }
    public DbSet<AttendPersonsTable> attend_person { set; get; }
    public DbSet<NewsTable> news { set; get; }
    public DbSet<FeedbackTable> feedbacks { set; get; }
}