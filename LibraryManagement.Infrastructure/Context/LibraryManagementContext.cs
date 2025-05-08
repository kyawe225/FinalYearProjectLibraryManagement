using LibraryManagement.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Infrastructure.Context;

public partial class LibraryManagementContext : DbContext
{
    public LibraryManagementContext()
    {
    }

    public LibraryManagementContext(DbContextOptions<LibraryManagementContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Appointment> Appointments { get; set; }

    public virtual DbSet<Author> Authors { get; set; }

    public virtual DbSet<Book> Books { get; set; }

    public virtual DbSet<BookCopy> BookCopies { get; set; }

    public virtual DbSet<BookLoan> BookLoans { get; set; }

    public virtual DbSet<BookReview> BookReviews { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Computer> Computers { get; set; }

    public virtual DbSet<ComputerReservation> ComputerReservations { get; set; }

    public virtual DbSet<ComputerSession> ComputerSessions { get; set; }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<EventRegistration> EventRegistrations { get; set; }

    public virtual DbSet<Fine> Fines { get; set; }

    public virtual DbSet<LibraryBranch> LibraryBranches { get; set; }

    public virtual DbSet<Member> Members { get; set; }

    public virtual DbSet<Publishers> Publishers { get; set; }

    public virtual DbSet<Reservation> Reservations { get; set; }

    public virtual DbSet<Staff> Staff { get; set; }

    public virtual DbSet<Wish> Wishes { get; set; }
    public virtual DbSet<FeedBack> FeedBacks { set; get; }
    public virtual DbSet<NewsTable> News { set; get; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.AppointmentId).HasName("appointments_pkey");

            entity.ToTable("appointments");

            entity.Property(e => e.AppointmentId)
                .HasMaxLength(36)
                .HasColumnName("appointment_id");
            entity.Property(e => e.AppointmentDate).HasColumnName("appointment_date");
            entity.Property(e => e.BranchId)
                .HasMaxLength(36)
                .HasColumnName("branch_id");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_date");
            entity.Property(e => e.EndTime).HasColumnName("end_time");
            entity.Property(e => e.MemberId)
                .HasMaxLength(36)
                .HasColumnName("member_id");
            entity.Property(e => e.ModifiedDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("modified_date");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.Purpose)
                .HasMaxLength(255)
                .HasColumnName("purpose");
            entity.Property(e => e.StaffId)
                .HasMaxLength(36)
                .HasColumnName("staff_id");
            entity.Property(e => e.StartTime).HasColumnName("start_time");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Scheduled'::character varying")
                .HasColumnName("status");

            entity.HasOne(d => d.Branch).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.BranchId)
                .HasConstraintName("appointments_branch_id_fkey");

            entity.HasOne(d => d.Member).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.MemberId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("appointments_member_id_fkey");

            entity.HasOne(d => d.Staff).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.StaffId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("appointments_staff_id_fkey");
        });

        modelBuilder.Entity<Author>(entity =>
        {
            entity.HasKey(e => e.AuthorId).HasName("authors_pkey");

            entity.ToTable("authors");

            entity.HasIndex(e => new { e.FirstName, e.LastName }, "unique_author").IsUnique();

            entity.Property(e => e.AuthorId)
                .HasMaxLength(36)
                .HasColumnName("author_id");
            entity.Property(e => e.Biography).HasColumnName("biography");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.FirstName)
                .HasMaxLength(100)
                .HasColumnName("first_name");
            entity.Property(e => e.LastName)
                .HasMaxLength(100)
                .HasColumnName("last_name");
        });

        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.BookId).HasName("books_pkey");

            entity.ToTable("books");

            entity.HasIndex(e => e.Isbn, "books_isbn_key").IsUnique();

            entity.Property(e => e.BookId)
                .HasMaxLength(36)
                .HasColumnName("book_id");
            entity.Property(e => e.Edition).HasMaxLength(125).HasColumnName("edition");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.BookId)
                .HasMaxLength(36)
                .HasColumnName("book_id");

            entity.Property(e => e.AddedDate)
                .HasDefaultValueSql("CURRENT_DATE")
                .HasColumnName("added_date");
            entity.Property(e => e.AvailableCopies)
                .HasDefaultValue(1)
                .HasColumnName("available_copies");
            entity.Property(e => e.CategoryId)
                .HasMaxLength(36)
                .HasColumnName("category_id");
            entity.Property(e => e.Isbn)
                .HasMaxLength(20)
                .HasColumnName("isbn");
            entity.Property(e => e.LocationInLibrary)
                .HasMaxLength(50)
                .HasColumnName("location_in_library");
            entity.Property(e => e.PublicationDate).HasColumnName("publication_date");
            entity.Property(e => e.PublisherId)
                .HasMaxLength(36)
                .HasColumnName("publisher_id");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Available'::character varying")
                .HasColumnName("status");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .HasColumnName("title");
            entity.Property(e => e.TotalCopies)
                .HasDefaultValue(1)
                .HasColumnName("total_copies");

            entity.HasOne(d => d.Category).WithMany(p => p.Books)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("books_category_id_fkey");

            entity.HasOne(d => d.Publisher).WithMany(p => p.Books)
                .HasForeignKey(d => d.PublisherId)
                .HasConstraintName("books_publisher_id_fkey");

            entity.HasMany(d => d.Authors).WithMany(p => p.Books)
                .UsingEntity<Dictionary<string, object>>(
                    "BookAuthor",
                    r => r.HasOne<Author>().WithMany()
                        .HasForeignKey("AuthorId")
                        .HasConstraintName("book_authors_author_id_fkey"),
                    l => l.HasOne<Book>().WithMany()
                        .HasForeignKey("BookId")
                        .HasConstraintName("book_authors_book_id_fkey"),
                    j =>
                    {
                        j.HasKey("BookId", "AuthorId").HasName("book_authors_pkey");
                        j.ToTable("book_authors");
                        j.IndexerProperty<string>("BookId")
                            .HasMaxLength(36)
                            .HasColumnName("book_id");
                        j.IndexerProperty<string>("AuthorId")
                            .HasMaxLength(36)
                            .HasColumnName("author_id");
                    });
        });

        modelBuilder.Entity<BookCopy>(entity =>
        {
            entity.HasKey(e => e.CopyId).HasName("book_copies_pkey");

            entity.ToTable("book_copies");

            entity.Property(e => e.CopyId)
                .HasMaxLength(36)
                .HasColumnName("copy_id");
            entity.Property(e => e.AcquisitionDate)
                .HasDefaultValueSql("CURRENT_DATE")
                .HasColumnName("acquisition_date");
            entity.Property(e => e.BookId)
                .HasMaxLength(36)
                .HasColumnName("book_id");
            entity.Property(e => e.BranchId)
                .HasMaxLength(36)
                .HasColumnName("branch_id");
            entity.Property(e => e.Condition)
                .HasMaxLength(50)
                .HasDefaultValueSql("'Good'::character varying")
                .HasColumnName("condition");
            entity.Property(e => e.CopyStatus)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Available'::character varying")
                .HasColumnName("copy_status");

            entity.HasOne(d => d.Book).WithMany(p => p.BookCopies)
                .HasForeignKey(d => d.BookId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("book_copies_book_id_fkey");

            entity.HasOne(d => d.Branch).WithMany(p => p.BookCopies)
                .HasForeignKey(d => d.BranchId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("book_copies_branch_id_fkey");
        });

        modelBuilder.Entity<BookLoan>(entity =>
        {
            entity.HasKey(e => e.LoanId).HasName("book_loans_pkey");

            entity.ToTable("book_loans");

            entity.Property(e => e.LoanId)
                .HasMaxLength(36)
                .HasColumnName("loan_id");
            entity.Property(e => e.BookId)
                .HasMaxLength(36)
                .HasColumnName("book_id");
            entity.Property(e => e.DateBorrowed)
                .HasDefaultValueSql("CURRENT_DATE")
                .HasColumnName("date_borrowed");
            entity.Property(e => e.DateReturned).HasColumnName("date_returned");
            entity.Property(e => e.DueDate).HasColumnName("due_date");
            entity.Property(e => e.FineAmount)
                .HasPrecision(10, 2)
                .HasDefaultValueSql("0.00")
                .HasColumnName("fine_amount");
            entity.Property(e => e.MemberId)
                .HasMaxLength(36)
                .HasColumnName("member_id");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Active'::character varying")
                .HasColumnName("status");

            entity.HasOne(d => d.Book).WithMany(p => p.BookLoans)
                .HasForeignKey(d => d.BookId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("book_loans_book_id_fkey");

            entity.HasOne(d => d.Member).WithMany(p => p.BookLoans)
                .HasForeignKey(d => d.MemberId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("book_loans_member_id_fkey");
        });

        modelBuilder.Entity<BookReview>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("book_reviews_pkey");

            entity.ToTable("book_reviews");

            entity.HasIndex(e => new { e.MemberId, e.BookId }, "unique_member_book_review").IsUnique();

            entity.Property(e => e.ReviewId)
                .HasMaxLength(36)
                .HasColumnName("review_id");
            entity.Property(e => e.BookId)
                .HasMaxLength(36)
                .HasColumnName("book_id");
            entity.Property(e => e.MemberId)
                .HasMaxLength(36)
                .HasColumnName("member_id");
            entity.Property(e => e.Rating).HasColumnName("rating");
            entity.Property(e => e.ReviewDate)
                .HasDefaultValueSql("CURRENT_DATE")
                .HasColumnName("review_date");
            entity.Property(e => e.ReviewText).HasColumnName("review_text");

            entity.HasOne(d => d.Book).WithMany(p => p.BookReviews)
                .HasForeignKey(d => d.BookId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("book_reviews_book_id_fkey");

            entity.HasOne(d => d.Member).WithMany(p => p.BookReviews)
                .HasForeignKey(d => d.MemberId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("book_reviews_member_id_fkey");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("categories_pkey");

            entity.ToTable("categories");

            entity.HasIndex(e => e.CategoryName, "categories_category_name_key").IsUnique();

            entity.Property(e => e.CategoryId)
                .HasMaxLength(36)
                .HasColumnName("category_id");
            entity.Property(e => e.CategoryName)
                .HasMaxLength(100)
                .HasColumnName("category_name");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.ParentCategoryId)
                .HasMaxLength(36)
                .HasColumnName("parent_category_id");

            entity.HasOne(d => d.ParentCategory).WithMany(p => p.InverseParentCategory)
                .HasForeignKey(d => d.ParentCategoryId)
                .HasConstraintName("categories_parent_category_id_fkey");
        });

        modelBuilder.Entity<Computer>(entity =>
        {
            entity.HasKey(e => e.ComputerId).HasName("computers_pkey");

            entity.ToTable("computers");

            entity.Property(e => e.ComputerId)
                .HasMaxLength(36)
                .HasColumnName("computer_id");
            entity.Property(e => e.AcquisitionDate).HasColumnName("acquisition_date");
            entity.Property(e => e.BranchId)
                .HasMaxLength(36)
                .HasColumnName("branch_id");
            entity.Property(e => e.ComputerName)
                .HasMaxLength(50)
                .HasColumnName("computer_name");
            entity.Property(e => e.ComputerType)
                .HasMaxLength(50)
                .HasColumnName("computer_type");
            entity.Property(e => e.InstalledSoftware).HasColumnName("installed_software");
            entity.Property(e => e.LastMaintenanceDate).HasColumnName("last_maintenance_date");
            entity.Property(e => e.LocationInLibrary)
                .HasMaxLength(100)
                .HasColumnName("location_in_library");
            entity.Property(e => e.OperatingSystem)
                .HasMaxLength(100)
                .HasColumnName("operating_system");
            entity.Property(e => e.Specifications).HasColumnName("specifications");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Available'::character varying")
                .HasColumnName("status");
            entity.Property(e => e.TimeLimitMinutes)
                .HasDefaultValue(60)
                .HasColumnName("time_limit_minutes");

            entity.HasOne(d => d.Branch).WithMany(p => p.Computers)
                .HasForeignKey(d => d.BranchId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("computers_branch_id_fkey");
        });

        modelBuilder.Entity<ComputerReservation>(entity =>
        {
            entity.HasKey(e => e.ReservationId).HasName("computer_reservations_pkey");

            entity.ToTable("computer_reservations");

            entity.Property(e => e.ReservationId)
                .HasMaxLength(36)
                .HasColumnName("reservation_id");
            entity.Property(e => e.ComputerId)
                .HasMaxLength(36)
                .HasColumnName("computer_id");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_date");
            entity.Property(e => e.EndTime).HasColumnName("end_time");
            entity.Property(e => e.MemberId)
                .HasMaxLength(36)
                .HasColumnName("member_id");
            entity.Property(e => e.ReservationDate).HasColumnName("reservation_date");
            entity.Property(e => e.StartTime).HasColumnName("start_time");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Active'::character varying")
                .HasColumnName("status");

            entity.HasOne(d => d.Computer).WithMany(p => p.ComputerReservations)
                .HasForeignKey(d => d.ComputerId)
                .HasConstraintName("computer_reservations_computer_id_fkey");

            entity.HasOne(d => d.Member).WithMany(p => p.ComputerReservations)
                .HasForeignKey(d => d.MemberId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("computer_reservations_member_id_fkey");
        });

        modelBuilder.Entity<ComputerSession>(entity =>
        {
            entity.HasKey(e => e.SessionId).HasName("computer_sessions_pkey");

            entity.ToTable("computer_sessions");

            entity.Property(e => e.SessionId)
                .HasMaxLength(36)
                .HasColumnName("session_id");
            entity.Property(e => e.ComputerId)
                .HasMaxLength(36)
                .HasColumnName("computer_id");
            entity.Property(e => e.EndTime)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("end_time");
            entity.Property(e => e.MemberId)
                .HasMaxLength(36)
                .HasColumnName("member_id");
            entity.Property(e => e.SessionStatus)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Active'::character varying")
                .HasColumnName("session_status");
            entity.Property(e => e.StartTime)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("start_time");

            entity.HasOne(d => d.Computer).WithMany(p => p.ComputerSessions)
                .HasForeignKey(d => d.ComputerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("computer_sessions_computer_id_fkey");

            entity.HasOne(d => d.Member).WithMany(p => p.ComputerSessions)
                .HasForeignKey(d => d.MemberId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("computer_sessions_member_id_fkey");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.EventId).HasName("events_pkey");

            entity.ToTable("events");

            entity.Property(e => e.EventId)
                .HasMaxLength(36)
                .HasColumnName("event_id");
            entity.Property(e => e.BranchId)
                .HasMaxLength(36)
                .HasColumnName("branch_id");
            entity.Property(e => e.CurrentAttendees)
                .HasDefaultValue(0)
                .HasColumnName("current_attendees");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.EndTime).HasColumnName("end_time");
            entity.Property(e => e.EventDate).HasColumnName("event_date");
            entity.Property(e => e.EventName)
                .HasMaxLength(255)
                .HasColumnName("event_name");
            entity.Property(e => e.EventStatus)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Upcoming'::character varying")
                .HasColumnName("event_status");
            entity.Property(e => e.EventType)
                .HasMaxLength(50)
                .HasColumnName("event_type");
            entity.Property(e => e.MaxAttendees).HasColumnName("max_attendees");
            entity.Property(e => e.OrganizerId)
                .HasMaxLength(36)
                .HasColumnName("organizer_id");
            entity.Property(e => e.RegistrationRequired)
                .HasDefaultValue(false)
                .HasColumnName("registration_required");
            entity.Property(e => e.StartTime).HasColumnName("start_time");

            entity.HasOne(d => d.Branch).WithMany(p => p.Events)
                .HasForeignKey(d => d.BranchId)
                .HasConstraintName("events_branch_id_fkey");

            entity.HasOne(d => d.Organizer).WithMany(p => p.Events)
                .HasForeignKey(d => d.OrganizerId)
                .HasConstraintName("events_organizer_id_fkey");
        });

        modelBuilder.Entity<EventRegistration>(entity =>
        {
            entity.HasKey(e => e.RegistrationId).HasName("event_registrations_pkey");

            entity.ToTable("event_registrations");

            entity.HasIndex(e => new { e.EventId, e.MemberId }, "unique_event_member").IsUnique();

            entity.Property(e => e.RegistrationId)
                .HasMaxLength(36)
                .HasColumnName("registration_id");
            entity.Property(e => e.AttendanceStatus)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Registered'::character varying")
                .HasColumnName("attendance_status");
            entity.Property(e => e.EventId)
                .HasMaxLength(36)
                .HasColumnName("event_id");
            entity.Property(e => e.MemberId)
                .HasMaxLength(36)
                .HasColumnName("member_id");
            entity.Property(e => e.RegistrationDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("registration_date");

            entity.HasOne(d => d.Event).WithMany(p => p.EventRegistrations)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("event_registrations_event_id_fkey");

            entity.HasOne(d => d.Member).WithMany(p => p.EventRegistrations)
                .HasForeignKey(d => d.MemberId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("event_registrations_member_id_fkey");
        });

        modelBuilder.Entity<Fine>(entity =>
        {
            entity.HasKey(e => e.FineId).HasName("fines_pkey");

            entity.ToTable("fines");

            entity.Property(e => e.FineId)
                .HasMaxLength(36)
                .HasColumnName("fine_id");
            entity.Property(e => e.FineAmount)
                .HasPrecision(10, 2)
                .HasColumnName("fine_amount");
            entity.Property(e => e.FineDate)
                .HasDefaultValueSql("CURRENT_DATE")
                .HasColumnName("fine_date");
            entity.Property(e => e.LoanId)
                .HasMaxLength(36)
                .HasColumnName("loan_id");
            entity.Property(e => e.MemberId)
                .HasMaxLength(36)
                .HasColumnName("member_id");
            entity.Property(e => e.PaymentDate).HasColumnName("payment_date");
            entity.Property(e => e.PaymentStatus)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Unpaid'::character varying")
                .HasColumnName("payment_status");

            entity.HasOne(d => d.Loan).WithMany(p => p.Fines)
                .HasForeignKey(d => d.LoanId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fines_loan_id_fkey");

            entity.HasOne(d => d.Member).WithMany(p => p.Fines)
                .HasForeignKey(d => d.MemberId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fines_member_id_fkey");
        });

        modelBuilder.Entity<LibraryBranch>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("library_branches_pkey");

            entity.ToTable("library_branches");

            entity.Property(e => e.Id)
                .HasMaxLength(36)
                .HasColumnName("id");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.BranchName)
                .HasMaxLength(100)
                .HasColumnName("branch_name");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.ManagerId)
                .HasMaxLength(36)
                .HasColumnName("manager_id");
            entity.Property(e => e.OpeningHours).HasColumnName("opening_hours");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .HasColumnName("phone");

            entity.HasOne(d => d.Manager).WithMany(p => p.LibraryBranches)
                .HasForeignKey(d => d.ManagerId)
                .HasConstraintName("library_branches_manager_id_fkey");
        });

        modelBuilder.Entity<Member>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("members_pkey");

            entity.ToTable("members");

            entity.HasIndex(e => e.Email, "members_email_key").IsUnique();

            entity.Property(e => e.Id)
                .HasMaxLength(36)
                .HasColumnName("id");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(100)
                .HasColumnName("first_name");
            entity.Property(e => e.LastName)
                .HasMaxLength(100)
                .HasColumnName("last_name");
            entity.Property(e => e.MembershipDate)
                .HasDefaultValueSql("CURRENT_DATE")
                .HasColumnName("membership_date");
            entity.Property(e => e.MembershipExpiry).HasColumnName("membership_expiry");
            entity.Property(e => e.MembershipStatus)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Active'::character varying")
                .HasColumnName("membership_status");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(20)
                .HasColumnName("phone_number");
        });

        modelBuilder.Entity<Publishers>(entity =>
        {
            entity.HasKey(e => e.PublisherId).HasName("publishers_pkey");

            entity.ToTable("publishers");

            entity.HasIndex(e => e.Name, "publishers_name_key").IsUnique();

            entity.Property(e => e.PublisherId)
                .HasMaxLength(36)
                .HasColumnName("publisher_id");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.ContactPerson)
                .HasMaxLength(100)
                .HasColumnName("contact_person");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .HasColumnName("phone");
            entity.Property(e => e.Website)
                .HasMaxLength(255)
                .HasColumnName("website");
        });

        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("reservations_pkey");

            entity.ToTable("reservations");

            entity.Property(e => e.Id)
                .HasMaxLength(36)
                .HasColumnName("id");
            entity.Property(e => e.BookId)
                .HasMaxLength(36)
                .HasColumnName("book_id");
            entity.Property(e => e.MemberId)
                .HasMaxLength(36)
                .HasColumnName("member_id");
            entity.Property(e => e.ReservationDate)
                .HasDefaultValueSql("CURRENT_DATE")
                .HasColumnName("reservation_date");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Active'::character varying")
                .HasColumnName("status");

            entity.HasOne(d => d.Book).WithMany(p => p.Reservations)
                .HasForeignKey(d => d.BookId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("reservations_book_id_fkey");

            entity.HasOne(d => d.Member).WithMany(p => p.Reservations)
                .HasForeignKey(d => d.MemberId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("reservations_member_id_fkey");
        });

        modelBuilder.Entity<Staff>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("staff_pkey");

            entity.ToTable("staff");

            entity.HasIndex(e => e.Email, "staff_email_key").IsUnique();

            entity.HasIndex(e => e.Username, "staff_username_key").IsUnique();

            entity.Property(e => e.Id)
                .HasMaxLength(36)
                .HasColumnName("id");
            entity.Property(e => e.DateHired).HasColumnName("date_hired");
            entity.Property(e => e.Department)
                .HasMaxLength(100)
                .HasColumnName("department");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(100)
                .HasColumnName("first_name");
            entity.Property(e => e.LastName)
                .HasMaxLength(100)
                .HasColumnName("last_name");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .HasColumnName("phone");
            entity.Property(e => e.Position)
                .HasMaxLength(100)
                .HasColumnName("position");
            entity.Property(e => e.Status)
                .HasMaxLength(255)
                .HasDefaultValueSql("'active'::character varying")
                .HasColumnName("status");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        modelBuilder.Entity<Wish>(entity =>
        {
            entity.HasKey(e => e.WishId).HasName("wishes_pkey");

            entity.ToTable("wishes");

            entity.HasIndex(e => new { e.MemberId, e.BookId }, "unique_member_book_wish").IsUnique();

            entity.Property(e => e.WishId)
                .HasMaxLength(36)
                .HasColumnName("wish_id");
            entity.Property(e => e.BookId)
                .HasMaxLength(36)
                .HasColumnName("book_id");
            entity.Property(e => e.DateAdded)
                .HasDefaultValueSql("CURRENT_DATE")
                .HasColumnName("date_added");
            entity.Property(e => e.MemberId)
                .HasMaxLength(36)
                .HasColumnName("member_id");
            entity.Property(e => e.Notes).HasColumnName("notes");

            entity.HasOne(d => d.Book).WithMany(p => p.Wishes)
                .HasForeignKey(d => d.BookId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("wishes_book_id_fkey");

            entity.HasOne(d => d.Member).WithMany(p => p.Wishes)
                .HasForeignKey(d => d.MemberId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("wishes_member_id_fkey");
        });

        modelBuilder.Entity<FeedBack>((builder) =>
        {
            builder.ToTable("feedbacks");

            // Primary key
            builder.HasKey(x => x.Id);

            // Properties configuration
            builder.Property(x => x.Id)
                .HasColumnName("id")
                .IsRequired()
                .HasMaxLength(36); // Assuming UUID/GUID string format based on your DB schema

            builder.Property(x => x.Name)
                .HasColumnName("name")
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Email)
                .HasColumnName("email")
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Feedback)
                .HasColumnName("feedback")
                .IsRequired()
                .HasColumnType("TEXT"); // Using TEXT type for potentially longer feedback content

            builder.Property(x => x.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired()
                .HasColumnType("timestamp with time zone")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<NewsTable>((builder) =>
        {
            builder.ToTable("news", "public");

            // Properties configuration
            builder.Property(n => n.NewsId)
                .HasColumnName("news_id")
                .HasColumnType("varchar(36)")
                .IsRequired();

            builder.Property(n => n.Title)
                .HasColumnName("title")
                .HasColumnType("varchar(255)")
                .IsRequired();

            builder.Property(n => n.Content)
                .HasColumnName("content")
                .HasColumnType("text")
                .IsRequired();

            builder.Property(n => n.PublicationDate)
                .HasColumnName("publication_date")
                .HasColumnType("timestamptz")
                .IsRequired()
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Property(n => n.ExpiryDate)
                .HasColumnName("expiry_date")
                .HasColumnType("timestamptz")
                .IsRequired(false);

            builder.Property(n => n.PublishedById)
                .HasColumnName("published_by")
                .HasColumnType("varchar(36)")
                .IsRequired();

            builder.Property(n => n.BranchId)
                .HasColumnName("branch_id")
                .HasColumnType("varchar(36)")
                .IsRequired(false);

            builder.Property(n => n.ImportanceLevel)
                .HasColumnName("importance_level")
                .HasColumnType("varchar(20)")
                .IsRequired(false)
                .HasDefaultValue("Normal");

            builder.Property(n => n.Visibility)
                .HasColumnName("visibility")
                .HasColumnType("varchar(20)")
                .IsRequired(false)
                .HasDefaultValue("Public");

            builder.Property(n => n.Category)
                .HasColumnName("category")
                .HasColumnType("varchar(100)")
                .IsRequired(false);

            builder.Property(n => n.ImageUrl)
                .HasColumnName("image_url")
                .HasColumnType("varchar(255)")
                .IsRequired(false);

            // Check constraint
            builder.HasCheckConstraint("news_check",
                "(expiry_date IS NULL OR expiry_date > publication_date)");

            // Relationships
            builder.HasOne(n => n.PublishedBy)
                .WithMany()
                .HasForeignKey(n => n.PublishedById)
                .HasConstraintName("news_published_by_fkey")
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(n => n.Branch)
                .WithMany()
                .HasForeignKey(n => n.BranchId)
                .HasConstraintName("news_branch_id_fkey")
                .OnDelete(DeleteBehavior.Restrict);
        });


        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}