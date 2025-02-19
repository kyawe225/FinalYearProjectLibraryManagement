using LibraryManagement.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace LibraryManagement.Infrastructure;

public static class Extensions
{
    public static void AddPostgresql(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<LibraryManagementDbContext>( p=> p.UseNpgsql(connectionString,q=> q.MigrationsAssembly("LibraryManagement.Api")));
    }
}