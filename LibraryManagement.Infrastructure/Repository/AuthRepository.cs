using LibraryManagement.Core.Entity;
using LibraryManagement.Infrastructure.Context;
using LibraryManagement.Infrastructure.Services;
using LibraryManagement.Infrastructure.ViewModel.User;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Infrastructure.Repository;

public interface IAuthRepository
{
    public Task<LoginResponse?> Login(LoginViewModel loginViewModel);
    public Task<bool> Register(RegisterViewModel registerViewModel);
}

public class AuthRepository : IAuthRepository
{
    private ITokenService _tokenService;
    private LibraryManagementDbContext _context;

    public AuthRepository(ITokenService service, LibraryManagementDbContext context)
    {
        _tokenService = service;
        _context = context;
    }
    
    public async Task<LoginResponse?> Login(LoginViewModel loginViewModel)
    {
        var user= await _context.users.Where(p => p.Email == loginViewModel.Email).Include(p=> p.Role).FirstOrDefaultAsync();
        if (user != null)
        {
            if (Utils.Verify(loginViewModel.Password, user.Password))
            {
                var token= _tokenService.GenerateToken(user);
                return token;
            }
        }
        return null;
    }

    public async Task<bool> Register(RegisterViewModel registerViewModel)
    {
        UserTable user= registerViewModel.toUserTable();
        
        var role= await _context.roles.Where(p => p.Name == "user").FirstOrDefaultAsync();
        user.RoleId = role?.Id ?? "";
        //someone check isstudnet or not
        _context.users.Add(user);
        await _context.SaveChangesAsync();
        return true;
    }
}